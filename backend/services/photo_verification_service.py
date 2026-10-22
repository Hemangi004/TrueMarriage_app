"""
Photo Verification Service
Detects if an uploaded photo contains a human (frontal face, candid profile, looking away, upper body, or full body).
Rejects non-human photos (food, scenery, cars, animals, graphics, memes, etc.).
"""

import io
import base64
import logging
from typing import Tuple, Union, Optional, Any
import cv2
import numpy as np
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

# Preload cascade classifiers to avoid repeated disk I/O
_frontal_alt2: Any = None
_frontal_alt: Any = None
_profile_face: Any = None
_upper_body: Any = None
_full_body: Any = None
_cat_face: Any = None


def _get_classifiers():
    global _frontal_alt2, _frontal_alt, _profile_face, _upper_body, _full_body, _cat_face
    if _frontal_alt2 is None:
        try:
            p = cv2.data.haarcascades
            _frontal_alt2 = cv2.CascadeClassifier(p + "haarcascade_frontalface_alt2.xml")
            _frontal_alt = cv2.CascadeClassifier(p + "haarcascade_frontalface_alt.xml")
            _profile_face = cv2.CascadeClassifier(p + "haarcascade_profileface.xml")
            _upper_body = cv2.CascadeClassifier(p + "haarcascade_upperbody.xml")
            _full_body = cv2.CascadeClassifier(p + "haarcascade_fullbody.xml")
            _cat_face = cv2.CascadeClassifier(p + "haarcascade_frontalcatface.xml")
        except Exception as e:
            logger.error(f"Failed to initialize Haar Cascade classifiers: {e}")
    return _frontal_alt2, _frontal_alt, _profile_face, _upper_body, _full_body, _cat_face


def _decode_image_bytes(image_input: Union[str, bytes]) -> Optional[bytes]:
    """
    Normalizes various image input formats into raw image bytes.
    Supports raw bytes, base64 data URLs, raw base64 strings, and HTTP/HTTPS URLs.
    """
    if isinstance(image_input, bytes):
        return image_input

    if not isinstance(image_input, str):
        return None

    str_data = image_input.strip()
    if not str_data:
        return None

    # Case 1: Data URL format (data:image/jpeg;base64,....)
    if str_data.startswith("data:image/") and ";base64," in str_data:
        try:
            _, b64_part = str_data.split(";base64,", 1)
            return base64.b64decode(b64_part.strip())
        except Exception as e:
            logger.warning(f"Failed to decode base64 data URI: {e}")
            return None

    # Case 2: HTTP or HTTPS URL
    if str_data.startswith("http://") or str_data.startswith("https://"):
        try:
            import httpx
            with httpx.Client(timeout=10.0, follow_redirects=True) as client:
                resp = client.get(str_data, headers={"User-Agent": "Mozilla/5.0"})
                if resp.status_code == 200:
                    return resp.content
                logger.warning(f"HTTP fetch failed for photo verification: status {resp.status_code}")
                return None
        except Exception as e:
            logger.warning(f"Failed to download image from URL {str_data}: {e}")
            return None

    # Case 3: Raw base64 string
    try:
        return base64.b64decode(str_data)
    except Exception:
        return None


