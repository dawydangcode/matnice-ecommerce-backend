#!/usr/bin/env python3
"""
Face Shape Classifier
Standalone script for face shape classification using YOLO
"""

import os
import sys
from pathlib import Path
from ultralytics import YOLO
import cv2
import numpy as np
import requests
import tempfile
from urllib.parse import urlparse
import json
import warnings

# Suppress warnings when in JSON mode
warnings.filterwarnings("ignore")

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

class FaceShapeClassifier:
    def __init__(self, model_path="faceshape_best.pt", silent=False):
        """
        Initialize the face shape classifier
        
        Args:
            model_path (str): Path to the trained face shape model
            silent (bool): Suppress print statements if True
        """
        self.model_path = model_path
        self.model = None
        self.silent = silent
        self.class_names = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']  # Update based on your actual classes
        self.load_model()
    
    def load_model(self):
        """Load the trained face shape model"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found: {self.model_path}")
            
            self.model = YOLO(self.model_path)
            if not self.silent:
                print(f"✅ Face shape model loaded successfully from {self.model_path}")
            
        except Exception as e:
            if not self.silent:
                print(f"❌ Error loading model: {e}")
            sys.exit(1)
    
    def predict_single_image(self, image_path, confidence_threshold=0.5):
        """
        Predict face shape for a single image
        
        Args:
            image_path (str): Path to the image or URL
            confidence_threshold (float): Minimum confidence threshold
            
        Returns:
            dict: Prediction results
        """
        try:
            # Run prediction (YOLO can handle both local paths and URLs)
            results = self.model(image_path, conf=confidence_threshold)
            
            if len(results) > 0:
                result = results[0]
                
                # Get prediction details
                if hasattr(result, 'probs') and result.probs is not None:
                    # Classification result
                    top1_idx = result.probs.top1
                    top1_conf = result.probs.top1conf.item()
                    
                    # Get all class probabilities
                    probs = result.probs.data.cpu().numpy()
                    
                    prediction = {
                        'image_path': image_path,
                        'predicted_class': self.class_names[top1_idx] if top1_idx < len(self.class_names) else f"Class_{top1_idx}",
                        'confidence': round(top1_conf, 4),
                        'all_probabilities': {
                            self.class_names[i] if i < len(self.class_names) else f"Class_{i}": round(prob, 4) 
                            for i, prob in enumerate(probs)
                        }
                    }
                    
                    return prediction
                else:
                    return {
                        'image_path': image_path,
                        'error': 'No classification results found'
                    }
            else:
                return {
                    'image_path': image_path,
                    'error': 'No detection results'
                }
                
        except Exception as e:
            return {
                'image_path': image_path,
                'error': f"Prediction error: {str(e)}"
            }
    
    def predict_batch(self, image_folder, confidence_threshold=0.5, output_file=None):
        """
        Predict face shape for multiple images in a folder
        
        Args:
            image_folder (str): Path to folder containing images
            confidence_threshold (float): Minimum confidence threshold
            output_file (str): Optional file to save results
            
        Returns:
            list: List of prediction results
        """
        if not os.path.exists(image_folder):
            print(f"❌ Folder not found: {image_folder}")
            return []
        
        # Supported image extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
        
        # Find all images
        image_files = []
        for ext in image_extensions:
            image_files.extend(Path(image_folder).glob(f"*{ext}"))
            image_files.extend(Path(image_folder).glob(f"*{ext.upper()}"))
        
        if not image_files:
            print(f"❌ No images found in {image_folder}")
            return []
        
        print(f"🔍 Found {len(image_files)} images to process...")
        
        results = []
        face_shape_counts = {}
        
        for i, image_file in enumerate(image_files, 1):
            print(f"Processing {i}/{len(image_files)}: {image_file.name}")
            
            prediction = self.predict_single_image(str(image_file), confidence_threshold)
            results.append(prediction)
            
            # Count face shapes
            if 'predicted_class' in prediction:
                face_shape = prediction['predicted_class']
                face_shape_counts[face_shape] = face_shape_counts.get(face_shape, 0) + 1
                
                print(f"  Result: {face_shape} (confidence: {prediction['confidence']})")
            else:
                print(f"  Error: {prediction.get('error', 'Unknown error')}")
        
        # Print summary
        print("\n" + "="*50)
        print("📊 FACE SHAPE ANALYSIS SUMMARY")
        print("="*50)
        
        total_processed = len([r for r in results if 'predicted_class' in r])
        total_errors = len([r for r in results if 'error' in r])
        
        print(f"Total images processed: {len(results)}")
        print(f"Successful predictions: {total_processed}")
        print(f"Errors: {total_errors}")
        print()
        
        if face_shape_counts:
            print("Face Shape Distribution:")
            for face_shape, count in sorted(face_shape_counts.items()):
                percentage = (count / total_processed) * 100 if total_processed > 0 else 0
                print(f"  {face_shape}: {count} images ({percentage:.1f}%)")
        
        # Save results to file if specified
        if output_file:
            self.save_results_to_file(results, output_file)
        
        return results
    
    def save_results_to_file(self, results, output_file):
        """Save prediction results to a text file"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("Face Shape Classification Results\n")
                f.write("="*50 + "\n\n")
                
                for result in results:
                    f.write(f"Image: {result['image_path']}\n")
                    if 'predicted_class' in result:
                        f.write(f"Face Shape: {result['predicted_class']}\n")
                        f.write(f"Confidence: {result['confidence']}\n")
                        f.write("All Probabilities:\n")
                        for shape, prob in result['all_probabilities'].items():
                            f.write(f"  {shape}: {prob}\n")
                    else:
                        f.write(f"Error: {result.get('error', 'Unknown error')}\n")
                    f.write("-" * 30 + "\n")
            
            print(f"📄 Results saved to: {output_file}")
            
        except Exception as e:
            print(f"❌ Error saving results: {e}")


