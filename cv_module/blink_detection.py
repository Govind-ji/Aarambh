"""
Blink Detection Module

Detects and monitors blinking patterns to assess nervousness/comfort.

What it does:
- Calculates Eye Aspect Ratio (EAR) from eyelid landmarks
- Detects blinks when EAR drops below threshold
- Tracks blink frequency over time
- Estimates nervousness/comfort based on blink rate

Algorithm:
1. Extract eyelid landmarks (upper and lower eyelids)
2. Calculate Eye Aspect Ratio: EAR = (vertical distances) / (2 * horizontal distance)
3. When EAR < 0.2 for consecutive frames → blink detected
4. Count blinks in time window (e.g., last 30 frames)
5. Convert to blinks per minute
6. Score: Normal (15-25 bpm) = good, too high (>30) = nervous, too low (<10) = tired

Why this works:
- Normal blinking: 15-25 times per minute when comfortable
- High blinking: >30 times per minute when anxious/nervous
- Low blinking: <10 times per minute when focused/tired/screen fatigue

Output:
- blink_score: 0-100 (100 = normal rate, lower = abnormal)
- blink_rate: blinks per minute
- is_blinking_now: True/False
- blink_frequency_assessment: 'normal' | 'high' | 'low'

For viva explanation:
Blinking is an involuntary reflex affected by cognitive load and stress. During 
interviews, anxious candidates blink excessively (>30/min) due to stress hormones. 
We monitor blink frequency as a proxy for interview anxiety.
"""

import numpy as np
from utils import distance, exponential_smoothing, clamp, calculate_eye_aspect_ratio
from config import (
    EAR_THRESHOLD,
    EAR_CONSECUTIVE_FRAMES,
    BLINK_NORMAL_RATE,
    BLINK_SMOOTHING
)


