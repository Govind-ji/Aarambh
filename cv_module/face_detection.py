"""
Face Detection Module

Uses MediaPipe Face Landmarker to detect faces and extract facial landmarks.

What it does:
- Detects faces in video frames
- Extracts 468 facial landmarks
- Validates detection quality

Why MediaPipe:
- Fast (~30ms per frame on CPU)
- Accurate landmark detection
- Lightweight and easy to use
- Pre-trained on 1M+ faces
- Already in dependencies

Output:
- Face detected: True/False
- Face landmarks: 468 normalized (x, y, z) coordinates
- Detection confidence: 0-1 score
"""

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import numpy as np
from config import (
    FACE_DETECTION_CONFIDENCE,
    LANDMARK_CONFIDENCE,
    CAMERA_WIDTH,
    CAMERA_HEIGHT,
    MEDIAPIPE_MODEL_PATH,
    MODEL_BACKEND,
    HF_MODEL_NAME,
    HF_DEVICE,
)


class FaceDetector:
    """
    Detects faces and extracts facial landmarks using MediaPipe.

    Optional Hugging Face support can be enabled as a secondary signal while
    keeping MediaPipe as the main detector and landmark source.
    """
    
    def __init__(self):
        """Initialize MediaPipe Face Landmarker."""
        self.backend = MODEL_BACKEND.lower()
        self.hf_pipeline = None
        self.hf_confidence = 0.0

        # Create BaseOptions for model configuration
        base_options = python.BaseOptions(model_asset_path=MEDIAPIPE_MODEL_PATH)
        
        # Create FaceLandmarker options
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            min_face_detection_confidence=FACE_DETECTION_CONFIDENCE,
            min_face_presence_confidence=LANDMARK_CONFIDENCE,
            num_faces=1  # We only care about the first face
        )
        
        # Create the FaceLandmarker
        self.detector = vision.FaceLandmarker.create_from_options(options)

        if self.backend == 'huggingface':
            try:
                from transformers import pipeline
                self.hf_pipeline = pipeline(
                    'image-classification',
                    model=HF_MODEL_NAME,
                    device=HF_DEVICE,
                )
                print('[HF] Hugging Face image-classification backend enabled as secondary signal')
            except Exception as exc:
                print(f'[HF] Could not load Hugging Face model: {exc}')
                print('[HF] Falling back to MediaPipe landmark detection')
                self.hf_pipeline = None
        
        # Statistics
        self.frames_processed = 0
        self.faces_detected = 0

    def _get_hf_confidence(self, frame):
        """Optional secondary confidence signal from a Hugging Face model."""
        if self.hf_pipeline is None:
            return 0.0

        try:
            result = self.hf_pipeline(frame, top_k=1)
            if not result:
                return 0.0
            score = float(result[0].get('score', 0.0))
            self.hf_confidence = score
            return score
        except Exception as exc:
            print(f'[HF] Secondary confidence request failed: {exc}')
            return 0.0
    
    def detect(self, frame):
        """
        Detect face landmarks in a video frame.
        
        Args:
            frame: OpenCV BGR image (numpy array)
        
        Returns:
            dict: {
                'detected': bool,
                'landmarks': list of NormalizedLandmark objects or None,
                'face_count': int,
                'confidence': float
            }
        """
        self.frames_processed += 1
        
        # Convert BGR to RGB for MediaPipe
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Create MediaPipe Image object
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
        
        # Run detection
        detection_result = self.detector.detect(mp_image)
        
        # Check if face detected
        face_detected = (
            detection_result.face_landmarks is not None 
            and len(detection_result.face_landmarks) > 0
        )

        hf_confidence = self._get_hf_confidence(frame) if self.backend == 'huggingface' else 0.0
        
        if face_detected:
            self.faces_detected += 1
            landmarks = detection_result.face_landmarks[0]  # Get first face
            confidence = detection_result.face_blendshapes[0] if detection_result.face_blendshapes else []
            
            return {
                'detected': True,
                'landmarks': landmarks,
                'face_count': len(detection_result.face_landmarks),
                'confidence': 0.9,  # MediaPipe doesn't return explicit confidence
                'hf_confidence': hf_confidence,
                'blendshapes': confidence  # Facial expression intensities
            }
        
        return {
            'detected': False,
            'landmarks': None,
            'face_count': 0,
            'confidence': 0.0,
            'hf_confidence': hf_confidence,
            'blendshapes': None
        }
    
    def get_landmark_coordinates(self, landmarks, frame_width=CAMERA_WIDTH, frame_height=CAMERA_HEIGHT):
        """
        Convert normalized MediaPipe landmarks to pixel coordinates.
        
        MediaPipe returns landmarks in normalized coordinates (0-1).
        This converts them to pixel coordinates for visualization/processing.
        
        Args:
            landmarks: List of NormalizedLandmark objects from MediaPipe
            frame_width: Frame width in pixels
            frame_height: Frame height in pixels
        
        Returns:
            list: List of (x, y) tuples in pixel coordinates
        """
        coordinates = []
        for landmark in landmarks:
            x = int(landmark.x * frame_width)
            y = int(landmark.y * frame_height)
            coordinates.append((x, y))
        
        return coordinates
    
    def draw_landmarks(self, frame, landmarks, draw_numbers=False):
        """
        Draw facial landmarks on frame for visualization.
        
        Args:
            frame: OpenCV image to draw on
            landmarks: List of NormalizedLandmark objects
            draw_numbers: Whether to draw landmark index numbers
        
        Returns:
            frame: Image with landmarks drawn
        """
        h, w = frame.shape[:2]
        
        for idx, landmark in enumerate(landmarks):
            x = int(landmark.x * w)
            y = int(landmark.y * h)
            
            # Draw small circle for each landmark
            cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)
            
            # Draw landmark number (optional, for debugging)
            if draw_numbers and idx % 10 == 0:  # Draw every 10th number to avoid clutter
                cv2.putText(frame, str(idx), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 0, 0), 1)
        
        return frame
    
    def draw_face_mesh(self, frame, landmarks):
        """
        Draw facial mesh connections on frame.
        
        Connects landmarks to show face structure.
        
        Args:
            frame: OpenCV image
            landmarks: List of NormalizedLandmark objects
        
        Returns:
            frame: Image with mesh drawn
        """
        h, w = frame.shape[:2]
        
        # Define key connections for face mesh visualization
        # These are the main facial feature outlines
        connections = [
            # Face outline
            (10, 338), (338, 297), (297, 332), (332, 284), (284, 251), (251, 389),
            (389, 356), (356, 454), (454, 323), (323, 361), (361, 288), (288, 397),
            (397, 365), (365, 379), (379, 378), (378, 400), (400, 377), (377, 152),
            (152, 148), (148, 176), (176, 149), (149, 150), (150, 136), (136, 172),
            
            # Left eye
            (33, 7), (7, 163), (163, 144), (144, 145), (145, 153), (153, 154),
            (154, 155), (155, 133), (133, 33),
            
            # Right eye
            (362, 382), (382, 381), (381, 380), (380, 374), (374, 373), (373, 390),
            (390, 249), (249, 362),
            
            # Nose
            (1, 4), (4, 5), (5, 6),
            (6, 2), (2, 3), (3, 7),
            
            # Mouth
            (61, 146), (146, 91), (91, 181), (181, 84), (84, 17), (17, 314),
            (314, 405), (405, 321), (321, 375), (375, 291), (291, 308), (308, 324),
            (324, 318), (318, 402), (402, 317), (317, 14), (14, 87), (87, 178),
            (178, 88), (88, 95), (95, 61)
        ]
        
        for start_idx, end_idx in connections:
            if start_idx < len(landmarks) and end_idx < len(landmarks):
                start = landmarks[start_idx]
                end = landmarks[end_idx]
                
                x1, y1 = int(start.x * w), int(start.y * h)
                x2, y2 = int(end.x * w), int(end.y * h)
                
                cv2.line(frame, (x1, y1), (x2, y2), (0, 255, 0), 1)
        
        return frame
    
    def get_stats(self):
        """
        Get detection statistics.
        
        Returns:
            dict: Statistics about face detection performance
        """
        detection_rate = (self.faces_detected / self.frames_processed * 100 
                         if self.frames_processed > 0 else 0)
        
        return {
            'frames_processed': self.frames_processed,
            'faces_detected': self.faces_detected,
            'detection_rate': detection_rate
        }
