#!/usr/bin/env python3
"""
Script kết hợp MediaPipe Face Detection + YOLO Skin Color Analysis
"""

import cv2
import mediapipe as mp
from ultralytics import YOLO
import numpy as np
import os
import argparse
from pathlib import Path

class FaceSkinAnalyzer:
    def __init__(self, skin_model_path="runs/detect/train20/weights/best.pt"):
        """
        Khởi tạo MediaPipe Face Detection và YOLO Skin Model
        Args:
            skin_model_path: Đường dẫn đến model YOLO skin detection đã train
        """
        # Khởi tạo MediaPipe Face Detection
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_drawing = mp.solutions.drawing_utils
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=0,  # 0 cho ảnh gần, 1 cho ảnh xa
            min_detection_confidence=0.5
        )
        
        # Load YOLO skin detection model đã train
        self.skin_model = YOLO(skin_model_path)
        
        # Màu sắc hiển thị cho từng loại skin tone
        self.skin_colors = {
            0: (0, 100, 255),     # Dark - Cam đỏ
            1: (0, 255, 255),     # Light - Vàng
            2: (255, 150, 0)      # Medium - Xanh dương
        }
        
        print(f"✅ MediaPipe Face Detection initialized")
        print(f"✅ YOLO Skin Model loaded: {skin_model_path}")
        print(f"✅ Skin classes: {self.skin_model.names}")
    
    def detect_faces(self, image):
        """
        Phát hiện khuôn mặt bằng MediaPipe
        Returns: List of face bounding boxes
        """
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_image)
        
        faces = []
        if results.detections:
            h, w, _ = image.shape
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                
                # Chuyển đổi tọa độ tương đối thành tọa độ pixel
                x1 = int(bbox.xmin * w)
                y1 = int(bbox.ymin * h)
                x2 = int((bbox.xmin + bbox.width) * w)
                y2 = int((bbox.ymin + bbox.height) * h)
                
                # Mở rộng vùng face một chút để capture skin tốt hơn
                padding = 20
                x1 = max(0, x1 - padding)
                y1 = max(0, y1 - padding)
                x2 = min(w, x2 + padding)
                y2 = min(h, y2 + padding)
                
                confidence = detection.score[0]
                
                faces.append({
                    'bbox': (x1, y1, x2, y2),
                    'confidence': confidence
                })
        
        return faces
    
    def analyze_skin_in_face(self, image, face_bbox):
        """
        Phân tích màu da trong vùng khuôn mặt
        """
        x1, y1, x2, y2 = face_bbox['bbox']
        
        # Crop vùng face
        face_crop = image[y1:y2, x1:x2]
        
        if face_crop.size == 0:
            return []
        
        # Sử dụng YOLO model để detect skin trong vùng face
        skin_results = self.skin_model(face_crop)  # Confidence threshold 60%
        
        skin_detections = []
        for result in skin_results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Chuyển đổi tọa độ về ảnh gốc
                    sx1, sy1, sx2, sy2 = box.xyxy[0].cpu().numpy().astype(int)
                    sx1 += x1
                    sy1 += y1
                    sx2 += x1
                    sy2 += y1
                    
                    conf = float(box.conf[0].cpu().numpy())
                    cls = int(box.cls[0].cpu().numpy())
                    skin_type = self.skin_model.names[cls]
                    
                    skin_detections.append({
                        'bbox': (sx1, sy1, sx2, sy2),
                        'confidence': conf,
                        'skin_type': skin_type,
                        'class_id': cls
                    })
        
        return skin_detections
    
    def get_dominant_skin_type(self, skin_detections):
        """
        Xác định loại da chủ đạo dựa trên confidence và kích thước bbox
        """
        if not skin_detections:
            return None
        
        # Tính toán score cho mỗi skin type (confidence * area)
        skin_scores = {}
        for skin in skin_detections:
            skin_type = skin['skin_type']
            conf = skin['confidence']
            sx1, sy1, sx2, sy2 = skin['bbox']
            area = (sx2 - sx1) * (sy2 - sy1)
            score = conf * area
            
            if skin_type not in skin_scores:
                skin_scores[skin_type] = 0
            skin_scores[skin_type] += score
        
        # Trả về skin type có score cao nhất
        dominant_type = max(skin_scores, key=skin_scores.get)
        return dominant_type
    
    def process_image(self, image_path, output_dir="face_skin_analysis"):
        """
        Xử lý một ảnh: detect face -> analyze skin
        """
        # Đọc ảnh
        image = cv2.imread(image_path)
        if image is None:
            print(f"❌ Không thể đọc ảnh: {image_path}")
            return None
        
        original_image = image.copy()
        filename = Path(image_path).stem
        
        print(f"\n📷 Đang xử lý: {filename}")
        
        # Bước 1: Detect faces
        faces = self.detect_faces(image)
        print(f"👤 Phát hiện {len(faces)} khuôn mặt")
        
        if len(faces) == 0:
            print("❌ Không phát hiện khuôn mặt nào!")
            return None
        
        all_skin_detections = []
        face_results = []
        
        # Bước 2: Analyze skin cho từng face
        for i, face in enumerate(faces):
            x1, y1, x2, y2 = face['bbox']
            face_conf = face['confidence']
            
            print(f"  Face {i+1}: confidence {face_conf:.3f}")
            
            # Vẽ face bounding box (xanh lá)
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 3)
            cv2.putText(image, f'Face {i+1}: {face_conf:.2f}', (x1, y1-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Analyze skin trong face này
            skin_detections = self.analyze_skin_in_face(original_image, face)
            all_skin_detections.extend(skin_detections)
            
            print(f"    🎨 Phát hiện {len(skin_detections)} vùng da")
            
            # Thống kê skin types
            skin_counts = {}
            for skin in skin_detections:
                skin_type = skin['skin_type']
                skin_counts[skin_type] = skin_counts.get(skin_type, 0) + 1
                
                # Vẽ skin detection
                sx1, sy1, sx2, sy2 = skin['bbox']
                conf = skin['confidence']
                cls_id = skin['class_id']
                color = self.skin_colors.get(cls_id, (255, 255, 255))
                
                cv2.rectangle(image, (sx1, sy1), (sx2, sy2), color, 2)
                cv2.putText(image, f'{skin_type} {conf:.2f}', (sx1, sy1-10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Xác định skin type chủ đạo cho face này
            dominant_skin = self.get_dominant_skin_type(skin_detections)
            
            face_result = {
                'face_id': i + 1,
                'bbox': (x1, y1, x2, y2),
                'confidence': face_conf,
                'skin_detections': skin_detections,
                'skin_counts': skin_counts,
                'dominant_skin_type': dominant_skin
            }
            face_results.append(face_result)
            
            if skin_counts:
                print(f"    📊 Phân bố da: {skin_counts}")
            if dominant_skin:
                print(f"    🏆 Loại da chủ đạo: {dominant_skin}")
        
        # Lưu kết quả
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{filename}_face_skin_analysis.jpg")
        cv2.imwrite(output_path, image)
        
        print(f"💾 Lưu kết quả: {output_path}")
        
        return {
            'filename': filename,
            'image_path': image_path,
            'output_path': output_path,
            'faces': face_results,
            'total_skin_detections': len(all_skin_detections)
        }
    
    def process_directory(self, input_dir, output_dir="face_skin_analysis"):
        """
        Xử lý tất cả ảnh trong thư mục
        """
        # Tìm tất cả file ảnh
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
        image_paths = []
        
        for ext in image_extensions:
            image_paths.extend(Path(input_dir).glob(f'*{ext}'))
            image_paths.extend(Path(input_dir).glob(f'*{ext.upper()}'))
        
        if not image_paths:
            print(f"❌ Không tìm thấy ảnh nào trong {input_dir}")
            return []
        
        print(f"📁 Tìm thấy {len(image_paths)} ảnh để xử lý")
        
        results = []
        total_faces = 0
        total_skin_detections = 0
        skin_type_global_stats = {}
        
        for image_path in image_paths:
            result = self.process_image(str(image_path), output_dir)
            if result:
                results.append(result)
                total_faces += len(result['faces'])
                total_skin_detections += result['total_skin_detections']
                
                # Thống kê global skin types
                for face in result['faces']:
                    if face['dominant_skin_type']:
                        skin_type = face['dominant_skin_type']
                        skin_type_global_stats[skin_type] = skin_type_global_stats.get(skin_type, 0) + 1
        
        # In thống kê tổng quan
        print(f"\n{'='*60}")
        print(f"📊 THỐNG KÊ TỔNG QUAN")
        print(f"{'='*60}")
        print(f"✅ Đã xử lý: {len(results)} ảnh")
        print(f"👤 Tổng số khuôn mặt: {total_faces}")
        print(f"🎨 Tổng số vùng da: {total_skin_detections}")
        print(f"📈 Trung bình: {total_faces/len(results):.1f} mặt/ảnh, {total_skin_detections/len(results):.1f} vùng da/ảnh")
        
        if skin_type_global_stats:
            print(f"\n🏆 PHÂN BỐ LOẠI DA CHỦ ĐẠO:")
            total_dominant = sum(skin_type_global_stats.values())
            for skin_type, count in skin_type_global_stats.items():
                percentage = (count / total_dominant) * 100
                print(f"   {skin_type}: {count} khuôn mặt ({percentage:.1f}%)")
        
        print(f"\n💾 Kết quả được lưu tại: {output_dir}/")
        
        return results

def main():
    parser = argparse.ArgumentParser(description='MediaPipe Face Detection + YOLO Skin Analysis')
    parser.add_argument('--source', type=str, required=True,
                       help='Đường dẫn ảnh hoặc thư mục ảnh')
    parser.add_argument('--model', type=str, default='runs/detect/train18/weights/best.pt',
                       help='Đường dẫn model YOLO skin detection')
    parser.add_argument('--output', type=str, default='face_skin_analysis',
                       help='Thư mục lưu kết quả')
    
    args = parser.parse_args()
    
    # Khởi tạo analyzer
    print("🚀 Khởi tạo Face + Skin Analyzer...")
    analyzer = FaceSkinAnalyzer(skin_model_path=args.model)
    
    # Xử lý input
    if os.path.isfile(args.source):
        # Xử lý ảnh đơn
        print(f"\n📷 Xử lý ảnh đơn: {args.source}")
        result = analyzer.process_image(args.source, args.output)
        if result:
            print(f"\n✅ Hoàn thành! Kết quả được lưu tại: {result['output_path']}")
            
            # Hiển thị kết quả chi tiết
            for face in result['faces']:
                print(f"\nFace {face['face_id']}:")
                print(f"  - Dominant skin type: {face['dominant_skin_type']}")
                print(f"  - Skin distribution: {face['skin_counts']}")
        
    elif os.path.isdir(args.source):
        # Xử lý thư mục
        print(f"\n📁 Xử lý thư mục: {args.source}")
        results = analyzer.process_directory(args.source, args.output)
        print(f"\n🎉 Hoàn thành xử lý {len(results)} ảnh!")
        
    else:
        print(f"❌ Lỗi: {args.source} không phải file hoặc thư mục hợp lệ")

if __name__ == "__main__":
    main()
