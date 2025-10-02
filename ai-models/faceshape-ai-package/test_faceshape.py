from ultralytics import YOLO
import cv2
import os

# Load trained face shape classification model
# Using the latest trained model from train4
model = YOLO("runs/classify/train4/weights/best.pt")  

# Thư mục chứa ảnh test
test_folder = "/home/ubuntu/yolo/my_test_images"
output_folder = "faceshape_results"

# Tạo thư mục output nếu chưa có
os.makedirs(output_folder, exist_ok=True)

# Kiểm tra xem có ảnh nào trong thư mục test không
image_files = [f for f in os.listdir(test_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

if not image_files:
    print(f"Không tìm thấy ảnh nào trong thư mục '{test_folder}'")
    print("Vui lòng copy ảnh cần test vào thư mục này")
else:
    print(f"Tìm thấy {len(image_files)} ảnh để test")
    
    # Define colors for different face shapes
    shape_colors = {
        'heart': (0, 255, 255),      # Yellow
        'oblong': (255, 0, 255),     # Magenta  
        'oval': (0, 255, 0),         # Green
        'round': (255, 0, 0),        # Blue
        'square': (0, 0, 255)        # Red
    }
    
    for filename in image_files:
        print(f"\nĐang xử lý: {filename}")
        
        image_path = os.path.join(test_folder, filename)
        
        # Predict face shape
        results = model(image_path)
        
        # Lấy kết quả prediction
        for result in results:
            probs = result.probs
            if probs is not None:
                # Lấy class có confidence cao nhất
                top_class_idx = probs.top1
                top_confidence = probs.top1conf.item()
                class_name = model.names[top_class_idx]
                
                print(f"  Dáng khuôn mặt: {class_name}")
                print(f"  Confidence: {top_confidence:.3f}")
                
                # Vẽ kết quả lên ảnh
                img = cv2.imread(image_path)
                
                # Lấy màu cho face shape
                color = shape_colors.get(class_name, (255, 255, 255))  # White if shape not found
                
                # Vẽ text với màu tương ứng face shape
                cv2.putText(img, f"Face Shape: {class_name}", 
                           (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                cv2.putText(img, f"Confidence: {top_confidence:.2f}", 
                           (30, 90), cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 2)
                
                # Lưu kết quả
                output_path = os.path.join(output_folder, f"{filename}_faceshape.jpg")
                cv2.imwrite(output_path, img)
                print(f"  Kết quả lưu tại: {output_path}")
                
                # In tất cả các class probability
                print("  Tất cả probabilities:")
                for i, prob in enumerate(probs.data):
                    print(f"    {model.names[i]}: {prob.item():.3f}")
            else:
                print("  Không thể phân loại")
    
    print(f"\nHoàn thành! Kết quả lưu trong '{output_folder}'")
    print("\nCác dáng khuôn mặt có thể phát hiện:")
    for shape, color in shape_colors.items():
        print(f"  - {shape}")
