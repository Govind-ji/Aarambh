"""
Utility functions for CV Module

Contains helper functions for:
- Landmark extraction
- Angle calculations
- Score smoothing
- Frame processing
"""

import numpy as np
import math
from config import FRAME_SMOOTHING_FACTOR, SCORE_SMOOTHING_FACTOR


def distance(point1, point2):
    """
    Calculate Euclidean distance between two 2D points.
    
    Args:
        point1: (x, y) tuple or numpy array
        point2: (x, y) tuple or numpy array
    
    Returns:
        float: Euclidean distance
    """
    return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)


def calculate_angle(a, b, c):
    """
    Calculate angle at point B formed by points A-B-C.
    
    Used for head pose and gaze angle calculations.
    
    Args:
        a: Point A (x, y)
        b: Point B - vertex point (x, y)
        c: Point C (x, y)
    
    Returns:
        float: Angle in degrees (0-180)
    """
    # Convert to numpy arrays
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    # Calculate vectors
    ba = a - b
    bc = c - b
    
    # Calculate angle using dot product
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    # Clamp to avoid numerical errors
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)


def calculate_eye_aspect_ratio(eye_points):
    """
    Calculate Eye Aspect Ratio (EAR) for blink detection.
    
    EAR is the ratio of vertical eye opening to horizontal width.
    - EAR > 0.2: Eyes open
    - EAR < 0.2: Eyes closed (blink)
    
    Args:
        eye_points: List of 6 points representing eye landmarks
                   Points should be ordered: top, top-right, bottom-right, 
                                             bottom, bottom-left, top-left
    
    Returns:
        float: Eye Aspect Ratio (0-1 range typically)
    """
    # Calculate vertical distances (top-bottom)
    vertical_1 = distance(eye_points[1], eye_points[5])
    vertical_2 = distance(eye_points[2], eye_points[4])
    
    # Calculate horizontal distance (left-right)
    horizontal = distance(eye_points[0], eye_points[3])
    
    # EAR = (vertical distances) / (2 * horizontal distance)
    ear = (vertical_1 + vertical_2) / (2.0 * horizontal + 1e-6)
    
    return ear


def exponential_smoothing(new_value, prev_value, smoothing_factor=SCORE_SMOOTHING_FACTOR):
    """
    Apply exponential smoothing to reduce jitter in scores.
    
    Formula: smoothed = (smoothing_factor * prev_value) + ((1 - smoothing_factor) * new_value)
    
    Higher smoothing_factor = more weight on previous values = smoother but slower to respond
    Lower smoothing_factor = more weight on new values = responds faster but jittery
    
    Args:
        new_value: Current raw measurement
        prev_value: Previous smoothed value
        smoothing_factor: Smoothing coefficient (0-1)
    
    Returns:
        float: Smoothed value
    """
    if prev_value is None:
        return new_value
    
    smoothed = (smoothing_factor * prev_value) + ((1 - smoothing_factor) * new_value)
    return smoothed


def clamp(value, min_val=0, max_val=100):
    """
    Clamp value between min and max.
    
    Args:
        value: Value to clamp
        min_val: Minimum value
        max_val: Maximum value
    
    Returns:
        float: Clamped value
    """
    return max(min_val, min(max_val, value))


def calculate_head_pose_angles(face_landmarks):
    """
    Estimate head pose (yaw, pitch, roll) from facial landmarks.
    
    Uses key landmarks to calculate head rotation angles.
    
    Args:
        face_landmarks: Normalized face landmarks from MediaPipe
    
    Returns:
        dict: {
            'yaw': Left-right rotation (-90 to 90, negative=left)
            'pitch': Up-down rotation (-90 to 90, negative=down)
            'roll': Tilt rotation (-90 to 90)
        }
    """
    # Extract key landmarks
    # These landmark indices are from MediaPipe Face Landmarker
    
    # Nose tip
    nose = np.array([face_landmarks[1].x, face_landmarks[1].y])
    
    # Eye centers
    left_eye = np.array([face_landmarks[33].x, face_landmarks[33].y])
    right_eye = np.array([face_landmarks[263].x, face_landmarks[263].y])
    
    # Mouth corners
    left_mouth = np.array([face_landmarks[61].x, face_landmarks[61].y])
    right_mouth = np.array([face_landmarks[291].x, face_landmarks[291].y])
    
    # Chin
    chin = np.array([face_landmarks[152].x, face_landmarks[152].y])
    
    # Calculate yaw (left-right rotation)
    # Compare horizontal distance between eyes to nose position
    eye_center = (left_eye + right_eye) / 2
    yaw = calculate_angle(left_eye, nose, right_eye) - 90
    
    # Calculate pitch (up-down rotation)
    # Compare vertical positions of eyes and chin
    pitch = calculate_angle(left_eye, nose, chin) - 90
    
    # Calculate roll (head tilt)
    # Compare angle between eyes
    eye_vector = right_eye - left_eye
    roll = np.degrees(np.arctan2(eye_vector[1], eye_vector[0]))
    
    return {
        'yaw': yaw,
        'pitch': pitch,
        'roll': roll
    }


def is_looking_at_camera(gaze_angles, threshold=20):
    """
    Determine if person is looking at camera based on gaze angles.
    
    Args:
        gaze_angles: dict with 'yaw' and 'pitch' angles
        threshold: Maximum angle deviation from center (degrees)
    
    Returns:
        bool: True if looking at camera, False otherwise
    """
    yaw = abs(gaze_angles.get('yaw', 0))
    pitch = abs(gaze_angles.get('pitch', 0))
    
    return yaw < threshold and pitch < threshold


def normalize_score(value, min_val=0, max_val=100):
    """
    Normalize value to 0-100 range.
    
    Args:
        value: Raw value
        min_val: Expected minimum
        max_val: Expected maximum
    
    Returns:
        float: Normalized score (0-100)
    """
    if max_val == min_val:
        return 50
    
    normalized = ((value - min_val) / (max_val - min_val)) * 100
    return clamp(normalized, 0, 100)


def get_timestamp_ms():
    """
    Get current timestamp in milliseconds.
    
    Returns:
        int: Timestamp in milliseconds
    """
    import time
    return int(time.time() * 1000)
