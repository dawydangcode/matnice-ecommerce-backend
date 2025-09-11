#!/usr/bin/env python3
"""
Simple test script for Gender Classifier
"""

from gender_classifier import GenderClassifier
import os

def test_gender_classifier():
    """Test the gender classifier with sample images"""
    
    print("🧪 TESTING GENDER CLASSIFIER")
    print("="*50)
    
    # Initialize classifier
    try:
        classifier = GenderClassifier(model_path="gender_best.pt")
        print("✅ Classifier initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing classifier: {e}")
        return
    
    # Test directory (you can change this)
    test_dir = "test_images"
    
    # Create test directory with some sample images if it doesn't exist
    if not os.path.exists(test_dir):
        print(f"📁 Test directory '{test_dir}' not found.")
        print("Please create the directory and add some test images.")
        return
    
    # Process test images
    print(f"\n📁 Processing images in: {test_dir}")
    results = classifier.process_directory(test_dir, "test_results")
    
    if results:
        print(f"\n🎉 Successfully processed {len(results)} images!")
        print(f"📁 Check results in: test_results/")
        
        # Show detailed results
        print(f"\n📋 Detailed Results:")
        for i, result in enumerate(results, 1):
            prediction = result["prediction"]
            print(f"  {i}. Gender: {prediction['predicted_gender']}, "
                  f"Confidence: {prediction['confidence']:.3f}")
    else:
        print("❌ No images processed successfully.")

def test_single_image():
    """Test with a single image"""
    print(f"\n🖼️  Testing single image...")
    
    # You can specify a test image here
    test_image = "test_images/sample.jpg"  # Change this path
    
    if os.path.exists(test_image):
        classifier = GenderClassifier()
        result = classifier.process_image_with_visualization(test_image, "single_test")
        
        if result:
            prediction = result["prediction"]
            print(f"✅ Single image test successful!")
            print(f"   Gender: {prediction['predicted_gender']}")
            print(f"   Confidence: {prediction['confidence']:.3f}")
            print(f"   Result saved: {result['output_path']}")
        else:
            print("❌ Single image test failed!")
    else:
        print(f"❌ Test image not found: {test_image}")

if __name__ == "__main__":
    test_gender_classifier()
    
    print(f"\n🏁 Testing completed!")
    print(f"\n💡 Usage examples:")
    print(f"   python gender_classifier.py --source test_images/")
    print(f"   python gender_classifier.py --source single_image.jpg")
    print(f"   python gender_classifier.py --source images/ --output custom_results/")
