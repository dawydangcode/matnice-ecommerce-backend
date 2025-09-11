# Gender AI Classification Package

This package contains a trained YOLO11n-cls model for gender classification (male/female).

## Model Information
- **Model**: YOLO11n-cls (Classification)
- **Classes**: male, female  
- **Accuracy**: 97.8% on validation set
- **Model Size**: ~3.2MB
- **Input**: Images (224x224 recommended)

## Requirements
```
ultralytics>=8.0.0
opencv-python>=4.5.0
numpy>=1.21.0
pillow>=8.0.0
torch>=1.11.0
torchvision>=0.12.0
```

## Installation

1. **Extract package:**
```bash
tar -xzf gender-ai-package.tar.gz
cd gender-ai-package
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

## Usage

### Command Line

**Single image:**
```bash
python gender_classifier.py --source path/to/image.jpg
```

**Directory of images:**
```bash
python gender_classifier.py --source path/to/images_folder/
```

**Custom model path:**
```bash
python gender_classifier.py --source image.jpg --model custom_model.pt
```

**Custom output directory:**
```bash
python gender_classifier.py --source images/ --output custom_results/
```

### Python Code

```python
from gender_classifier import GenderClassifier

# Initialize classifier
classifier = GenderClassifier(model_path="gender_best.pt")

# Predict single image
result = classifier.predict_gender("image.jpg")
print(f"Gender: {result['predicted_gender']}")
print(f"Confidence: {result['confidence']:.3f}")

# Process directory with visualization
results = classifier.process_directory("images_folder/", "results/")
```

## API Response Format

```json
{
  "success": true,
  "predicted_gender": "female",
  "confidence": 0.923,
  "all_probabilities": {
    "female": 0.923,
    "male": 0.077
  }
}
```

## Output

- **Visualized images** with gender labels and confidence scores
- **Console output** with detailed statistics
- **Summary statistics** including gender distribution

## Examples

The `examples/` folder contains sample images and usage scripts.

## Integration

### NestJS Integration
```typescript
// Use child_process to call the Python script
import { spawn } from 'child_process';

const result = spawn('python3', ['gender_classifier.py', '--source', imagePath]);
```

### Flask API
```python
from flask import Flask, request, jsonify
from gender_classifier import GenderClassifier

app = Flask(__name__)
classifier = GenderClassifier()

@app.route('/classify', methods=['POST'])
def classify_gender():
    # Handle file upload and classification
    result = classifier.predict_gender(image_path)
    return jsonify(result)
```

## Model Details

- **Training Dataset**: 12,633 images (male/female)
- **Validation Dataset**: 1,197 images  
- **Test Dataset**: 592 images
- **Training Epochs**: 100 (early stopping at epoch 89)
- **Image Size**: 224x224 pixels
- **Batch Size**: 32

## Performance Metrics

- **Top-1 Accuracy**: 97.8%
- **Inference Speed**: ~0.3ms per image
- **Model Size**: 3.2 GFLOPS

## Troubleshooting

**Common Issues:**

1. **ModuleNotFoundError**: Install requirements with `pip install -r requirements.txt`
2. **CUDA errors**: Install CPU-only PyTorch if no GPU available
3. **Image format errors**: Ensure images are in common formats (jpg, png, etc.)

## License

This model is trained for educational/research purposes.

## Support

For issues or questions, please check the documentation or contact support.
