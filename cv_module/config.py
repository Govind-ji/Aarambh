"""
Configuration for CV Module

This file contains all hardcoded configuration parameters
for face detection, eye tracking, and confidence scoring.
"""

from pathlib import Path

# ============ MODEL BACKEND CONFIG ============
# Use "mediapipe" for the main landmark-based pipeline.
# Set to "huggingface" to enable the optional HF-only confidence enrichment.
MODEL_BACKEND = 'mediapipe'

# Optional Hugging Face image classification model used only as a secondary signal.
# This does NOT replace the landmark pipeline; it is kept as a non-blocking enhancement.
HF_MODEL_NAME = 'google/vit-base-patch16-224'
HF_DEVICE = -1  # -1 = CPU, 0 = first available GPU

# ============ MEDIAPIPE CONFIG ============
MEDIAPIPE_MODEL_PATH = str(Path(__file__).parent / 'models' / 'face_landmarker.task')
FACE_DETECTION_CONFIDENCE = 0.5
LANDMARK_CONFIDENCE = 0.5

# ============ CAMERA CONFIG ============
CAMERA_ID = 0  # Default camera
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
CAMERA_FPS = 30

# ============ EYE CONTACT DETECTION ============
# Threshold for determining if looking at camera (degrees)
EYE_CONTACT_THRESHOLD = 20  # If gaze is within 20 degrees of center, consider it eye contact
EYE_CONTACT_MIN_FRAMES = 3  # Minimum frames to confirm eye contact
EYE_CONTACT_SMOOTHING = 0.7  # Exponential smoothing factor (0-1)

# ============ BLINK DETECTION ============
# Eye Aspect Ratio (EAR) thresholds
EAR_THRESHOLD = 0.2  # Below this = eyes closed
EAR_CONSECUTIVE_FRAMES = 2  # Frames to confirm a blink
BLINK_NORMAL_RATE = (15, 25)  # Normal blinks per minute (range)
BLINK_SMOOTHING = 0.8  # Exponential smoothing for blink rate

# ============ HEAD POSE ESTIMATION ============
# Thresholds for head pose (in degrees)
HEAD_YAW_THRESHOLD = 25  # Left-right rotation
HEAD_PITCH_THRESHOLD = 25  # Up-down rotation
HEAD_ROLL_THRESHOLD = 20  # Tilt

HEAD_STABILITY_SMOOTHING = 0.75  # Exponential smoothing

# ============ CONFIDENCE SCORING ============
# Weights for each metric (must sum to 1.0)
CONFIDENCE_WEIGHTS = {
    'eye_contact': 0.35,      # Eye contact is most important
    'blink_behavior': 0.25,   # Normal blinking indicates comfort
    'head_stability': 0.25,   # Steady head shows confidence
    'facial_expression': 0.15  # Expression analysis (if enabled)
}

# Score thresholds for warnings
WARNING_EYE_CONTACT_THRESHOLD = 50  # If < 50%, warn about eye contact
WARNING_HEAD_STABILITY_THRESHOLD = 40  # If < 40%, warn about head movement
WARNING_BLINK_THRESHOLD_HIGH = 30  # If > 30 blinks/min, warn about nervousness
WARNING_BLINK_THRESHOLD_LOW = 10  # If < 10 blinks/min, warn about fatigue

# ============ TEMPORAL SMOOTHING ============
# Exponential moving average smoothing factors (0-1, higher = more smoothing)
FRAME_SMOOTHING_FACTOR = 0.7
SCORE_SMOOTHING_FACTOR = 0.8

# ============ WARNING SYSTEM ============
# Minimum duration (frames) before issuing a warning
WARNING_DURATION_THRESHOLD = 30  # ~1 second at 30 FPS
WARNING_COOLDOWN = 300  # Don't repeat same warning for 10 seconds

# ============ FLASK SERVER ============
FLASK_HOST = '127.0.0.1'
FLASK_PORT = 5001
FLASK_DEBUG = True

# ============ LOGGING ============
LOG_LEVEL = 'INFO'
LOG_FILE = 'cv_module.log'

# ============ PERFORMANCE ============
# Skip frames for faster processing (1 = process every frame, 2 = process every 2nd frame)
FRAME_SKIP = 1
