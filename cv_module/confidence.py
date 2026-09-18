"""
Confidence Score Calculation Module

Combines all behavioral metrics into a single confidence score.

What it does:
- Weights individual metrics (eye contact, blink, head stability)
- Calculates overall confidence score
- Generates real-time feedback/warnings
- Provides interpretable output for interview assessment

Score Calculation Formula:
    Confidence = (
        w_eye_contact * eye_contact_score +
        w_blink * blink_score +
        w_head_stability * head_stability_score +
        w_expression * facial_expression_score
    )

where w_* are weights that sum to 1.0 (configured in config.py)

Output:
- confidence_score: 0-100 (overall interview confidence)
- behavioral_breakdown: Individual metric scores
- feedback: Real-time suggestions
- warning_level: none | low | medium | high

For viva explanation:
Confidence is NOT a measure of psychological confidence, but rather an 
OBSERVABLE BEHAVIOR SCORE based on:
- Eye contact (showing engagement)
- Stable blinking (showing calmness)
- Steady head position (showing attentiveness)
- Facial expression (showing engagement)

These behavioral indicators correlate with interview performance and are
used to provide real-time feedback to candidates.
"""

import numpy as np
from utils import exponential_smoothing, clamp
from config import (
    CONFIDENCE_WEIGHTS,
    WARNING_EYE_CONTACT_THRESHOLD,
    WARNING_HEAD_STABILITY_THRESHOLD,
    WARNING_BLINK_THRESHOLD_HIGH,
    WARNING_BLINK_THRESHOLD_LOW,
    WARNING_DURATION_THRESHOLD,
    WARNING_COOLDOWN,
    SCORE_SMOOTHING_FACTOR
)


