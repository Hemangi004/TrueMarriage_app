import io
import base64
import logging
from typing import Optional
import httpx
from PIL import Image

logger = logging.getLogger(__name__)

async def download_and_convert_image_url(
    url: str,
    max_dimension: int = 1200,
    max_size_bytes: int = 10 * 1024 * 1024
) -> Optional[str]:
    """
    Downloads an image from a public HTTP/HTTPS URL, validates it,
    optimizes it with Pillow, and converts it to a permanent Base64 Data URL
    for persistence in the database.
    """
    if not url or not (url.startswith("http://") or url.startswith("https://")):
        return None

    try:
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=True) as client:
            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
            }
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                logger.warning(f"Failed to fetch image URL {url}: HTTP {response.status_code}")
                return None

            content = response.content
            if len(content) == 0 or len(content) > max_size_bytes:
                logger.warning(f"Image from {url} is empty or exceeds max size of {max_size_bytes} bytes")
                return None

            # Open and validate image with Pillow
            with Image.open(io.BytesIO(content)) as img:
                # Handle image orientation from EXIF if present
                try:
                    from PIL import ImageOps
                    img = ImageOps.exif_transpose(img)
                except Exception:
                    pass

                raw_format = (img.format or "JPEG").upper()
                if raw_format in ["PNG"]:
                    output_format = "PNG"
                    mime_type = "image/png"
                elif raw_format in ["WEBP"]:
                    output_format = "WEBP"
                    mime_type = "image/webp"
                else:
                    output_format = "JPEG"
                    mime_type = "image/jpeg"

                # Downscale proportionally if larger than max_dimension
                if img.width > max_dimension or img.height > max_dimension:
                    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

                output = io.BytesIO()
                if output_format == "JPEG":
                    if img.mode in ("RGBA", "P", "LA"):
                        img = img.convert("RGB")
                    img.save(output, format="JPEG", quality=88, optimize=True)
                elif output_format == "WEBP":
                    img.save(output, format="WEBP", quality=88)
                else:
                    img.save(output, format="PNG", optimize=True)

                output_bytes = output.getvalue()
                b64_str = base64.b64encode(output_bytes).decode("utf-8")
                return f"data:{mime_type};base64,{b64_str}"

    except Exception as exc:
        logger.error(f"Error downloading/converting image from URL {url}: {exc}")
        return None
