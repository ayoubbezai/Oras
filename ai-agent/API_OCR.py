from flask import Flask, request, jsonify
import requests
import json
import base64
from werkzeug.utils import secure_filename
import os
from io import BytesIO
from PIL import Image
import tempfile

app = Flask(__name__)

# Configuration
API_KEY = "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"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Prompts for different document types
PROMPTS = {
    'DRIVER_LICENCE': """
just read form the image Perform OCR on the uploaded arabic driving licence Extract the following fields from this driving licence (and insurance if present) and return JSON:
                                    - Name(arabic)
                                    - First name(arabic)  
                                    - Date of birth  
                                    - Address
                                    - Country  
                                    - National identification number 
                                    - Driving licence number  
                                    - Groups (A, B…)  
                                    - Valid until  
                                    - Insurance company
""",
    'CAR_PLATE': """Perform OCR on the image.  
If a car plate is visible, extract and return only the license plate number as plain text.  
If no plate is found, return: "".
""",
    'CARTE_GRIS': """
extract from image Carte Gris algeria this information i need correct answer: 
  plate
  "make
  "model
  "vin": 
  "first_registration": 
  "category": 
  "fiscal_power_cv": 
  "ptac_kg": 
  "color": 
  "certificate_number": 
  "owner_name": 
  "owner_address":
"""
}


def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def encode_image_from_bytes(image_bytes):
    """Encode image bytes to base64 string"""
    return base64.b64encode(image_bytes).decode('utf-8')


def process_image_with_ai(image_bytes, prompt):
    """Send image to AI API for processing"""
    try:
        # Encode the image
        base64_image = encode_image_from_bytes(image_bytes)

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "meta-llama/llama-4-maverick:free",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
            })
        )

        if response.status_code == 200:
            result = response.json()
            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content']
                return {"success": True, "data": content}
            else:
                return {"success": False, "error": "No response from AI"}
        else:
            return {"success": False, "error": f"API Error: {response.status_code}", "details": response.text}

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.route('/', methods=['GET'])
def home():
    """API documentation endpoint"""
    return jsonify({
        "message": "Document OCR API",
        "version": "1.0",
        "endpoints": {
            "/driver_licence": "POST - Process driving licence (upload image)",
            "/car_plate": "POST - Extract car plate number (upload image)",
            "/carte_gris": "POST - Process carte grise document (upload image)"
        },
        "usage": "Send POST request with 'image' file in form-data"
    })


@app.route('/driver_licence', methods=['POST'])
def process_driver_licence():
    """Process driving licence image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    try:
        # Read image bytes
        image_bytes = file.read()

        # Process with AI
        result = process_image_with_ai(image_bytes, PROMPTS['DRIVER_LICENCE'])

        if result["success"]:
            return jsonify({
                "status": "success",
                "document_type": "driver_licence",
                "extracted_data": result["data"]
            })
        else:
            return jsonify({
                "status": "error",
                "error": result["error"],
                "details": result.get("details", "")
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/car_plate', methods=['POST'])
def process_car_plate():
    """Process car plate image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    try:
        # Read image bytes
        image_bytes = file.read()

        # Process with AI
        result = process_image_with_ai(image_bytes, PROMPTS['CAR_PLATE'])

        if result["success"]:
            return jsonify({
                "status": "success",
                "document_type": "car_plate",
                "plate_number": result["data"]
            })
        else:
            return jsonify({
                "status": "error",
                "error": result["error"],
                "details": result.get("details", "")
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/carte_gris', methods=['POST'])
def process_carte_gris():
    """Process carte grise document"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    try:
        # Read image bytes
        image_bytes = file.read()

        # Process with AI
        result = process_image_with_ai(image_bytes, PROMPTS['CARTE_GRIS'])

        if result["success"]:
            return jsonify({
                "status": "success",
                "document_type": "carte_gris",
                "extracted_data": result["data"]
            })
        else:
            return jsonify({
                "status": "error",
                "error": result["error"],
                "details": result.get("details", "")
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB"}), 413


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
