CREATE TABLE `face_analysis` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `session_id` bigint,
  `user_id` bigint,
  `image_url` varchar(255),
  `image_s3_key` varchar(255),
  `detected_gender_type` varchar(255),
  `gender_confidence` double,
  `detected_skin_color_type` varchar(255),
  `skin_color_confidence` double,
  `analysis_status` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `user` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `role_id` bigint,
  `username` varchar(255),
  `password` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `role` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `user_detail` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint UNIQUE,
  `name` varchar(255),
  `dob` date,
  `gender` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `user_address` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `province` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `address_detail` varchar(255) NOT NULL,
  `is_default` boolean DEFAULT false,
  `notes` text DEFAULT null,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `session` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `type` varchar(255),
  `user_agent` varchar(255),
  `ip_address` varchar(255),
  `is_active` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `email_template` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `subject` varchar(255),
  `html` text,
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_name` varchar(255),
  `product_type` varchar(255),
  `brand_id` bigint,
  `gender` varchar(255),
  `price` double,
  `description` varchar(255),
  `is_new` boolean,
  `new_until` timestamp,
  `is_boutique` boolean,
  `is_sustainable` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_detail` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `bridge_width` double,
  `frame_width` double,
  `lens_height` double,
  `lens_width` double,
  `temple_length` double,
  `frame_material` varchar(255),
  `frame_shape` varchar(255),
  `frame_type` varchar(255),
  `bridge_design` varchar(255),
  `style` varchar(255),
  `spring_hinges` boolean,
  `weight` double,
  `multifocal` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_image` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `product_color_id` bigint,
  `image_url` varchar(255),
  `image_order` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `face_shape` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_face_shape` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `face_shape_id` bigint,
  `product_id` bigint,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `category` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `type` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `category_lens` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `type` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_category` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `category_id` bigint,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_category` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_id` bigint,
  `category_lens_id` bigint,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `brand` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `brand_lens` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `order` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `cart_id` bigint NOT NULL,
  `order_date` timestamp,
  `subtotal` double,
  `shipping_cost` double,
  `total_price` double,
  `payment_method` varchar(255),
  `payment_status` varchar(255),
  `tracking_number` varchar(50) DEFAULT null,
  `delivery_date` timestamp DEFAULT null,
  `full_name` varchar(255),
  `phone` varchar(255),
  `email` varchar(255),
  `province` varchar(255),
  `district` varchar(255),
  `ward` varchar(255),
  `address_detail` varchar(255),
  `notes` text,
  `status` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `order_item` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int DEFAULT 1,
  `frame_price` decimal(10,2) DEFAULT 0,
  `total_price` decimal(10,2) DEFAULT 0,
  `discount` decimal(10,2) DEFAULT 0,
  `selected_color_id` bigint,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `order_lens_detail` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_item_id` bigint NOT NULL,
  `lens_variant_id` bigint NOT NULL,
  `right_eye_sphere` decimal(4,2) NOT NULL,
  `right_eye_cylinder` decimal(4,2) DEFAULT null,
  `right_eye_axis` int DEFAULT null,
  `left_eye_sphere` decimal(4,2) NOT NULL,
  `left_eye_cylinder` decimal(4,2) DEFAULT null,
  `left_eye_axis` int DEFAULT null,
  `pd_left` decimal(4,1) DEFAULT null,
  `pd_right` decimal(4,1) DEFAULT null,
  `add_left` decimal(4,2) DEFAULT null,
  `add_right` decimal(4,2) DEFAULT null,
  `lens_price` decimal(10,2) NOT NULL,
  `selected_coating_ids` text DEFAULT null,
  `selected_tint_color_id` bigint,
  `prescription_notes` text DEFAULT null,
  `lens_notes` text DEFAULT null,
  `manufacturing_notes` text DEFAULT null,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `payment` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_id` bigint,
  `payment_method` varchar(255),
  `amount` decimal(10,2),
  `status` varchar(255),
  `transaction_id` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `review` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `user_id` bigint,
  `rating` int,
  `comment` text,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `cart` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `status` varchar(255) DEFAULT 'active',
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `cart_frame` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int DEFAULT 1,
  `frame_price` decimal(10,2) DEFAULT 0,
  `total_price` decimal(10,2) DEFAULT 0,
  `discount` decimal(10,2) DEFAULT 0,
  `selected_color_id` bigint,
  `added_at` timestamp,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `cart_lens_detail` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `cart_frame_id` bigint NOT NULL,
  `lens_variant_id` bigint NOT NULL,
  `right_eye_sphere` decimal(4,2) NOT NULL,
  `right_eye_cylinder` decimal(4,2) DEFAULT null,
  `right_eye_axis` int DEFAULT null,
  `left_eye_sphere` decimal(4,2) NOT NULL,
  `left_eye_cylinder` decimal(4,2) DEFAULT null,
  `left_eye_axis` int DEFAULT null,
  `pd_left` decimal(4,1) DEFAULT null,
  `pd_right` decimal(4,1) DEFAULT null,
  `add_left` decimal(4,2) DEFAULT null,
  `add_right` decimal(4,2) DEFAULT null,
  `lens_price` decimal(10,2) NOT NULL,
  `selected_coating_ids` text DEFAULT null,
  `selected_tint_color_id` bigint,
  `prescription_notes` text DEFAULT null,
  `lens_notes` text DEFAULT null,
  `manufacturing_notes` text DEFAULT null,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `brand_lens_id` bigint,
  `origin` varchar(255),
  `status` varchar(255),
  `lens_type` varchar(255),
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_variant` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_id` bigint,
  `lens_thickness_id` bigint,
  `design` varchar(255),
  `material` varchar(255),
  `price` decimal(10,2),
  `stock` int,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_coating` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_id` bigint,
  `name` varchar(255),
  `price` decimal(10),
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_variant_coating` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_variant_id` bigint,
  `lens_coating_id` bigint,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_refraction_range` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_variant_id` bigint,
  `refraction_type` varchar(255),
  `min_value` decimal(4,2),
  `max_value` decimal(4,2),
  `step_value` decimal(4,2),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_tint_color` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_variant_id` bigint,
  `name` varchar(255),
  `image_url` varchar(255),
  `color_code` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_thickness` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `index_value` double,
  `description` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `lens_image` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `lens_id` bigint,
  `image_url` varchar(255),
  `image_order` varchar(255),
  `is_thumbnail` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_thickness_compatibility` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `lens_thickness_id` bigint,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_color` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `product_variant_name` varchar(255),
  `product_number` number,
  `color_name` varchar(255),
  `stock` int,
  `is_thumbnail` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `product_3d_model` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint,
  `model_name` varchar(255),
  `model_file_path` varchar(255),
  `model_type` varchar(255),
  `mtl_file_path` varchar(255),
  `texture_base_path` varchar(255),
  `config_json` text,
  `is_active` boolean,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `model_3d_config` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `model_id` bigint,
  `offset_x` decimal(5,3),
  `offset_y` decimal(5,3),
  `position_offset_x` decimal(5,3),
  `position_offset_y` decimal(5,3),
  `position_offset_z` decimal(5,3),
  `initial_scale` decimal(5,3),
  `rotation_sensitivity` decimal(3,2),
  `yaw_limit` decimal(3,2),
  `pitch_limit` decimal(3,2),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `user_prescription` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `ight_eye_sphere` decimal(4,2) NOT NULL,
  `right_eye_cylinder` decimal(4,2) DEFAULT null,
  `right_eye_axis` int DEFAULT null,
  `left_eye_sphere` decimal(4,2) NOT NULL,
  `left_eye_cylinder` decimal(4,2) DEFAULT null,
  `left_eye_axis` int DEFAULT null,
  `pd_left` decimal(4,1) DEFAULT null,
  `pd_right` decimal(4,1) DEFAULT null,
  `add_left` decimal(4,2) DEFAULT null,
  `add_right` decimal(4,2) DEFAULT null,
  `prescription_notes` text DEFAULT null,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `color_skin_recommendation` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_color_id` bigint,
  `skin_color_type` varchar(255),
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

CREATE TABLE `wishlist_item` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `product_id` bigint DEFAULT null,
  `lens_id` bigint DEFAULT null,
  `selected_color_id` bigint DEFAULT null,
  `added_at` timestamp,
  `created_at` timestamp,
  `created_by` bigint,
  `updated_at` timestamp,
  `updated_by` bigint,
  `deleted_at` timestamp,
  `deleted_by` bigint
);

ALTER TABLE `user` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `session` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `order_item` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `order_item` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product` ADD FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`);

ALTER TABLE `product_detail` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `review` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `review` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `product_face_shape` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_face_shape` ADD FOREIGN KEY (`face_shape_id`) REFERENCES `face_shape` (`id`);

