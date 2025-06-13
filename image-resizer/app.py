import os
import io
from urllib.parse import unquote_plus
from flask import Flask, request
from minio import Minio
from PIL import Image

app = Flask(__name__)

# Read MinIO config from env
MINIO_ENDPOINT   = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.environ["MINIO_ACCESS_KEY"]
MINIO_SECRET_KEY = os.environ["MINIO_SECRET_KEY"]
MINIO_SECURE     = os.getenv("MINIO_SECURE", "true").lower() in ("1", "true", "yes")

# Initialize MinIO client
s3 = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE
)

# Define the widths you want to generate for thumbnails
THUMB_WIDTHS = [200, 400]
# Define the max width for web‑optimized full images
WEB_MAX_WIDTH = 800

@app.route("/events", methods=["POST"])
def handle_event():
    event = request.get_json()
    print(f"\n=== Received event payload: {event}\n", flush=True)

    for rec in event.get("Records", []):
        bucket  = rec["s3"]["bucket"]["name"]
        raw_key = rec["s3"]["object"]["key"]

        # URL‑decode spaces (“+”) and percent‑escapes
        decoded_key = unquote_plus(raw_key)
        print(f"Raw key from event:    '{raw_key}'", flush=True)
        print(f"URL‑decoded key:       '{decoded_key}'", flush=True)

        # Skip any generated assets to avoid recursion
        if "/thumbs/" in decoded_key or decoded_key.startswith("thumbs/") \
        or "/web/" in decoded_key    or decoded_key.startswith("web/"):
            print(f"Skipping generated asset '{decoded_key}'", flush=True)
            continue

        # Normalize: strip leading "bucket/" if present
        prefix = f"{bucket}/"
        if decoded_key.startswith(prefix):
            object_key = decoded_key[len(prefix):]
            print(f"Stripped bucket prefix → '{object_key}'", flush=True)
        else:
            object_key = decoded_key

        # Only handle PNGs
        if not object_key.lower().endswith(".png"):
            print(f"Skipping '{object_key}' (not a .png)", flush=True)
            continue

        # Fetch original
        try:
            resp = s3.get_object(bucket, object_key)
            data = resp.read(); resp.close()
            img  = Image.open(io.BytesIO(data))
            print(f"Fetched '{object_key}' ({img.width}×{img.height})", flush=True)
        except Exception as e:
            print(f"Error fetching/opening '{object_key}': {e}", flush=True)
            continue

        # Determine base directory and filename
        if "/" in object_key:
            base_dir, filename = object_key.rsplit("/", 1)
            thumb_dir = f"{base_dir}/thumbs"
            web_dir   = f"{base_dir}/web"
        else:
            filename  = object_key
            thumb_dir = "thumbs"
            web_dir   = "web"
        name_no_ext = filename[:-4]  # drop ".png"

        # 1) Generate thumbnails
        for w in THUMB_WIDTHS:
            try:
                h = int(w * img.height / img.width)
                thumb = img.resize((w, h), Image.LANCZOS)
                buf = io.BytesIO()
                thumb.save(buf, format="PNG")
                buf.seek(0)

                thumb_key = f"{thumb_dir}/{name_no_ext}–{w}w.png"
                print(f"Uploading thumbnail '{thumb_key}' [{w}×{h}]", flush=True)
                s3.put_object(
                    bucket_name=bucket,
                    object_name=thumb_key,
                    data=buf,
                    length=buf.getbuffer().nbytes,
                    content_type="image/png"
                )
                print(f"✔ Uploaded thumbnail '{thumb_key}'", flush=True)
            except Exception as e:
                print(f"✖ Thumb failed '{thumb_key}': {e}", flush=True)

        # 2) Generate web‑sized full image
        try:
            web_w = min(WEB_MAX_WIDTH, img.width)
            web_h = int(web_w * img.height / img.width)
            web_img = img.resize((web_w, web_h), Image.LANCZOS)

            buf = io.BytesIO()
            web_img.save(buf, format="PNG")  # or 'JPEG' + quality arg if preferred
            buf.seek(0)

            web_key = f"{web_dir}/{name_no_ext}–{web_w}w.png"
            print(f"Uploading web image '{web_key}' [{web_w}×{web_h}]", flush=True)
            s3.put_object(
                bucket_name=bucket,
                object_name=web_key,
                data=buf,
                length=buf.getbuffer().nbytes,
                content_type="image/png"
            )
            print(f"✔ Uploaded web image '{web_key}'", flush=True)
        except Exception as e:
            print(f"✖ Web image failed '{web_key}': {e}", flush=True)

    return "", 204

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    print(f"Starting image-resizer on port {port}, talking to {MINIO_ENDPOINT} (secure={MINIO_SECURE})", flush=True)
    app.run(host="0.0.0.0", port=port)