class BlinkDetector:
    """
    Detects and monitors blink patterns.
    """
    
    def __init__(self, fps=30):
        """
        Initialize blink detector.
        
        Args:
            fps: Frames per second (for blink rate calculation)
        """
        self.fps = fps
        self.blink_frame_counter = 0  # Current consecutive frames with eyes closed
        self.blinks_detected = 0  # Total blinks detected
        self.blink_history = []  # Track blink timings
        self.previous_score = None
        self.is_blinking_currently = False
        self.frame_count = 0
    
    def detect(self, landmarks):
        """
        Detect blinks from facial landmarks.
        
        Args:
            landmarks: List of NormalizedLandmark objects from MediaPipe
        
        Returns:
            dict: {
                'blink_score': 0-100,
                'blink_rate': blinks per minute,
                'is_blinking_now': bool,
                'blink_frequency_assessment': str,
                'left_ear': float,
                'right_ear': float
            }
        """
        self.frame_count += 1
        
        if landmarks is None:
            return {
                'blink_score': 0,
                'blink_rate': 0,
                'is_blinking_now': False,
                'blink_frequency_assessment': 'unknown',
                'left_ear': 0,
                'right_ear': 0
            }
        
        # Extract eye landmarks
        # Left eye landmarks: indices 33, 160, 158, 133, 153, 144
        left_eye_indices = [33, 160, 158, 133, 153, 144]
        left_eye_points = [landmarks[i] for i in left_eye_indices]
        
        # Right eye landmarks: indices 362, 385, 387, 263, 373, 380
        right_eye_indices = [362, 385, 387, 263, 373, 380]
        right_eye_points = [landmarks[i] for i in right_eye_indices]
        
        # Calculate Eye Aspect Ratio for both eyes
        left_ear = self._calculate_ear_from_landmarks(left_eye_points)
        right_ear = self._calculate_ear_from_landmarks(right_eye_points)
        
        # Average both eyes
        avg_ear = (left_ear + right_ear) / 2.0
        
        # Detect blink
        if avg_ear < EAR_THRESHOLD:
            self.blink_frame_counter += 1
        else:
            # Check if we just completed a blink
            if self.blink_frame_counter >= EAR_CONSECUTIVE_FRAMES:
                self.blinks_detected += 1
                self.blink_history.append(self.frame_count)
                self.is_blinking_currently = False
            
            self.blink_frame_counter = 0
        
        # Determine if currently blinking
        self.is_blinking_currently = self.blink_frame_counter >= EAR_CONSECUTIVE_FRAMES
        
        # Calculate blink rate (blinks per minute)
        blink_rate = self._calculate_blink_rate()
        
        # Calculate blink score based on rate
        blink_score = self._calculate_blink_score(blink_rate)
        
        # Apply smoothing
        blink_score = exponential_smoothing(
            blink_score,
            self.previous_score,
            smoothing_factor=BLINK_SMOOTHING
        )
        blink_score = clamp(blink_score, 0, 100)
        self.previous_score = blink_score
        
        # Assess blink frequency
        assessment = self._assess_blink_frequency(blink_rate)
        
        return {
            'blink_score': int(blink_score),
            'blink_rate': round(blink_rate, 1),
            'is_blinking_now': bool(self.is_blinking_currently),
            'blink_frequency_assessment': assessment,
            'left_ear': round(left_ear, 3),
            'right_ear': round(right_ear, 3),
            'total_blinks': self.blinks_detected
        }
    
    @staticmethod
    def _calculate_ear_from_landmarks(eye_points):
        """
        Calculate Eye Aspect Ratio from eye landmarks.
        
        Eye points should be ordered: [0] outside-corner, [1] top, [2] top-inside,
                                      [3] inside-corner, [4] bottom-inside, [5] bottom
        
        Args:
            eye_points: List of 6 eye landmark points
        
        Returns:
            float: Eye Aspect Ratio (typical range 0.0-0.5, >0.2 = open, <0.2 = closed)
        """
        if len(eye_points) < 6:
            return 0.5
        
        # Convert landmarks to (x, y) tuples
        points = [(p.x, p.y) for p in eye_points]
        
        # Calculate distances
        # Vertical distances (top-bottom)
        vertical1 = distance(points[1], points[5])  # Top to bottom
        vertical2 = distance(points[2], points[4])  # Top-inside to bottom-inside
        
        # Horizontal distance (left-right)
        horizontal = distance(points[0], points[3])  # Outside to inside
        
        # EAR formula
        ear = (vertical1 + vertical2) / (2.0 * horizontal + 1e-6)
        
        return ear
    
    def _calculate_blink_rate(self):
        """
        Calculate current blink rate in blinks per minute.
        
        Uses recent blink history (last 30 frames).
        
        Returns:
            float: Blinks per minute
        """
        # Use last 30 frames of history
        window_size = self.fps * 2  # 2-second window
        recent_blinks = sum(1 for t in self.blink_history if t > (self.frame_count - window_size))
        
        if self.frame_count < window_size:
            # Not enough data, return 0
            return 0
        
        # Convert to blinks per minute
        seconds_elapsed = window_size / self.fps
        blinks_per_second = recent_blinks / seconds_elapsed
        blink_rate = blinks_per_second * 60
        
        return max(0, blink_rate)
    
    @staticmethod
    def _calculate_blink_score(blink_rate):
        """
        Calculate score based on blink rate.
        
        Normal rate (15-25 blinks/min) = 100 score
        Outside this range gets lower score
        
        Args:
            blink_rate: Blinks per minute
        
        Returns:
            float: Score 0-100
        """
        normal_min, normal_max = BLINK_NORMAL_RATE
        
        if normal_min <= blink_rate <= normal_max:
            # Within normal range = perfect score
            return 100
        elif blink_rate < normal_min:
            # Too few blinks (fatigue/screen time)
            # Penalty increases quadratically as we go below range
            deviation = normal_min - blink_rate
            score = max(0, 100 - (deviation / 10 * 50))  # Max penalty of 50 points
            return score
        else:
            # Too many blinks (anxiety/nervousness)
            # Penalty increases with blink rate
            deviation = blink_rate - normal_max
            score = max(0, 100 - (deviation / 15 * 80))  # Max penalty of 80 points
            return score
    
    @staticmethod
    def _assess_blink_frequency(blink_rate):
        """
        Assess blink frequency pattern.
        
        Args:
            blink_rate: Blinks per minute
        
        Returns:
            str: 'normal', 'high', 'low', or 'unknown'
        """
        normal_min, normal_max = BLINK_NORMAL_RATE
        
        if blink_rate == 0:
            return 'unknown'
        elif normal_min <= blink_rate <= normal_max:
            return 'normal'
        elif blink_rate > normal_max:
            return 'high'  # Indicates nervousness
        else:
            return 'low'  # Indicates fatigue or excessive focus
    
    def reset(self):
        """Reset blink detector for new session."""
        self.blink_frame_counter = 0
        self.blinks_detected = 0
        self.blink_history = []
        self.previous_score = None
        self.is_blinking_currently = False
        self.frame_count = 0
    
    def get_stats(self):
        """
        Get statistics about blink detection.
        
        Returns:
            dict: Statistics
        """
        return {
            'total_blinks': self.blinks_detected,
            'total_frames': self.frame_count,
            'blink_rate': self._calculate_blink_rate()
        }
