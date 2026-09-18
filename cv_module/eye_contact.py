"""
Eye Contact Detection Module

Estimates whether the candidate is maintaining eye contact with the camera.

What it does:
- Calculates gaze direction from iris position
- Compares gaze angle to camera center
- Estimates eye contact confidence score

Algorithm:
1. Extract eye landmarks (iris, eye corners)
2. Calculate gaze vector from iris position relative to eye corners
3. Estimate gaze angle in 3D space
4. Determine if looking at camera (within threshold angle)
5. Apply temporal smoothing to reduce jitter

Output:
- eye_contact_score: 0-100 (higher = better)
- is_looking_at_camera: True/False
- gaze_angles: {'yaw': degrees, 'pitch': degrees}

For viva explanation:
We use the iris center position and sclera (white of eye) boundaries to estimate 
where the person is looking. If the iris is centered within the eye, they're likely 
looking at the camera. If it's off-center, they're looking away.
"""

import numpy as np
from utils import distance, exponential_smoothing, is_looking_at_camera, clamp
from config import EYE_CONTACT_THRESHOLD, EYE_CONTACT_SMOOTHING


class EyeContactDetector:
    """
    Detects eye contact with camera.
    """
    
    def __init__(self):
        """Initialize eye contact tracker."""
        self.previous_score = None
        self.gaze_history = []
        self.max_history = 30  # Keep last 30 frames
    
    def detect(self, landmarks):
        """
        Detect eye contact from facial landmarks.
        
        Args:
            landmarks: List of NormalizedLandmark objects from MediaPipe
        
        Returns:
            dict: {
                'eye_contact_score': 0-100,
                'is_looking': bool,
                'gaze_yaw': degrees,
                'gaze_pitch': degrees,
                'left_eye_opening': 0-100,
                'right_eye_opening': 0-100
            }
        """
        if landmarks is None:
            return {
                'eye_contact_score': 0,
                'is_looking': False,
                'gaze_yaw': 0,
                'gaze_pitch': 0,
                'left_eye_opening': 0,
                'right_eye_opening': 0
            }
        
        # Extract eye landmarks
        # MediaPipe landmark indices for eyes
        left_iris = landmarks[468]  # Left iris
        right_iris = landmarks[473]  # Right iris
        left_eye_left = landmarks[33]  # Left eye left corner
        left_eye_right = landmarks[133]  # Left eye right corner
        right_eye_left = landmarks[362]  # Right eye left corner
        right_eye_right = landmarks[263]  # Right eye right corner
        
        # Calculate gaze direction for each eye
        left_gaze_x = self._calculate_iris_position(left_iris, left_eye_left, left_eye_right)
        right_gaze_x = self._calculate_iris_position(right_iris, right_eye_left, right_eye_right)
        
        # Average both eyes
        avg_gaze_x = (left_gaze_x + right_gaze_x) / 2.0
        
        # Estimate vertical gaze (pitch)
        # Use eyelid positions to infer vertical gaze
        left_top_lid = landmarks[159]  # Upper eyelid
        left_bottom_lid = landmarks[145]  # Lower eyelid
        left_gaze_y = self._calculate_vertical_gaze(left_iris, left_top_lid, left_bottom_lid)
        
        # Estimate horizontal gaze angle (yaw in degrees)
        # avg_gaze_x ranges from -1 to 1, convert to degrees
        gaze_yaw = avg_gaze_x * 45  # Scale to ±45 degrees
        gaze_pitch = left_gaze_y * 30  # Scale to ±30 degrees
        
        # Check if looking at camera
        gaze_angles = {'yaw': gaze_yaw, 'pitch': gaze_pitch}
        is_looking = is_looking_at_camera(gaze_angles, threshold=EYE_CONTACT_THRESHOLD)
        
        # Calculate eye contact score
        # Base score on how close to center (looking at camera)
        deviation = abs(gaze_yaw) + abs(gaze_pitch)
        max_scored_deviation = EYE_CONTACT_THRESHOLD * 2
        raw_score = max(0, 100 - (deviation / max_scored_deviation * 100))
        
        # Apply temporal smoothing
        eye_contact_score = exponential_smoothing(
            raw_score, 
            self.previous_score, 
            smoothing_factor=EYE_CONTACT_SMOOTHING
        )
        eye_contact_score = clamp(eye_contact_score, 0, 100)
        self.previous_score = eye_contact_score
        
        # Calculate eye opening percentage
        left_eye_opening = self._calculate_eye_opening(
            landmarks[159], landmarks[145], left_iris, landmarks[33], landmarks[133]
        )
        right_eye_opening = self._calculate_eye_opening(
            landmarks[386], landmarks[374], right_iris, landmarks[362], landmarks[263]
        )
        
        self.gaze_history.append(gaze_yaw)
        if len(self.gaze_history) > self.max_history:
            self.gaze_history.pop(0)
        
        return {
            'eye_contact_score': int(eye_contact_score),
            'is_looking': bool(is_looking),
            'gaze_yaw': round(gaze_yaw, 2),
            'gaze_pitch': round(gaze_pitch, 2),
            'left_eye_opening': int(left_eye_opening),
            'right_eye_opening': int(right_eye_opening)
        }
    
    @staticmethod
    def _calculate_iris_position(iris, eye_left, eye_right):
        """
        Calculate horizontal position of iris relative to eye width.
        
        Returns value from -1 (fully left) to 1 (fully right) where 0 is center.
        """
        iris_x = iris.x
        eye_left_x = eye_left.x
        eye_right_x = eye_right.x
        
        eye_width = eye_right_x - eye_left_x
        iris_position = (iris_x - eye_left_x) / (eye_width + 1e-6)
        
        # Convert from 0-1 range to -1 to 1 range (center = 0)
        return (iris_position - 0.5) * 2
    
    @staticmethod
    def _calculate_vertical_gaze(iris, top_lid, bottom_lid):
        """
        Calculate vertical position of iris relative to eyelid positions.
        
        Returns value from -1 (fully up) to 1 (fully down) where 0 is center.
        """
        iris_y = iris.y
        top_y = top_lid.y
        bottom_y = bottom_lid.y
        
        eye_height = bottom_y - top_y
        iris_position = (iris_y - top_y) / (eye_height + 1e-6)
        
        # Convert to -1 to 1 range
        return (iris_position - 0.5) * 2
    
    @staticmethod
    def _calculate_eye_opening(top_lid, bottom_lid, iris, eye_left, eye_right):
        """
        Calculate eye opening percentage (0-100).
        
        Uses vertical distance between eyelids.
        """
        top_y = top_lid.y
        bottom_y = bottom_lid.y
        
        eye_left_x = eye_left.x
        eye_right_x = eye_right.x
        
        vertical_distance = abs(bottom_y - top_y)
        horizontal_distance = abs(eye_right_x - eye_left_x)
        
        # Opening ratio
        opening_ratio = vertical_distance / (horizontal_distance + 1e-6)
        
        # Convert to percentage (typical opening is 0.4-0.5)
        opening_percent = min(100, max(0, (opening_ratio / 0.5) * 100))
        
        return opening_percent
    
    def get_gaze_stability(self):
        """
        Calculate how stable/consistent the gaze direction is.
        
        Returns:
            float: Stability score 0-100 (higher = more stable)
        """
        if len(self.gaze_history) < 10:
            return 50
        
        # Calculate standard deviation of recent gaze angles
        gaze_std = np.std(self.gaze_history[-10:])
        
        # Convert std to stability score (lower std = higher stability)
        # Assume typical std is around 15-20 degrees for fidgety person
        stability = max(0, 100 - (gaze_std / 0.2 * 100))
        
        return clamp(stability, 0, 100)
