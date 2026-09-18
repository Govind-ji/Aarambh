"""
Flask Server for CV Module

Exposes CV metrics via HTTP API for integration with frontend.

Endpoints:
    GET  /api/health          - Health check
    GET  /api/metrics/stream  - Start metrics streaming session
    GET  /api/metrics/current - Get current metrics
    POST /api/metrics/stop    - Stop metrics streaming

The server runs in a separate thread while webcam processing continues.

This allows the frontend to:
1. Request metrics at any time
2. Receive JSON-formatted confidence scores
3. Display real-time feedback
4. Store metrics in backend database

Usage:
    python server.py

The server will start the CV module and Flask API on port 5000.
"""

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import json
import threading
import time
import cv2
import numpy as np
from main import CVModule
from config import FLASK_HOST, FLASK_PORT, FLASK_DEBUG

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global CV module instance
cv_module = None
cv_thread = None
metrics_streaming = False
metrics_lock = threading.Lock()


def _start_cv_module():
    """Start CV module in background thread."""
    global cv_module
    try:
        cv_module = CVModule(use_camera=False)
        print('[CV Module] Waiting for frames from the browser camera')
    except Exception as e:
        print(f"[ERROR] CV Module failed: {e}")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'Aarambh CV Module',
        'version': '1.0.0',
        'timestamp': time.time()
    }), 200


@app.route('/api/metrics/current', methods=['GET'])
def get_current_metrics():
    """
    Get current metrics from CV module.
    
    Returns:
        JSON: {
            'success': bool,
            'data': metrics dict,
            'timestamp': unix timestamp
        }
    """
    if cv_module is None:
        return jsonify({
            'success': False,
            'message': 'CV Module not initialized',
            'data': None
        }), 503
    
    metrics = cv_module.get_current_metrics()
    
    if not metrics:
        return jsonify({
            'success': False,
            'message': 'No metrics available yet',
            'data': None
        }), 202
    
    # Format response
    response_data = {
        'success': metrics.get('success', False),
        'timestamp': time.time(),
        'frame_count': metrics.get('frame_count', 0)
    }
    
    if metrics.get('success'):
        response_data['confidence'] = metrics['confidence']
        response_data['eye_contact'] = metrics['eye_contact']
        response_data['blink'] = metrics['blink']
        response_data['head_pose'] = metrics['head_pose']
    
    return jsonify(response_data), 200


@app.route('/api/metrics/frame', methods=['POST'])
def process_browser_frame():
    """Process one JPEG frame captured by the browser webcam."""
    if cv_module is None:
        return jsonify({'success': False, 'message': 'CV Module not initialized'}), 503

    frame = cv2.imdecode(np.frombuffer(request.get_data(), dtype=np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        return jsonify({'success': False, 'message': 'Invalid image frame'}), 400

    with metrics_lock:
        metrics = cv_module.process_frame(frame)

    return jsonify(metrics), 200


@app.route('/api/metrics/stream', methods=['GET'])
def stream_metrics():
    """
    Stream metrics as Server-Sent Events (SSE).
    
    Allows real-time metric updates without polling.
    """
    def generate():
        """Generator for SSE stream."""
        try:
            while True:
                if cv_module:
                    metrics = cv_module.get_current_metrics()
                    if metrics:
                        yield f"data: {json.dumps(metrics)}\n\n"
                
                time.sleep(0.1)  # ~10 FPS for API updates
        
        except GeneratorExit:
            return
    
    return Response(
        generate(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/api/metrics/stop', methods=['POST'])
def stop_streaming():
    """Stop metrics streaming."""
    global metrics_streaming
    metrics_streaming = False
    
    return jsonify({
        'success': True,
        'message': 'Streaming stopped'
    }), 200


@app.route('/api/metrics/stats', methods=['GET'])
def get_statistics():
    """
    Get statistics about CV module performance.
    
    Returns:
        JSON: Detection rates, performance metrics
    """
    if cv_module is None:
        return jsonify({
            'success': False,
            'message': 'CV Module not initialized'
        }), 503
    
    stats = {
        'face_detector': cv_module.face_detector.get_stats(),
        'blink_detector': cv_module.blink_detector.get_stats(),
        'total_frames_processed': cv_module.frame_count
    }
    
    return jsonify({
        'success': True,
        'data': stats,
        'timestamp': time.time()
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'message': str(error)
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': str(error)
    }), 500


def main():
    """Start Flask server and CV module."""
    global cv_thread
    
    print("=" * 60)
    print("AARAMBH - CV Module Server")
    print("=" * 60)
    print()
    
    # Start CV module in background thread
    print("[Server] Starting CV module...")
    cv_thread = threading.Thread(target=_start_cv_module, daemon=True)
    cv_thread.start()
    
    # Wait for CV module to initialize
    time.sleep(2)
    
    # Start Flask server
    print(f"[Server] Starting Flask on {FLASK_HOST}:{FLASK_PORT}")
    print("[Server] API endpoints:")
    print(f"  GET  http://localhost:{FLASK_PORT}/api/health")
    print(f"  GET  http://localhost:{FLASK_PORT}/api/metrics/current")
    print(f"  GET  http://localhost:{FLASK_PORT}/api/metrics/stream")
    print(f"  GET  http://localhost:{FLASK_PORT}/api/metrics/stats")
    print()
    
    try:
        app.run(
            host=FLASK_HOST,
            port=FLASK_PORT,
            debug=FLASK_DEBUG,
            use_reloader=False,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n[Server] Stopping...")
    finally:
        if cv_module:
            cv_module.stop()


if __name__ == '__main__':
    main()
