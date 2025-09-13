#!/usr/bin/env python3
"""
Gender Classification using YOLO11n-cls model
Standalone script for gender detection
"""

from ultralytics import YOLO
import cv2
import os
import argparse
import numpy as np
from pathlib import Path
import requests
import tempfile
from urllib.parse import urlparse

def download_image_from_url(url, silent=False):
    """Download image from URL to temporary file"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file.write(response.content)
        temp_file.close()
        
        return temp_file.name
    except Exception as e:
        if not silent:
            print(f"❌ Error downloading image from URL: {e}")
        return None

def is_url(string):
    """Check if string is a valid URL"""
    try:
        result = urlparse(string)
        return all([result.scheme, result.netloc])
    except:
        return False

class GenderClassifier:
    def __init__(self, model_path="weights/gender_best.pt", silent=False):
        """
        Initialize Gender Classifier
        Args:
            model_path: Path to trained gender classification model
            silent: If True, suppress all output messages
        """
        self.silent = silent
        try:
            self.model = YOLO(model_path, verbose=False)
            if not self.silent:
                print(f"✅ Gender model loaded: {model_path}")
                print(f"✅ Model classes: {self.model.names}")
        except Exception as e:
            raise Exception(f"Failed to load model: {e}")
    
    def predict_gender(self, image_path):
        """
        Predict gender for single image
        Returns: dict with prediction results
        """
        try:
            results = self.model(image_path, verbose=False)
            
            for result in results:
                probs = result.probs
                if probs is not None:
                    # Get top prediction
                    top_class_idx = probs.top1
                    top_confidence = probs.top1conf.item()
                    predicted_gender = self.model.names[top_class_idx]
                    
                    # Get all probabilities
                    all_probs = {}
                    for i, prob in enumerate(probs.data):
                        all_probs[self.model.names[i]] = float(prob.item())
                    
                    return {
                        "success": True,
                        "predicted_gender": predicted_gender,
                        "confidence": float(top_confidence),
                        "all_probabilities": all_probs
                    }
                else:
                    return {
                        "success": False,
                        "error": "Cannot classify gender"
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def process_image_with_visualization(self, image_path, output_dir="gender_results"):
        """
        Process image and save result with visualization
        """
        # Get prediction
        prediction = self.predict_gender(image_path)
        
        if not prediction["success"]:
            print(f"❌ Failed to classify {image_path}: {prediction['error']}")
            return None
        
        # Load image for visualization
        img = cv2.imread(image_path)
        if img is None:
            print(f"❌ Cannot read image: {image_path}")
            return None
        
        # Get results
        gender = prediction["predicted_gender"]
        confidence = prediction["confidence"]
        
        # Choose color based on gender
        color = (255, 0, 0) if gender == 'male' else (0, 0, 255)  # Blue for male, Red for female
        
        # Add text to image
        text = f"{gender}: {confidence:.3f}"
        cv2.putText(img, text, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)
        
        # Add all probabilities
        y_offset = 100
        for gender_class, prob in prediction["all_probabilities"].items():
            prob_text = f"{gender_class}: {prob:.3f}"
            cv2.putText(img, prob_text, (30, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            y_offset += 30
        
        # Save result
        os.makedirs(output_dir, exist_ok=True)
        filename = Path(image_path).stem
        output_path = os.path.join(output_dir, f"{filename}_gender.jpg")
        cv2.imwrite(output_path, img)
        
        return {
            "prediction": prediction,
            "output_path": output_path
        }
    
    def process_directory(self, input_dir, output_dir="gender_results"):
        """
        Process all images in directory
        """
        # Find all image files
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
        image_paths = []
        
        for ext in image_extensions:
            image_paths.extend(Path(input_dir).glob(f'*{ext}'))
            image_paths.extend(Path(input_dir).glob(f'*{ext.upper()}'))
        
        if not image_paths:
            print(f"❌ No images found in {input_dir}")
            return []
        
        print(f"📁 Found {len(image_paths)} images to process")
        
        results = []
        gender_stats = {"male": 0, "female": 0}
        
        for image_path in image_paths:
            print(f"\n📷 Processing: {image_path.name}")
            
            result = self.process_image_with_visualization(str(image_path), output_dir)
            if result:
                results.append(result)
                
                # Update statistics
                predicted_gender = result["prediction"]["predicted_gender"]
                confidence = result["prediction"]["confidence"]
                
                print(f"   👤 Gender: {predicted_gender}")
                print(f"   📊 Confidence: {confidence:.3f}")
                print(f"   💾 Saved: {result['output_path']}")
                
                gender_stats[predicted_gender] += 1
        
        # Print summary
        print(f"\n{'='*50}")
        print(f"📊 GENDER CLASSIFICATION SUMMARY")
        print(f"{'='*50}")
        print(f"✅ Processed: {len(results)} images")
        print(f"👨 Male: {gender_stats['male']} images")
        print(f"👩 Female: {gender_stats['female']} images")
        
        if len(results) > 0:
            male_percentage = (gender_stats['male'] / len(results)) * 100
            female_percentage = (gender_stats['female'] / len(results)) * 100
            print(f"📈 Distribution: {male_percentage:.1f}% male, {female_percentage:.1f}% female")
        
        print(f"💾 Results saved to: {output_dir}/")
        
        return results

def main():
    parser = argparse.ArgumentParser(description='Gender Classification with YOLO')
    parser.add_argument('--source', type=str, required=True,
                       help='Image path or directory path')
    parser.add_argument('--model', type=str, default='weights/gender_best.pt',
                       help='Path to gender classification model')
    parser.add_argument('--output', type=str, default='gender_results',
                       help='Output directory')
    parser.add_argument('--json', action='store_true',
                       help='Output JSON format for API integration')
    
    args = parser.parse_args()
    
    # Initialize classifier
    if not args.json:
        print("🚀 Initializing Gender Classifier...")
    try:
        classifier = GenderClassifier(model_path=args.model, silent=args.json)
    except Exception as e:
        if not args.json:
            print(f"❌ Error: {e}")
        return
    
    # Process input
    temp_file = None
    source_path = args.source
    
    # Check if source is URL
    if is_url(args.source):
        if not args.json:
            print(f"\n🌐 Downloading image from URL: {args.source}")
        temp_file = download_image_from_url(args.source, silent=args.json)
        if not temp_file:
            if not args.json:
                print("❌ Failed to download image")
            return
        source_path = temp_file
    
    if os.path.isfile(source_path):
        # Single image
        if not args.json:
            print(f"\n📷 Processing single image: {source_path}")
        result = classifier.process_image_with_visualization(source_path, args.output)
        if result:
            prediction = result["prediction"]
            if args.json:
                # Output JSON format for API integration
                import json
                api_result = {
                    "success": True,
                    "gender": prediction['predicted_gender'],
                    "confidence": float(prediction['confidence'])  # Ensure float type
                }
                print(json.dumps(api_result))
            else:
                print(f"\n✅ Result:")
                print(f"   Gender: {prediction['predicted_gender']}")
                print(f"   Confidence: {prediction['confidence']:.3f}")
                print(f"   Output: {result['output_path']}")
        else:
            if args.json:
                import json
                api_result = {
                    "success": False,
                    "error": "No faces detected or processing failed",
                    "gender": "unknown",
                    "confidence": 0.0
                }
                print(json.dumps(api_result))
            else:
                print("❌ No faces detected or processing failed")
        
    elif os.path.isdir(args.source):
        # Directory
        if not args.json:
            print(f"\n📁 Processing directory: {args.source}")
        results = classifier.process_directory(args.source, args.output)
        if not args.json:
            print(f"\n🎉 Completed processing {len(results)} images!")
        
    else:
        if not args.json:
            print(f"❌ Error: {args.source} is not a valid file or directory")
    
    # Cleanup temporary file
    if temp_file and os.path.exists(temp_file):
        os.unlink(temp_file)
        if not args.json:
            print(f"🧹 Cleaned up temporary file: {temp_file}")

if __name__ == "__main__":
    main()