ALTER TABLE `product_image` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `user_detail` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `cart_frame` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_thickness_compatibility` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_thickness_compatibility` ADD FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`);

ALTER TABLE `product_color` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_image` ADD FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`);

ALTER TABLE `lens_variant` ADD FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`);

ALTER TABLE `lens_variant` ADD FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`);

ALTER TABLE `lens_variant_coating` ADD FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`);

ALTER TABLE `lens_variant_coating` ADD FOREIGN KEY (`lens_coating_id`) REFERENCES `lens_coating` (`id`);

ALTER TABLE `lens_refraction_range` ADD FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`);

ALTER TABLE `lens_tint_color` ADD FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`);

ALTER TABLE `order_lens_detail` ADD FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`);

ALTER TABLE `order_lens_detail` ADD FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`);

ALTER TABLE `cart_lens_detail` ADD FOREIGN KEY (`cart_frame_id`) REFERENCES `cart_frame` (`id`);

ALTER TABLE `cart_lens_detail` ADD FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`);

ALTER TABLE `face_analysis` ADD FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

ALTER TABLE `face_analysis` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `product` ADD FOREIGN KEY (`id`) REFERENCES `product_3d_model` (`product_id`);

ALTER TABLE `product_3d_model` ADD FOREIGN KEY (`id`) REFERENCES `model_3d_config` (`model_id`);

ALTER TABLE `lens_coating` ADD FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`);

