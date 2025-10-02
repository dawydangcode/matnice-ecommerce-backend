#!/usr/bin/env python3
"""
Batch Face Shape Classification Example
"""

from faceshape_classifier import FaceShapeClassifier
import os

def main():
    # Initialize the classifier
    print("🚀 Initializing Face Shape Classifier...")
    classifier = FaceShapeClassifier("faceshape_best.pt")
    
    # Example batch processing
    image_folder = "test_images"  # Change this to your image folder
    output_file = "face_shape_results.txt"
    confidence_threshold = 0.5
    
    print(f"🔍 Processing all images in folder: {image_folder}")
    print(f"📄 Results will be saved to: {output_file}")
    print(f"🎯 Confidence threshold: {confidence_threshold}")
    
    # Check if folder exists
    if not os.path.exists(image_folder):
        print(f"❌ Folder not found: {image_folder}")
        print("💡 Please create the folder and add some test images")
        return
    
    # Run batch prediction
    results = classifier.predict_batch(
        image_folder=image_folder,
        confidence_threshold=confidence_threshold,
        output_file=output_file
    )
    
    if results:
        print("\n" + "="*60)
        print("📊 DETAILED RESULTS")
        print("="*60)
        
        # Show top predictions
        successful_results = [r for r in results if 'predicted_class' in r]
        
        if successful_results:
            print(f"\n🔝 Top {min(5, len(successful_results))} Results:")
            
            # Sort by confidence
            top_results = sorted(successful_results, 
                               key=lambda x: x['confidence'], 
                               reverse=True)[:5]
            
            for i, result in enumerate(top_results, 1):
                filename = os.path.basename(result['image_path'])
                print(f"  {i}. {filename}")
                print(f"     Face Shape: {result['predicted_class']}")
                print(f"     Confidence: {result['confidence']:.2%}")
                print()
        
        # Show errors if any
        error_results = [r for r in results if 'error' in r]
        if error_results:
            print("❌ Errors:")
            for result in error_results[:3]:  # Show first 3 errors
                filename = os.path.basename(result['image_path'])
                print(f"  - {filename}: {result['error']}")
            
            if len(error_results) > 3:
                print(f"  ... and {len(error_results) - 3} more errors")
        
        print("\n✅ Batch processing complete!")
        print(f"📄 Detailed results saved to: {output_file}")
        
    else:
        print("❌ No results obtained")
        print("💡 Tips:")
        print("   - Make sure the image folder exists")
        print("   - Add some image files (JPG, PNG, etc.)")
        print("   - Check image file permissions")

if __name__ == "__main__":
    main()
