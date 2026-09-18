"""
Main CV Module - Real-time Processing Loop

Coordinates all CV modules:
- Face detection
- Eye contact detection
- Blink detection  
- Head pose estimation
- Confidence calculation
- Real-time video processing

Usage:
    python main.py

Output:
- Real-time video display with overlay metrics
- JSON API via Flask server (on port 5000)

Architecture:
    Webcam Input
         ↓
    Face Detection (MediaPipe)
         ↓
    Landmark Extraction
         ↓
    ┌────┴────┬─────────┬──────────┐
    ↓         ↓         ↓          ↓
  Eye      Blink    Head Pose   Expression
  Contact  Detect   Estimate    (optional)
    ↓         ↓         ↓          ↓
    └────┬────┴─────────┴──────────┘
         ↓
    Confidence Calculator
         ↓
    JSON Output / Display / API
"""

import cv2
import numpy as np
import sys
from threading import Thread
import json

from face_detection import FaceDetector
from eye_contact import EyeContactDetector
from blink_detection import BlinkDetector
from head_pose import HeadPoseEstimator
from confidence import ConfidenceCalculator
from config import (
    CAMERA_ID,
    CAMERA_WIDTH,
    CAMERA_HEIGHT,
    CAMERA_FPS,
    FRAME_SKIP
)


