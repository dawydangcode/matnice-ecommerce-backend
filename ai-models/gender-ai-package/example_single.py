#!/usr/bin/env python3
"""
Example: Process single image
"""

from gender_classifier import GenderClassifier

def main():
    # Initialize classifier
    classifier = GenderClassifier(model_path="gender_best.pt")
    
    # Process single image
    image_path = "test_images/f2.jpg"  # Change this path
    
    print(f"🔍 Analyzing: {image_path}")
    
    # Get prediction only
    prediction = classifier.predict_gender(image_path)
    
    if prediction["success"]:
        print(f"👤 Gender: {prediction['predicted_gender']}")
        print(f"📊 Confidence: {prediction['confidence']:.3f}")
        print(f"📋 All probabilities:")
        for gender, prob in prediction['all_probabilities'].items():
            print(f"   {gender}: {prob:.3f}")
    else:
        print(f"❌ Error: {prediction['error']}")
    
    # Process with visualization
    result = classifier.process_image_with_visualization(image_path, "example_output")
    
    if result:
        print(f"💾 Visualization saved: {result['output_path']}")

if __name__ == "__main__":
    main()
