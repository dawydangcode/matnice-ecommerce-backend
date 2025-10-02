#!/usr/bin/env python3
"""
Single Image Face Shape Classification Example
"""

from faceshape_classifier import FaceShapeClassifier

def main():
    # Initialize the classifier
    print("🚀 Initializing Face Shape Classifier...")
    classifier = FaceShapeClassifier("faceshape_best.pt")
    
    # Example single image prediction
    image_path = "test_images/sample.jpg"  # Change this to your image path
    
    print(f"🔍 Analyzing image: {image_path}")
    
    # Get prediction
    result = classifier.predict_single_image(image_path, confidence_threshold=0.5)
    
    # Display results
    if 'predicted_class' in result:
        print("\n" + "="*50)
        print("📊 FACE SHAPE ANALYSIS RESULT")
        print("="*50)
        print(f"Image: {result['image_path']}")
        print(f"Predicted Face Shape: {result['predicted_class']}")
        print(f"Confidence: {result['confidence']:.2%}")
        print("\nAll Face Shape Probabilities:")
        
        for shape, probability in result['all_probabilities'].items():
            print(f"  {shape:8}: {probability:.2%}")
        
        print("="*50)
        
        # Interpretation
        confidence = result['confidence']
        if confidence > 0.8:
            print("✅ High confidence prediction")
        elif confidence > 0.6:
            print("⚠️  Medium confidence prediction")
        else:
            print("⚠️  Low confidence prediction - consider using a clearer image")
            
    else:
        print(f"❌ Error: {result.get('error', 'Unknown error')}")
        print("💡 Tips:")
        print("   - Make sure the image file exists")
        print("   - Use a clear image with a visible face")
        print("   - Supported formats: JPG, PNG, BMP, TIFF, WEBP")

if __name__ == "__main__":
    main()