class ConfidenceCalculator:
    """
    Calculates overall confidence score and generates feedback.
    """
    
    def __init__(self):
        """Initialize confidence calculator."""
        self.previous_score = None
        self.warning_counters = {}  # Track warning duration
        self.last_warning_time = {}  # Track warning cooldown
        self.frame_count = 0
    
    def calculate(self, eye_contact_data, blink_data, head_pose_data, expression_data=None):
        """
        Calculate confidence score from all metrics.
        
        Args:
            eye_contact_data: dict from EyeContactDetector.detect()
            blink_data: dict from BlinkDetector.detect()
            head_pose_data: dict from HeadPoseEstimator.detect()
            expression_data: dict from facial expression (optional, can be None)
        
        Returns:
            dict: {
                'confidence_score': 0-100,
                'eye_contact_score': 0-100,
                'blink_score': 0-100,
                'head_stability_score': 0-100,
                'facial_expression_score': 0-100,
                'warnings': [list of feedback strings],
                'warning_level': 'none' | 'low' | 'medium' | 'high'
            }
        """
        self.frame_count += 1
        
        # Extract individual scores
        eye_contact_score = eye_contact_data.get('eye_contact_score', 0)
        blink_score = blink_data.get('blink_score', 0)
        head_stability_score = head_pose_data.get('head_stability_score', 0)
        facial_expression_score = expression_data.get('score', 50) if expression_data else 50
        
        # Calculate weighted confidence score
        raw_confidence = (
            CONFIDENCE_WEIGHTS['eye_contact'] * eye_contact_score +
            CONFIDENCE_WEIGHTS['blink_behavior'] * blink_score +
            CONFIDENCE_WEIGHTS['head_stability'] * head_stability_score +
            CONFIDENCE_WEIGHTS['facial_expression'] * facial_expression_score
        )
        
        # Apply temporal smoothing
        confidence_score = exponential_smoothing(
            raw_confidence,
            self.previous_score,
            smoothing_factor=SCORE_SMOOTHING_FACTOR
        )
        confidence_score = clamp(confidence_score, 0, 100)
        self.previous_score = confidence_score
        
        # Generate warnings and feedback
        warnings = self._generate_warnings(
            eye_contact_score,
            blink_score,
            blink_data.get('blink_rate', 0),
            head_stability_score,
            head_pose_data
        )
        
        # Determine warning level
        warning_level = self._assess_warning_level(confidence_score, len(warnings))
        
        return {
            'confidence_score': int(confidence_score),
            'eye_contact_score': eye_contact_score,
            'blink_score': blink_score,
            'head_stability_score': head_stability_score,
            'facial_expression_score': int(facial_expression_score),
            'warnings': warnings,
            'warning_level': warning_level,
            'breakdown': {
                'eye_contact': {
                    'score': eye_contact_score,
                    'gaze_yaw': eye_contact_data.get('gaze_yaw', 0),
                    'gaze_pitch': eye_contact_data.get('gaze_pitch', 0)
                },
                'blink': {
                    'score': blink_score,
                    'rate': blink_data.get('blink_rate', 0),
                    'frequency': blink_data.get('blink_frequency_assessment', 'unknown')
                },
                'head_stability': {
                    'score': head_stability_score,
                    'yaw': head_pose_data.get('yaw', 0),
                    'pitch': head_pose_data.get('pitch', 0),
                    'roll': head_pose_data.get('roll', 0)
                }
            }
        }
    
    def _generate_warnings(self, eye_contact_score, blink_score, blink_rate, 
                          head_stability_score, head_pose_data):
        """
        Generate real-time feedback warnings.
        
        Warnings only trigger after persistent issues (not single-frame glitches).
        
        Args:
            Various metric scores and data
        
        Returns:
            list: Feedback strings
        """
        warnings = []
        
        # Warning: Poor eye contact
        if eye_contact_score < WARNING_EYE_CONTACT_THRESHOLD:
            if self._should_warn('eye_contact'):
                warnings.append("Try maintaining eye contact with the camera")
        else:
            self.warning_counters['eye_contact'] = 0
        
        # Warning: Excessive head movement
        if head_stability_score < WARNING_HEAD_STABILITY_THRESHOLD:
            if self._should_warn('head_stability'):
                warnings.append("Try keeping your head steady")
        else:
            self.warning_counters['head_stability'] = 0
        
        # Warning: Excessive blinking (nervousness)
        if blink_rate > WARNING_BLINK_THRESHOLD_HIGH:
            if self._should_warn('blink_high'):
                warnings.append("Try to relax - you appear to be blinking frequently")
        else:
            self.warning_counters['blink_high'] = 0
        
        # Warning: Insufficient blinking (fatigue)
        if blink_rate < WARNING_BLINK_THRESHOLD_LOW and blink_rate > 0:
            if self._should_warn('blink_low'):
                warnings.append("Try to relax your eyes - you may be experiencing screen fatigue")
        else:
            self.warning_counters['blink_low'] = 0
        
        return warnings
    
    def _should_warn(self, warning_type):
        """
        Determine if a warning should be issued.
        
        Implements:
        1. Duration threshold: Only warn after issue persists for N frames
        2. Cooldown: Don't repeat same warning too frequently
        
        Args:
            warning_type: Type of warning to check
        
        Returns:
            bool: True if warning should be shown
        """
        # Initialize counters
        if warning_type not in self.warning_counters:
            self.warning_counters[warning_type] = 0
        if warning_type not in self.last_warning_time:
            self.last_warning_time[warning_type] = 0
        
        # Increment counter
        self.warning_counters[warning_type] += 1
        
        # Check if duration threshold reached
        if self.warning_counters[warning_type] < WARNING_DURATION_THRESHOLD:
            return False
        
        # Check cooldown
        frames_since_last = self.frame_count - self.last_warning_time[warning_type]
        if frames_since_last < WARNING_COOLDOWN:
            return False
        
        # Update last warning time
        self.last_warning_time[warning_type] = self.frame_count
        
        return True
    
    @staticmethod
    def _assess_warning_level(confidence_score, num_warnings):
        """
        Assess overall warning level based on score and warnings.
        
        Args:
            confidence_score: Overall confidence score 0-100
            num_warnings: Number of active warnings
        
        Returns:
            str: 'none' | 'low' | 'medium' | 'high'
        """
        if confidence_score >= 75 and num_warnings == 0:
            return 'none'
        elif confidence_score >= 60 and num_warnings <= 1:
            return 'low'
        elif confidence_score >= 40 or num_warnings <= 2:
            return 'medium'
        else:
            return 'high'
    
    def reset(self):
        """Reset calculator for new session."""
        self.previous_score = None
        self.warning_counters = {}
        self.last_warning_time = {}
        self.frame_count = 0
