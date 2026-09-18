"""
Head Pose Estimation Module

Estimates head rotation angles (yaw, pitch, roll) to assess head stability.

What it does:
- Detects head rotation in 3 dimensions
- Monitors head movement and fidgeting
- Scores head stability/calmness

Algorithm:
1. Extract key facial landmarks (eyes, nose, chin, mouth)
2. Calculate vectors and angles between landmarks
3. Estimate 3D head rotation using PnP (Perspective-n-Point) concept
4. Track deviation from neutral head position
5. Calculate stability score based on variance of angles

Output:
- head_stability_score: 0-100 (higher = steadier head)
- yaw: Left-right rotation (-90 to 90 degrees, negative=left)
- pitch: Up-down rotation (-90 to 90 degrees, negative=down)
- roll: Tilt rotation (-90 to 90 degrees)
- movement_intensity: 0-100 (0=still, 100=very mobile)

For viva explanation:
A person's head position and movement indicate attention and confidence:
- Steady head = focused and confident
- Excessive side-to-side movement = nervousness or distraction
- Excessive up-down bobbing = anxiety or enthusiasm (depends on context)
- Head tilt = engagement or confusion (depends on magnitude)
"""

import numpy as np
from utils import distance, calculate_angle, exponential_smoothing, clamp
from config import (
    HEAD_YAW_THRESHOLD,
    HEAD_PITCH_THRESHOLD,
    HEAD_ROLL_THRESHOLD,
    HEAD_STABILITY_SMOOTHING
)


