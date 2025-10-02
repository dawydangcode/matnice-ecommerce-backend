# Face Shape AI Model Package

This package contains a trained YOLO-based face shape classifier that can identify 5 different face shapes: Heart, Oblong, Oval, Round, and Square.

## Model Performance
- **Accuracy**: 82.9% on validation set
- **Framework**: YOLOv11n-cls
- **Input Size**: 224x224 pixels
- **Classes**: 5 face shapes

## Package Contents

```
faceshape-ai-package/
├── faceshape_best.pt          # Trained model weights
├── faceshape_classifier.py    # Main classifier script
├── test_faceshape.py         # Test script with image folder
├── requirements.txt          # Python dependencies
├── example_single.py         # Single image example
├── example_batch.py          # Batch processing example
├── test_images/              # Sample test images
└── README.md                 # This file
```

## Installation

1. **Install Python 3.8 or higher**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download additional dependencies (if needed):**
   ```bash
   pip install ultralytics
   ```

## Usage

### 1. Single Image Classification

```bash
python faceshape_classifier.py --image path/to/your/image.jpg
```

### 2. Batch Processing (Folder)

```bash
python faceshape_classifier.py --folder path/to/image/folder --output results.txt
```

### 3. With Custom Confidence Threshold

```bash
python faceshape_classifier.py --image test.jpg --confidence 0.7
```

### 4. Using the Test Script

```bash
python test_faceshape.py
```

## Python API Usage

```python
from faceshape_classifier import FaceShapeClassifier

# Initialize classifier
classifier = FaceShapeClassifier("faceshape_best.pt")

# Single image prediction
result = classifier.predict_single_image("image.jpg")
print(f"Face Shape: {result['predicted_class']}")
print(f"Confidence: {result['confidence']}")

# Batch prediction
results = classifier.predict_batch("image_folder/")
```

## Face Shape Classes

The model can classify faces into these 5 categories:

1. **Heart**: Wide forehead, narrow chin
2. **Oblong**: Long face, similar width throughout
3. **Oval**: Balanced proportions, slightly longer than wide
4. **Round**: Equal width and height, soft curves
5. **Square**: Strong jawline, similar width and height

## Output Format

### Single Image Result:
```json
{
    "image_path": "image.jpg",
    "predicted_class": "Oval",
    "confidence": 0.8567,
    "all_probabilities": {
        "Heart": 0.0234,
        "Oblong": 0.0456,
        "Oval": 0.8567,
        "Round": 0.0523,
        "Square": 0.0220
    }
}
```

### Batch Results:
- Console output with progress and summary
- Optional text file with detailed results
- Statistics showing distribution of face shapes

## Tips for Best Results

1. **Image Quality**: Use clear, well-lit images
2. **Face Visibility**: Ensure the full face is visible
3. **Resolution**: Higher resolution images generally work better
4. **Angle**: Front-facing or slight angle works best
5. **Confidence**: Adjust threshold based on your needs (default: 0.5)

## Troubleshooting

### Common Issues:

1. **Module not found**: Make sure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **Model file not found**: Ensure `faceshape_best.pt` is in the same directory

3. **CUDA errors**: The model will automatically use GPU if available, CPU otherwise

4. **Memory issues**: For batch processing, try smaller batches or lower resolution images

### Performance Tips:

- Use GPU for faster inference
- Batch processing is more efficient than individual predictions
- Resize very large images to reduce processing time

## Model Details

- **Architecture**: YOLOv11n-cls (Classification)
- **Training Dataset**: Custom face shape dataset
- **Training Epochs**: 100
- **Image Size**: 224x224
- **Batch Size**: 32
- **Validation Accuracy**: 82.9%

## Integration Examples

### Web API Integration:
The classifier can be easily integrated into web applications using Flask or FastAPI.

### Desktop Application:
Use with tkinter or PyQt for desktop GUI applications.

### Batch Processing:
Process large image datasets for research or commercial applications.

## License

This model is for educational and research purposes. Please ensure you have appropriate permissions for any images you process.

## Support

For issues or questions, please check the troubleshooting section above or refer to the example scripts included in this package.
