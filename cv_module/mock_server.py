"""
Mock Flask Server for CV Module
================================

This serves mock metrics via API, perfect for demo when
network is down or dependencies can't be installed.

Run this with:
    python mock_server.py

It will start a Flask server on http://localhost:5000
that your frontend can connect to!
"""

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import json
import time
import math
import random
from threading import Thread

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Global mock metrics
class MetricsGenerator:
    def __init__(self):
        self.frame_count = 0
        self.start_time = time.time()
        self.confidence_score = 72
        self.eye_contact_score = 78
        self.blink_score = 85
        self.head_stability_score = 75
        self.gaze_direction = 0
        self.head_yaw = 0
        self.head_pitch = 0
    
    def generate(self):
        """Generate metrics for current frame."""
        self.frame_count += 1
        elapsed = time.time() - self.start_time
        
        # Simulate behavior
        nervousness_factor = math.sin(elapsed / 10) * 5
        self.gaze_direction += random.uniform(-5, 5)
        self.gaze_direction = max(-45, min(45, self.gaze_direction))
        
        raw_eye_contact = max(0, 100 - abs(self.gaze_direction) * 1.5)
        base_blink_rate = 18.5 + nervousness_factor
        raw_blink_score = max(0, 100 - abs(base_blink_rate - 18.5) * 2)
        
        self.head_yaw += random.uniform(-2, 2)
        self.head_pitch += random.uniform(-1, 1)
        self.head_yaw = max(-30, min(30, self.head_yaw))
        self.head_pitch = max(-25, min(25, self.head_pitch))
        
        raw_head_stability = max(0, 100 - (abs(self.head_yaw) + abs(self.head_pitch)) * 1.2)
        
        # Apply smoothing
        self.eye_contact_score = 0.75 * self.eye_contact_score + 0.25 * raw_eye_contact
        self.blink_score = 0.8 * self.blink_score + 0.2 * raw_blink_score
        self.head_stability_score = 0.75 * self.head_stability_score + 0.25 * raw_head_stability
        
        # Calculate confidence
        raw_confidence = (
            0.35 * self.eye_contact_score +
            0.25 * self.blink_score +
            0.25 * self.head_stability_score +
            0.15 * 75
        )
        self.confidence_score = 0.8 * self.confidence_score + 0.2 * raw_confidence
        
        # Generate warnings
        warnings = []
        if self.eye_contact_score < 50:
            warnings.append("Try maintaining eye contact with the camera")
        if self.head_stability_score < 40:
            warnings.append("Try keeping your head steady")
        
        return {
            'success': True,
            'frame_count': self.frame_count,
            'timestamp': time.time(),
            'confidence': {
                'confidence_score': int(self.confidence_score),
                'eye_contact_score': int(self.eye_contact_score),
                'blink_score': int(self.blink_score),
                'head_stability_score': int(self.head_stability_score),
                'facial_expression_score': 75,
                'warnings': warnings,
                'warning_level': self._get_warning_level(),
                'breakdown': {
                    'eye_contact': {
                        'score': int(self.eye_contact_score),
                        'gaze_yaw': round(self.gaze_direction, 2),
                        'gaze_pitch': 0
                    },
                    'blink': {
                        'score': int(self.blink_score),
                        'rate': round(base_blink_rate, 1),
                        'frequency': 'normal' if 15 <= base_blink_rate <= 25 else 'high' if base_blink_rate > 25 else 'low'
                    },
                    'head_stability': {
                        'score': int(self.head_stability_score),
                        'yaw': round(self.head_yaw, 2),
                        'pitch': round(self.head_pitch, 2),
                        'roll': 0
                    }
                }
            },
            'eye_contact': {
                'eye_contact_score': int(self.eye_contact_score),
                'is_looking': abs(self.gaze_direction) < 20,
                'gaze_yaw': round(self.gaze_direction, 2),
                'gaze_pitch': 0,
                'left_eye_opening': 85,
                'right_eye_opening': 82
            },
            'blink': {
                'blink_score': int(self.blink_score),
                'blink_rate': round(base_blink_rate, 1),
                'is_blinking_now': False,
                'blink_frequency_assessment': 'normal',
                'left_ear': 0.285,
                'right_ear': 0.291,
                'total_blinks': int(base_blink_rate * elapsed / 60) if elapsed > 0 else 0
            },
            'head_pose': {
                'head_stability_score': int(self.head_stability_score),
                'yaw': round(self.head_yaw, 2),
                'pitch': round(self.head_pitch, 2),
                'roll': 0,
                'movement_intensity': int(abs(self.head_yaw) + abs(self.head_pitch)),
                'is_stable': abs(self.head_yaw) < 25 and abs(self.head_pitch) < 25
            }
        }
    
    def _get_warning_level(self):
        if self.confidence_score >= 75:
            return 'none'
        elif self.confidence_score >= 60:
            return 'low'
        elif self.confidence_score >= 40:
            return 'medium'
        else:
            return 'high'

# Create generator
metrics_gen = MetricsGenerator()

# ===== API Endpoints =====

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'Aarambh CV Module (Mock)',
        'version': '1.0.0-mock',
        'mode': 'DEMO - Simulated Metrics',
        'timestamp': time.time()
    }), 200

@app.route('/api/metrics/current', methods=['GET'])
def get_metrics():
    metrics = metrics_gen.generate()
    return jsonify(metrics), 200

@app.route('/api/metrics/stream', methods=['POST'])
def stream_metrics():
    def generate():
        try:
            while True:
                metrics = metrics_gen.generate()
                yield f"data: {json.dumps(metrics)}\n\n"
                time.sleep(0.1)  # ~10 FPS updates
        except GeneratorExit:
            pass
    
    return Response(
        generate(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/api/metrics/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'success': True,
        'data': {
            'face_detector': {
                'frames_processed': metrics_gen.frame_count,
                'faces_detected': metrics_gen.frame_count,
                'detection_rate': 100.0
            },
            'blink_detector': {
                'total_blinks': int(metrics_gen.blink_score / 10),
                'total_frames': metrics_gen.frame_count,
                'blink_rate': 18.5
            },
            'total_frames_processed': metrics_gen.frame_count
        },
        'timestamp': time.time()
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

# Main
if __name__ == '__main__':
    print("=" * 60)
    print("AARAMBH - CV Module Mock Server")
    print("=" * 60)
    print()
    print("[Mode] MOCK - Simulated Metrics (No dependencies needed!)")
    print("[Server] Starting Flask on http://localhost:5000")
    print("[Info] This is perfect for demo when network is down")
    print()
    print("API Endpoints:")
    print("  GET  http://localhost:5000/api/health")
    print("  GET  http://localhost:5000/api/metrics/current")
    print("  POST http://localhost:5000/api/metrics/stream")
    print("  GET  http://localhost:5000/api/metrics/stats")
    print()
    print("[Status] Press Ctrl+C to stop")
    print()
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
    except KeyboardInterrupt:
        print("\n[Status] Server stopped")
