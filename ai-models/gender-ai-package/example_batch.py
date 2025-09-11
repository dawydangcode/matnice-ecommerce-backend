#!/usr/bin/env python3
"""
Example: Process batch of images
"""

from gender_classifier import GenderClassifier

def main():
    # Initialize classifier
    classifier = GenderClassifier(model_path="gender_best.pt")
    
    # Process directory of images
    input_dir = "test_images"
    output_dir = "batch_results"
    
    print(f"📁 Processing all images in: {input_dir}")
    
    results = classifier.process_directory(input_dir, output_dir)
    
    print(f"\n📊 Detailed Analysis:")
    for i, result in enumerate(results, 1):
        prediction = result["prediction"]
        print(f"Image {i}:")
        print(f"  Gender: {prediction['predicted_gender']}")
        print(f"  Confidence: {prediction['confidence']:.3f}")
        print(f"  All probs: {prediction['all_probabilities']}")
        print()

if __name__ == "__main__":
    main()