def main():
    """Main function for command line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Face Shape Classifier')
    parser.add_argument('--model', default='faceshape_best.pt', help='Path to model file')
    parser.add_argument('--image', help='Path to single image or URL')
    parser.add_argument('--folder', help='Path to folder with images')
    parser.add_argument('--confidence', type=float, default=0.5, help='Confidence threshold')
    parser.add_argument('--output', help='Output file for batch results')
    parser.add_argument('--json', action='store_true', help='Output results in JSON format')
    
    args = parser.parse_args()
    
    # Initialize classifier
    classifier = FaceShapeClassifier(args.model, silent=args.json)
    
    if args.image:
        # Process input - handle URLs
        temp_file = None
        source_path = args.image
        
        # Check if source is URL
        if is_url(args.image):
            if not args.json:
                print(f"\n🌐 Downloading image from URL: {args.image}")
            temp_file = download_image_from_url(args.image, silent=args.json)
            if not temp_file:
                if args.json:
                    api_result = {
                        "success": False,
                        "error": "Failed to download image from URL",
                        "predicted_class": "unknown",
                        "confidence": 0.0
                    }
                    print(json.dumps(api_result))
                else:
                    print("❌ Failed to download image")
                return
            source_path = temp_file
        
        # Single image prediction
        result = classifier.predict_single_image(source_path, args.confidence)
        
        if args.json:
            # Output JSON for API consumption (match gender/skincolor format)
            if 'predicted_class' in result:
                api_result = {
                    "success": True,
                    "predicted_class": result['predicted_class'],
                    "confidence": float(result['confidence'])
                }
            else:
                api_result = {
                    "success": False,
                    "error": result.get('error', 'Unknown error'),
                    "predicted_class": "unknown",
                    "confidence": 0.0
                }
            print(json.dumps(api_result))
        else:
            # Human-readable output
            print(f"🔍 Analyzing single image: {args.image}")
            if 'predicted_class' in result:
                print(f"✅ Face Shape: {result['predicted_class']}")
                print(f"📊 Confidence: {result['confidence']}")
                print("\nAll Probabilities:")
                for shape, prob in result['all_probabilities'].items():
                    print(f"  {shape}: {prob}")
            else:
                print(f"❌ Error: {result.get('error', 'Unknown error')}")
        
        # Cleanup temporary file
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)
            if not args.json:
                print(f"🧹 Cleaned up temporary file: {temp_file}")
    
    elif args.folder:
        # Batch prediction
        if not args.json:
            print(f"🔍 Analyzing images in folder: {args.folder}")
        results = classifier.predict_batch(args.folder, args.confidence, args.output)
        
        if not results and not args.json:
            print("❌ No results to display")
    
    else:
        if not args.json:
            print("❌ Please specify either --image or --folder")
            parser.print_help()


if __name__ == "__main__":
    main()