ALTER TABLE `lens_image` ADD FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`);

ALTER TABLE `lens_category` ADD FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`);

ALTER TABLE `lens_category` ADD FOREIGN KEY (`category_lens_id`) REFERENCES `category_lens` (`id`);

ALTER TABLE `lens` ADD FOREIGN KEY (`brand_lens_id`) REFERENCES `brand_lens` (`id`);

ALTER TABLE `cart_frame` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

ALTER TABLE `cart_frame` ADD FOREIGN KEY (`selected_color_id`) REFERENCES `product_color` (`id`);

ALTER TABLE `cart_lens_detail` ADD FOREIGN KEY (`selected_tint_color_id`) REFERENCES `lens_tint_color` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

ALTER TABLE `order_item` ADD FOREIGN KEY (`selected_color_id`) REFERENCES `product_color` (`id`);

ALTER TABLE `order_lens_detail` ADD FOREIGN KEY (`selected_tint_color_id`) REFERENCES `lens_tint_color` (`id`);

ALTER TABLE `user_prescription` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `user_address` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `color_skin_recommendation` ADD FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`);

ALTER TABLE `wishlist_item` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `wishlist_item` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `wishlist_item` ADD FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`);

ALTER TABLE `wishlist_item` ADD FOREIGN KEY (`selected_color_id`) REFERENCES `product_color` (`id`);