class CVModule:
    """
    Main Computer Vision Module for interview confidence assessment.
    """
    
    def __init__(self, use_camera=True):
        """Initialize all CV components."""
        print("[CV Module] Initializing...")
        
        # Initialize components
        self.face_detector = FaceDetector()
        self.eye_contact_detector = EyeContactDetector()
        self.blink_detector = BlinkDetector(fps=CAMERA_FPS)
        self.head_pose_estimator = HeadPoseEstimator()
        self.confidence_calculator = ConfidenceCalculator()
        
        # Camera setup
        self.cap = None
        self.is_running = False
        self.frame_count = 0
        self.current_metrics = {}
        
        # The web server can receive frames from the browser camera instead.
        if use_camera:
            self._setup_camera()
        
        print("[CV Module] Ready!")

    def process_frame(self, frame):
        """Process a frame supplied by an external camera client."""
        self.frame_count += 1
        if self.frame_count % FRAME_SKIP != 0:
            return self.current_metrics

        self.current_metrics = self._process_frame(frame)
        return self.current_metrics
    
    def _setup_camera(self):
        """Initialize webcam."""
        print("[Camera] Opening camera...")
        self.cap = cv2.VideoCapture(CAMERA_ID)
        
        if not self.cap.isOpened():
            print("[ERROR] Could not open camera. Check camera connection.")
            sys.exit(1)
        
        # Set camera properties
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
        self.cap.set(cv2.CAP_PROP_FPS, CAMERA_FPS)
        
        print("[Camera] Opened successfully")
    
    def run(self, display=True):
        """
        Main processing loop.
        
        Args:
            display: Whether to show video with metrics overlay
        """
        print("[CV Module] Starting processing loop...")
        self.is_running = True
        
        try:
            while self.is_running:
                ret, frame = self.cap.read()
                
                if not ret:
                    print("[ERROR] Failed to read frame")
                    break
                
                self.frame_count += 1
                
                # Skip frames if configured
                if self.frame_count % FRAME_SKIP != 0:
                    continue
                
                # Process frame
                metrics = self._process_frame(frame)
                self.current_metrics = metrics
                
                # Display if requested
                if display:
                    self._display_frame(frame, metrics)
                
                # Check for quit
                if display:
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
        
        except KeyboardInterrupt:
            print("\n[CV Module] Interrupted by user")
        
        finally:
            self.stop()
    
    def _process_frame(self, frame):
        """
        Process a single frame through all CV modules.
        
        Args:
            frame: OpenCV image (BGR)
        
        Returns:
            dict: Processed metrics
        """
        # Step 1: Face Detection
        face_result = self.face_detector.detect(frame)
        
        if not face_result['detected']:
            return {
                'success': False,
                'message': 'No face detected',
                'frame_count': self.frame_count
            }
        
        landmarks = face_result['landmarks']
        
        # Step 2: Eye Contact Detection
        eye_data = self.eye_contact_detector.detect(landmarks)
        
        # Step 3: Blink Detection
        blink_data = self.blink_detector.detect(landmarks)
        
        # Step 4: Head Pose Estimation
        head_data = self.head_pose_estimator.detect(landmarks)
        
        # Step 5: Confidence Calculation
        confidence_data = self.confidence_calculator.calculate(
            eye_data, blink_data, head_data
        )
        
        return {
            'success': True,
            'frame_count': self.frame_count,
            'face': {
                'detected': True,
                'confidence': face_result['confidence']
            },
            'eye_contact': eye_data,
            'blink': blink_data,
            'head_pose': head_data,
            'confidence': confidence_data
        }
    
    def _display_frame(self, frame, metrics):
        """
        Display frame with metrics overlay.
        
        Args:
            frame: OpenCV image
            metrics: Processed metrics dict
        """
        h, w = frame.shape[:2]
        display = frame.copy()
        
        if not metrics.get('success'):
            # Show "No face" message
            cv2.putText(display, "No face detected", (50, 100),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            # Draw face mesh (optional)
            # Uncomment to visualize landmarks
            # landmarks = self.face_detector.detect(frame)['landmarks']
            # if landmarks:
            #     display = self.face_detector.draw_face_mesh(display, landmarks)
            
            # Draw confidence score and key metrics
            conf = metrics['confidence']
            score = conf['confidence_score']
            
            # Background panel
            cv2.rectangle(display, (10, 10), (350, 200), (0, 0, 0), -1)
            cv2.rectangle(display, (10, 10), (350, 200), (0, 255, 0), 2)
            
            # Confidence score (large)
            color = (0, 255, 0) if score >= 70 else (0, 255, 255) if score >= 50 else (0, 0, 255)
            cv2.putText(display, f"Confidence: {score}%",
                       (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 2)
            
            # Breakdown metrics
            y_offset = 85
            cv2.putText(display, f"Eye Contact: {conf['eye_contact_score']}%",
                       (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)
            
            y_offset += 30
            cv2.putText(display, f"Blink Rate: {metrics['blink']['blink_rate']:.1f}/min",
                       (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)
            
            y_offset += 30
            cv2.putText(display, f"Head Stability: {conf['head_stability_score']}%",
                       (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)
            
            y_offset += 30
            head_pos = f"Yaw:{metrics['head_pose']['yaw']:.0f}° Pitch:{metrics['head_pose']['pitch']:.0f}°"
            cv2.putText(display, head_pos,
                       (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            
            # Warnings
            if conf['warnings']:
                y_offset = 230
                cv2.rectangle(display, (10, 220), (w-10, 220 + 40*len(conf['warnings'])),
                             (0, 0, 0), -1)
                cv2.rectangle(display, (10, 220), (w-10, 220 + 40*len(conf['warnings'])),
                             (0, 0, 255), 2)
                
                cv2.putText(display, "Feedback:",
                           (20, y_offset + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                
                for i, warning in enumerate(conf['warnings']):
                    cv2.putText(display, f"• {warning}",
                               (30, y_offset + 55 + i*30),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 1)
        
        # Display frame
        cv2.imshow('Aarambh CV Module', display)
    
    def get_current_metrics(self):
        """
        Get current metrics.
        
        Returns:
            dict: Latest metrics
        """
        return self.current_metrics
    
    def stop(self):
        """Stop processing and clean up."""
        print("[CV Module] Stopping...")
        self.is_running = False
        
        if self.cap:
            self.cap.release()
        
        cv2.destroyAllWindows()
        print("[CV Module] Stopped")


def main():
    """Main entry point."""
    print("=" * 60)
    print("AARAMBH - Computer Vision Module")
    print("Interview Confidence Assessment System")
    print("=" * 60)
    print()
    
    # Initialize CV module
    cv_module = CVModule()
    
    # Run processing loop
    print("[Status] Press 'Q' to quit")
    cv_module.run(display=True)


if __name__ == '__main__':
    main()