class HeadPoseEstimator:
    """
    Estimates head pose angles from facial landmarks.
    """
    
    def __init__(self):
        """Initialize head pose estimator."""
        self.previous_stability_score = None
        self.angle_history = {'yaw': [], 'pitch': [], 'roll': []}
        self.max_history = 30  # Keep last 30 frames
        self.neutral_angles = None  # Neutral head position (set on first detection)
    
    def detect(self, landmarks):
        """
        Estimate head pose from facial landmarks.
        
        Args:
            landmarks: List of NormalizedLandmark objects from MediaPipe
        
        Returns:
            dict: {
                'head_stability_score': 0-100,
                'yaw': degrees,
                'pitch': degrees,
                'roll': degrees,
                'movement_intensity': 0-100,
                'is_stable': bool
            }
        """
        if landmarks is None:
            return {
                'head_stability_score': 0,
                'yaw': 0,
                'pitch': 0,
                'roll': 0,
                'movement_intensity': 0,
                'is_stable': False
            }
        
        # Extract key facial landmarks
        # Nose tip
        nose_tip = np.array([landmarks[1].x, landmarks[1].y])
        
        # Eyes
        left_eye = np.array([landmarks[33].x, landmarks[33].y])
        right_eye = np.array([landmarks[263].x, landmarks[263].y])
        eye_center = (left_eye + right_eye) / 2.0
        
        # Mouth
        mouth_center = np.array([landmarks[13].x, landmarks[13].y])
        
        # Chin
        chin = np.array([landmarks[152].x, landmarks[152].y])
        
        # Top of head (forehead)
        forehead = np.array([landmarks[10].x, landmarks[10].y])
        
        # Calculate head rotation angles
        yaw, pitch, roll = self._estimate_angles(
            nose_tip, eye_center, mouth_center, chin, forehead, left_eye, right_eye
        )
        
        # Store in history for stability calculation
        self.angle_history['yaw'].append(yaw)
        self.angle_history['pitch'].append(pitch)
        self.angle_history['roll'].append(roll)
        
        # Trim history
        for key in self.angle_history:
            if len(self.angle_history[key]) > self.max_history:
                self.angle_history[key].pop(0)
        
        # Calculate movement intensity (how much head is moving)
        movement_intensity = self._calculate_movement_intensity()
        
        # Calculate head stability score
        head_stability_score = self._calculate_stability_score(yaw, pitch, roll)
        
        # Apply smoothing
        head_stability_score = exponential_smoothing(
            head_stability_score,
            self.previous_stability_score,
            smoothing_factor=HEAD_STABILITY_SMOOTHING
        )
        head_stability_score = clamp(head_stability_score, 0, 100)
        self.previous_stability_score = head_stability_score
        
        # Determine if head is stable
        is_stable = (
            abs(yaw) < HEAD_YAW_THRESHOLD and
            abs(pitch) < HEAD_PITCH_THRESHOLD and
            abs(roll) < HEAD_ROLL_THRESHOLD
        )
        
        return {
            'head_stability_score': int(head_stability_score),
            'yaw': round(yaw, 2),
            'pitch': round(pitch, 2),
            'roll': round(roll, 2),
            'movement_intensity': int(movement_intensity),
            'is_stable': bool(is_stable)
        }
    
    def _estimate_angles(self, nose, eye_center, mouth, chin, forehead, left_eye, right_eye):
        """
        Estimate head pose angles using facial landmarks.
        
        Returns:
            tuple: (yaw, pitch, roll) in degrees
        """
        # YAW (left-right rotation)
        # Compare horizontal position of nose relative to eye center
        yaw = self._calculate_yaw(nose, eye_center, left_eye, right_eye)
        
        # PITCH (up-down rotation)
        # Compare vertical position of nose relative to eyes and chin
        pitch = self._calculate_pitch(nose, eye_center, chin, forehead)
        
        # ROLL (head tilt)
        # Compare angle between the two eyes
        roll = self._calculate_roll(left_eye, right_eye)
        
        return yaw, pitch, roll
    
    @staticmethod
    def _calculate_yaw(nose, eye_center, left_eye, right_eye):
        """
        Calculate yaw (left-right rotation).
        
        If nose is left of eye center -> head is turned left (negative yaw)
        If nose is right of eye center -> head is turned right (positive yaw)
        
        Returns:
            float: Yaw angle in degrees (-90 to 90)
        """
        # Horizontal distance from nose to eye center
        nose_to_eye_x = nose[0] - eye_center[0]
        
        # Eye width
        eye_width = abs(right_eye[0] - left_eye[0])
        
        # Normalize to -1 to 1 range
        yaw_ratio = nose_to_eye_x / (eye_width / 2.0 + 1e-6)
        
        # Convert to degrees (-45 to 45)
        yaw = np.clip(yaw_ratio * 45, -90, 90)
        
        return yaw
    
    @staticmethod
    def _calculate_pitch(nose, eye_center, chin, forehead):
        """
        Calculate pitch (up-down rotation).
        
        If nose is above eyes -> head is looking up (negative pitch)
        If nose is below eyes -> head is looking down (positive pitch)
        
        Returns:
            float: Pitch angle in degrees (-90 to 90)
        """
        # Vertical distance from nose to eye center
        nose_to_eye_y = eye_center[1] - nose[1]
        
        # Full face height
        face_height = abs(forehead[1] - chin[1])
        
        # Normalize to -1 to 1 range
        pitch_ratio = nose_to_eye_y / (face_height / 4.0 + 1e-6)
        
        # Convert to degrees (-45 to 45)
        pitch = np.clip(pitch_ratio * 45, -90, 90)
        
        return pitch
    
    @staticmethod
    def _calculate_roll(left_eye, right_eye):
        """
        Calculate roll (head tilt).
        
        If right eye is higher than left -> head tilted right (positive roll)
        If left eye is higher than right -> head tilted left (negative roll)
        
        Returns:
            float: Roll angle in degrees (-90 to 90)
        """
        # Calculate angle of line between eyes
        eye_vector = right_eye - left_eye
        
        # Angle from horizontal
        roll = np.degrees(np.arctan2(eye_vector[1], eye_vector[0]))
        
        # Normalize to -90 to 90
        if roll > 90:
            roll -= 180
        elif roll < -90:
            roll += 180
        
        return roll
    
    def _calculate_movement_intensity(self):
        """
        Calculate how much the head is moving.
        
        Uses variance of recent angles to determine movement intensity.
        
        Returns:
            float: Movement intensity 0-100 (0=still, 100=very mobile)
        """
        if len(self.angle_history['yaw']) < 5:
            return 0
        
        # Calculate variance for each angle (last 10 frames)
        recent_count = min(10, len(self.angle_history['yaw']))
        
        yaw_var = np.var(self.angle_history['yaw'][-recent_count:])
        pitch_var = np.var(self.angle_history['pitch'][-recent_count:])
        roll_var = np.var(self.angle_history['roll'][-recent_count:])
        
        # Average variance
        avg_variance = (yaw_var + pitch_var + roll_var) / 3.0
        
        # Convert variance to intensity score
        # Assume typical variance is around 100-200 for fidgety person
        intensity = min(100, (avg_variance / 100) * 100)
        
        return intensity
    
    @staticmethod
    def _calculate_stability_score(yaw, pitch, roll):
        """
        Calculate head stability score.
        
        Perfect score (100) at yaw=0, pitch=0, roll=0
        Score decreases as angles increase
        
        Returns:
            float: Stability score 0-100
        """
        # Calculate deviation from neutral (0, 0, 0)
        total_deviation = abs(yaw) + abs(pitch) + abs(roll)
        
        # Maximum expected deviation
        max_deviation = 90 + 90 + 90  # Sum of all possible deviations
        
        # Score: 100 at neutral, 0 at max deviation
        stability = max(0, 100 - (total_deviation / max_deviation * 100))
        
        return stability
    
    def get_average_angles(self):
        """
        Get average head angles over recent history.
        
        Returns:
            dict: Average yaw, pitch, roll
        """
        return {
            'yaw': np.mean(self.angle_history['yaw']) if self.angle_history['yaw'] else 0,
            'pitch': np.mean(self.angle_history['pitch']) if self.angle_history['pitch'] else 0,
            'roll': np.mean(self.angle_history['roll']) if self.angle_history['roll'] else 0,
        }
    
    def reset(self):
        """Reset head pose estimator for new session."""
        self.previous_stability_score = None
        self.angle_history = {'yaw': [], 'pitch': [], 'roll': []}
        self.neutral_angles = None
