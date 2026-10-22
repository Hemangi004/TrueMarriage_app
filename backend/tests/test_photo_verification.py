import io
import base64
import pytest
from PIL import Image, ImageDraw
from backend.services.photo_verification_service import verify_human_face


def test_empty_input_rejected():
    valid, msg, count = verify_human_face("")
    assert not valid
    assert count == 0


def test_corrupt_data_rejected():
    valid, msg, count = verify_human_face("not_a_valid_base64_or_image")
    assert not valid
    assert count == 0


def test_solid_color_image_rejected():
    # Solid background image contains no human face
    img = Image.new("RGB", (300, 300), color=(120, 180, 240))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64 = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

    valid, msg, count = verify_human_face(b64)
    assert not valid
    assert count == 0
    assert "platform guidelines" in msg.lower()


def test_food_image_rejected():
    # Synthetic pizza / food image with toppings
    img = Image.new("RGB", (400, 400), color=(240, 230, 210))
    draw = ImageDraw.Draw(img)
    draw.ellipse([50, 50, 350, 350], fill=(210, 140, 60), outline=(160, 90, 30), width=8)
    draw.ellipse([70, 70, 330, 330], fill=(255, 215, 0))
    draw.ellipse([100, 110, 150, 160], fill=(180, 40, 30))
    draw.ellipse([240, 130, 290, 180], fill=(180, 40, 30))
    draw.ellipse([170, 220, 220, 270], fill=(180, 40, 30))

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64 = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

    valid, msg, count = verify_human_face(b64)
    assert not valid
    assert count == 0
    assert "platform guidelines" in msg.lower()