def verify_human_face(image_input: Union[str, bytes]) -> Tuple[bool, str, int]:
    """
    Verifies that the provided image contains a human.
    Accepts:
    - Frontal portraits (direct camera gaze)
    - Candid portraits (looking away, smiling, turned head, 3/4 angle)
    - Side-profile faces (left or right facing)
    - Torso / upper-body & full-body human shots

    Rejects:
    - Food (pizzas, burgers, curries, plates)
    - Nature & landscapes
    - Cars & vehicles
    - Pets & animals
    - Abstract graphics & objects

    Returns:
        (is_valid: bool, message: str, human_count: int)
    """
    raw_bytes = _decode_image_bytes(image_input)
    if not raw_bytes:
        return False, "Please follow platform guidelines: Upload a clear portrait photo showing your face.", 0

    try:
        with Image.open(io.BytesIO(raw_bytes)) as pil_img:
            # Handle orientation from smartphone EXIF metadata
            try:
                pil_img = ImageOps.exif_transpose(pil_img)
            except Exception:
                pass

            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")

            img_w, img_h = pil_img.size
            if img_w < 40 or img_h < 40:
                return False, "Please follow platform guidelines: Image resolution is too small. Please upload a clear photo.", 0

            # Convert PIL image to OpenCV BGR format and grayscale
            np_img = np.array(pil_img)
            bgr = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

            f_alt2, f_alt, p_face, u_body, full_body, cat_face = _get_classifiers()
            if not f_alt2:
                logger.error("OpenCV cascade classifiers unavailable.")
                return True, "Verification skipped (classifiers unavailable)", 1

            min_face_dim = max(35, int(min(img_w, img_h) * 0.05))
            min_face_size = (min_face_dim, min_face_dim)

            # 1. Frontal faces (alt2 and alt Gentle AdaBoost)
            frontal_faces = list(f_alt2.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=min_face_size))
            if len(frontal_faces) == 0:
                frontal_faces = list(f_alt.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=min_face_size))

            # 2. Equalized frontal pass (for backlit / shadowy portraits)
            if len(frontal_faces) == 0:
                eq_gray = cv2.equalizeHist(gray)
                frontal_faces = list(f_alt2.detectMultiScale(eq_gray, scaleFactor=1.1, minNeighbors=5, minSize=min_face_size))

            # 3. Profile face detector (candid, turned head, looking sideways / away)
            profile_faces = []
            if len(frontal_faces) == 0 and p_face is not None:
                profile_faces = list(p_face.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=min_face_size))
                if len(profile_faces) == 0:
                    # Also check horizontally flipped for opposite-facing profile
                    flipped_gray = cv2.flip(gray, 1)
                    flip_p = p_face.detectMultiScale(flipped_gray, scaleFactor=1.1, minNeighbors=4, minSize=min_face_size)
                    if len(flip_p) > 0:
                        profile_faces = list(flip_p)

            # 4. Upper body & full body detector (head + shoulders + torso, looking away or down)
            body_detections = []
            if len(frontal_faces) == 0 and len(profile_faces) == 0:
                if u_body is not None:
                    min_body_dim = max(50, int(min(img_w, img_h) * 0.10))
                    body_detections = list(u_body.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(min_body_dim, min_body_dim)))
                if len(body_detections) == 0 and full_body is not None:
                    min_body_dim = max(60, int(min(img_w, img_h) * 0.12))
                    body_detections = list(full_body.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(min_body_dim, min_body_dim)))

            # 5. Pet filter: if cat face detected with 0 human frontal/profile/body detections, reject
            if cat_face is not None and len(frontal_faces) == 0 and len(profile_faces) == 0 and len(body_detections) == 0:
                cats = cat_face.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=min_face_size)
                if len(cats) > 0:
                    return (
                        False,
                        "Please follow platform guidelines: Upload a clear photo of yourself (pet and animal photos are not allowed).",
                        0,
                    )

            total_human_count = len(frontal_faces) + len(profile_faces) + len(body_detections)

            # Rejection rules:
            if total_human_count == 0:
                return (
                    False,
                    "Please follow platform guidelines: Upload a clear portrait photo showing your face (photos of food, objects, scenery, or pets are not allowed).",
                    0,
                )

            # Human detected! (Background humans/bystanders are allowed since user can crop to themselves in the crop modal)
            return True, "Human verified successfully.", total_human_count

    except Exception as exc:
        logger.error(f"Error during photo verification: {exc}")
        return False, "Please follow platform guidelines: Could not verify photo. Please upload a clear JPG, PNG, or WebP photo.", 0
