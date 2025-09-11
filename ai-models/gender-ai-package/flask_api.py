#!/usr/bin/env python3
"""
Flask API example for Gender Classification
"""

from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import tempfile
from gender_classifier import GenderClassifier

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize classifier
classifier = GenderClassifier(model_path="gender_best.pt")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "gender-classification",
        "model": "YOLO11n-cls"
    })

@app.route('/classify', methods=['POST'])
def classify_gender():
    try:
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format"}), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
        
        # Classify gender
        result = classifier.predict_gender(temp_path)
        
        # Clean up
        os.unlink(temp_path)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "prediction": {
                    "gender": result["predicted_gender"],
                    "confidence": result["confidence"],
                    "probabilities": result["all_probabilities"]
                }
            })
        else:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/info', methods=['GET'])
def model_info():
    return jsonify({
        "model": "YOLO11n-cls",
        "classes": ["male", "female"],
        "accuracy": "97.8%",
        "input_size": "224x224",
        "model_size": "3.2MB"
    })

if __name__ == '__main__':
    print("🚀 Starting Gender Classification API...")
    print("📡 Endpoints:")
    print("   POST /classify - Upload image for classification")
    print("   GET /health - Health check")
    print("   GET /info - Model information")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
