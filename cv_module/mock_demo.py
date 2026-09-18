"""
AARAMBH CV Module - Mock Version for Demo
===========================================

This is a LIGHTWEIGHT version that:
- Generates realistic confidence metrics
- Simulates real face detection and analysis
- Works WITHOUT requiring MediaPipe downloads
- Perfect for tomorrow's demo if network is down

To use this instead of the full version:
- Rename this file to main.py (backup the original)
- Run: python main.py

This gives you a working demo in seconds!
"""

import json
import time
import random
import math
from datetime import datetime

class MockCVModule:
    """Mock CV Module that simulates real behavior without external dependencies."""
    
    def __init__(self):
        """Initialize mock metrics."""
        self.frame_count = 0
        self.session_start = time.time()
        
        # Initial values
        self.confidence_score = 72
        self.eye_contact_score = 78
        self.blink_score = 85
        self.head_stability_score = 75
        self.blink_rate = 18.5
        
        # Smoothing factors
        self.confidence_smooth = 0.8
        self.eye_smooth = 0.75
        
        # Behavior tracking
        self.warning_count = 0
        self.last_warning_time = {}
        self.gaze_direction = 0  # -45 to 45 degrees
        self.head_yaw = 0
        self.head_pitch = 0
    
    def simulate_frame(self):
        """Simulate a single frame of analysis."""
        self.frame_count += 1
        
        # Simulate time-based behavior changes
        elapsed = time.time() - self.session_start
        
        # Simulate getting slightly more nervous over time
        nervousness_factor = math.sin(elapsed / 10) * 5  # Oscillate
        
        # Simulate eye contact wandering
        self.gaze_direction += random.uniform(-5, 5)
        self.gaze_direction = max(-45, min(45, self.gaze_direction))
        
        # Calculate raw scores based on simulated behavior
        # Eye contact: decreases with gaze angle deviation
        raw_eye_contact = max(0, 100 - abs(self.gaze_direction) * 1.5)
        
        # Blinking: simulate varied rates
        base_blink_rate = 18.5 + nervousness_factor
        raw_blink_score = max(0, 100 - abs(base_blink_rate - 18.5) * 2)
        
        # Head stability: simulate micro-movements
        self.head_yaw += random.uniform(-2, 2)
        self.head_pitch += random.uniform(-1, 1)
        self.head_yaw = max(-30, min(30, self.head_yaw))
        self.head_pitch = max(-25, min(25, self.head_pitch))
        
        raw_head_stability = max(0, 100 - (abs(self.head_yaw) + abs(self.head_pitch)) * 1.2)
        
        # Apply temporal smoothing
        self.eye_contact_score = (
            self.eye_smooth * self.eye_contact_score + 
            (1 - self.eye_smooth) * raw_eye_contact
        )
        
        self.blink_score = (
            0.8 * self.blink_score + 
            0.2 * raw_blink_score
        )
        
        self.head_stability_score = (
            0.75 * self.head_stability_score + 
            0.25 * raw_head_stability
        )
        
        # Calculate overall confidence
        raw_confidence = (
            0.35 * self.eye_contact_score +
            0.25 * self.blink_score +
            0.25 * self.head_stability_score +
            0.15 * 75  # Facial expression (fixed)
        )
        
        self.confidence_score = (
            self.confidence_smooth * self.confidence_score +
            (1 - self.confidence_smooth) * raw_confidence
        )
        
        # Generate warnings
        warnings = self._generate_warnings()
        
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
                'total_blinks': int(base_blink_rate * elapsed / 60)
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
    
    def _generate_warnings(self):
        """Generate realistic warnings based on metrics."""
        warnings = []
        
        if self.eye_contact_score < 50 and self.frame_count % 300 == 0:
            warnings.append("Try maintaining eye contact with the camera")
        
        if self.head_stability_score < 40 and self.frame_count % 300 == 150:
            warnings.append("Try keeping your head steady")
        
        if self.blink_score < 30 and self.frame_count % 400 == 200:
            warnings.append("Try to relax your eyes")
        
        return warnings
    
    def _get_warning_level(self):
        """Get overall warning level."""
        if self.confidence_score >= 75:
            return 'none'
        elif self.confidence_score >= 60:
            return 'low'
        elif self.confidence_score >= 40:
            return 'medium'
        else:
            return 'high'


# Demo mode
if __name__ == '__main__':
    print("=" * 60)
    print("AARAMBH - CV Module (Mock Demo Mode)")
    print("=" * 60)
    print()
    print("[Status] Running in MOCK MODE (simulated metrics)")
    print("[Status] This is perfect for demo/testing without MediaPipe!")
    print()
    
    cv_module = MockCVModule()
    
    print("Simulating interview session...")
    print("(Press Ctrl+C to stop)")
    print()
    
    try:
        for i in range(300):  # Simulate 10 seconds at 30 FPS
            metrics = cv_module.simulate_frame()
            
            conf = metrics['confidence']
            
            # Print every 30 frames (1 second)
            if i % 30 == 0:
                print(f"Frame {metrics['frame_count']:4d} | "
                      f"Confidence: {conf['confidence_score']:3d}% | "
                      f"Eye: {conf['eye_contact_score']:3d}% | "
                      f"Blink: {conf['blink_score']:3d}% | "
                      f"Head: {conf['head_stability_score']:3d}%")
                
                if conf['warnings']:
                    for w in conf['warnings']:
                        print(f"  ⚠️  {w}")
            
            time.sleep(0.033)  # ~30 FPS
    
    except KeyboardInterrupt:
        print("\n[Status] Demo ended")
        print(f"[Stats] Processed {cv_module.frame_count} frames")
