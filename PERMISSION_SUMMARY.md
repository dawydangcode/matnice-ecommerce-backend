# 📋 Tóm Tắt Phân Quyền Hệ Thống - ĐÃ CẬP NHẬT

## 🔐 Các Loại Quyền Truy Cập

### 1. **@Public()** - Khách (Guest)

- Không cần đăng nhập
- Có thể xem thông tin cơ bản về sản phẩm, lens, màu sắc, độ dày kính
- Có thể lọc lens theo prescription

### 2. **@Roles(RoleType.User)** - Người dùng

- Phải đăng nhập với role "user"
- Có thể quản lý giỏ hàng và đơn hàng cá nhân
- Tất cả quyền của Guest

### 3. **@Roles(RoleType.Employee)** - Nhân viên

- Có quyền xem danh sách quản lý (admin view)
- Không thể tạo/sửa/xóa dữ liệu
- Tất cả quyền của User

### 4. **@Roles(RoleType.Admin)** - Quản trị viên

- Có quyền tạo, sửa, xóa tất cả dữ liệu
- Quản lý toàn bộ hệ thống
- Tất cả quyền của Employee

---

## 📊 Phân Quyền Chi Tiết - TẤT CẢ MODULE (ĐÃ SỬA)

### 🛒 **Order Module** ⚠️ **MỚI SỬA**

| Endpoint              | Method | Guest | User | Employee | Admin | Mô tả               |
| --------------------- | ------ | ----- | ---- | -------- | ----- | ------------------- |
| `/orders`             | POST   | ❌    | ✅   | ✅       | ✅    | Tạo đơn hàng        |
| `/orders`             | GET    | ❌    | ❌   | ❌       | ✅    | Xem tất cả đơn hàng |
| `/orders/detailed`    | GET    | ❌    | ❌   | ❌       | ✅    | Đơn hàng chi tiết   |
| `/orders/my-orders`   | GET    | ❌    | ✅   | ✅       | ✅    | Đơn hàng của tôi    |
| `/orders/:id`         | GET    | ❌    | ✅   | ✅       | ✅    | Chi tiết đơn hàng   |
| `/orders/:id/details` | GET    | ❌    | ✅   | ✅       | ✅    | Thông tin đầy đủ    |
| `/orders/:id`         | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật đơn hàng   |
| `/orders/:id/status`  | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật trạng thái |
| `/orders/export/*`    | GET    | ❌    | ❌   | ❌       | ✅    | Xuất báo cáo        |

### 💳 **Payment Module** ⚠️ **MỚI SỬA**

| Endpoint               | Method | Guest | User | Employee | Admin | Mô tả                   |
| ---------------------- | ------ | ----- | ---- | -------- | ----- | ----------------------- |
| `/payments`            | POST   | ❌    | ✅   | ✅       | ✅    | Tạo thanh toán          |
| `/payments`            | GET    | ❌    | ❌   | ❌       | ✅    | Xem tất cả thanh toán   |
| `/payments/order/:id`  | GET    | ❌    | ✅   | ✅       | ✅    | Thanh toán của đơn hàng |
| `/payments/:id`        | GET    | ❌    | ✅   | ✅       | ✅    | Chi tiết thanh toán     |
| `/payments/:id`        | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật thanh toán     |
| `/payments/:id/status` | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật trạng thái     |

### 💰 **PayOS Module** ⚠️ **MỚI SỬA**

| Endpoint                              | Method | Guest | User | Employee | Admin | Mô tả                 |
| ------------------------------------- | ------ | ----- | ---- | -------- | ----- | --------------------- |
| `/payos/create-payment-link`          | POST   | ❌    | ✅   | ✅       | ✅    | Tạo link thanh toán   |
| `/payos/create-embedded-payment-link` | POST   | ❌    | ✅   | ✅       | ✅    | Tạo embedded payment  |
| `/payos/payment-info/:id`             | GET    | ❌    | ✅   | ✅       | ✅    | Thông tin thanh toán  |
| `/payos/cancel-payment/:id`           | POST   | ❌    | ✅   | ✅       | ✅    | Hủy thanh toán        |
| `/payos/webhook`                      | POST   | ✅    | ✅   | ✅       | ✅    | Webhook PayOS         |
| `/payos/create-order-from-payment`    | POST   | ❌    | ✅   | ✅       | ✅    | Tạo đơn từ thanh toán |

### 📦 **Order Item Module** ⚠️ **MỚI SỬA**

| Endpoint                 | Method | Guest | User | Employee | Admin | Mô tả              |
| ------------------------ | ------ | ----- | ---- | -------- | ----- | ------------------ |
| `/order-items`           | POST   | ❌    | ✅   | ✅       | ✅    | Tạo order item     |
| `/order-items`           | GET    | ❌    | ❌   | ❌       | ✅    | Tất cả order items |
| `/order-items/order/:id` | GET    | ❌    | ✅   | ✅       | ✅    | Items của đơn hàng |
| `/order-items/:id`       | GET    | ❌    | ✅   | ✅       | ✅    | Chi tiết item      |
| `/order-items/:id`       | PUT    | ❌    | ✅   | ✅       | ✅    | Cập nhật item      |
| `/order-items/:id`       | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa item           |

### 👓 **Order Lens Detail Module** ⚠️ **MỚI SỬA**

| Endpoint                                | Method | Guest | User | Employee | Admin | Mô tả                |
| --------------------------------------- | ------ | ----- | ---- | -------- | ----- | -------------------- |
| `/order-lens-details`                   | POST   | ❌    | ❌   | ✅       | ✅    | Tạo lens detail      |
| `/order-lens-details`                   | GET    | ❌    | ❌   | ✅       | ✅    | Tất cả lens details  |
| `/order-lens-details/by-order-item/:id` | GET    | ❌    | ✅   | ✅       | ✅    | Lens detail của item |
| `/order-lens-details/:id`               | GET    | ❌    | ✅   | ✅       | ✅    | Chi tiết lens detail |
| `/order-lens-details/:id`               | PATCH  | ❌    | ❌   | ✅       | ✅    | Cập nhật             |
| `/order-lens-details/:id`               | DELETE | ❌    | ❌   | ✅       | ✅    | Xóa                  |

---

## 📊 Phân Quyền Chi Tiết - LENS MODULE (ĐÃ SỬA)

### 🔍 **Lens Controller**

| Endpoint                       | Method | Guest | User | Employee | Admin | Mô tả                       |
| ------------------------------ | ------ | ----- | ---- | -------- | ----- | --------------------------- |
| `/lens/cards`                  | GET    | ✅    | ✅   | ✅       | ✅    | Xem danh sách lens (public) |
| `/lens/filter-by-prescription` | GET    | ✅    | ✅   | ✅       | ✅    | Lọc lens theo prescription  |
| `/lens/:id/detail`             | GET    | ✅    | ✅   | ✅       | ✅    | Xem chi tiết lens           |
| `/lens/:id/full-details`       | GET    | ✅    | ✅   | ✅       | ✅    | Xem thông tin đầy đủ        |
| `/lens/list`                   | GET    | ❌    | ❌   | ✅       | ✅    | Danh sách quản lý           |
| `/lens/create`                 | POST   | ❌    | ❌   | ❌       | ✅    | Tạo lens mới                |
| `/lens/:id/update`             | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật lens               |
| `/lens/:id/delete`             | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa lens                    |

### 🎯 **Lens Variant Controller** ⚠️ **ĐÃ SỬA**

| Endpoint                     | Method | Guest | User | Employee | Admin | Mô tả                 |
| ---------------------------- | ------ | ----- | ---- | -------- | ----- | --------------------- |
| `/lens-variants/by-lens/:id` | GET    | ✅    | ✅   | ✅       | ✅    | Xem variants của lens |
| `/lens-variant/:id`          | GET    | ✅    | ✅   | ✅       | ✅    | Chi tiết variant      |
| `/lens-variants/list`        | GET    | ❌    | ❌   | ✅       | ✅    | Danh sách quản lý     |
| `/lens-variant/create`       | POST   | ❌    | ❌   | ❌       | ✅    | Tạo variant           |
| `/lens-variant/:id/update`   | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật variant      |
| `/lens-variant/:id/delete`   | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa variant           |

### 🎨 **Lens Tint Color Controller** ⚠️ **ĐÃ SỬA**

| Endpoint                        | Method | Guest | User | Employee | Admin | Mô tả             |
| ------------------------------- | ------ | ----- | ---- | -------- | ----- | ----------------- |
| `/lens-tint-colors/list`        | GET    | ✅    | ✅   | ✅       | ✅    | Xem danh sách màu |
| `/lens-tint-color/:id`          | GET    | ✅    | ✅   | ✅       | ✅    | Chi tiết màu      |
| `/lens-tint-color`              | POST   | ❌    | ❌   | ❌       | ✅    | Tạo màu mới       |
| `/lens-tint-color/:id`          | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật màu      |
| `/lens-tint-color/:id`          | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa màu           |
| `/lens-tint-color/upload-image` | POST   | ❌    | ❌   | ❌       | ✅    | Upload ảnh màu    |

### 📏 **Lens Thickness Controller** ⚠️ **ĐÃ SỬA**

| Endpoint               | Method | Guest | User | Employee | Admin | Mô tả           |
| ---------------------- | ------ | ----- | ---- | -------- | ----- | --------------- |
| `/lens-thickness/list` | GET    | ✅    | ✅   | ✅       | ✅    | Xem độ dày kính |
| `/lens-thickness/:id`  | GET    | ✅    | ✅   | ✅       | ✅    | Chi tiết độ dày |
| `/lens-thickness`      | POST   | ❌    | ❌   | ❌       | ✅    | Tạo độ dày mới  |
| `/lens-thickness/:id`  | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật độ dày |
| `/lens-thickness/:id`  | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa độ dày      |

### 📐 **Lens Refraction Range Controller** ⚠️ **ĐÃ SỬA**

| Endpoint                      | Method | Guest | User | Employee | Admin | Mô tả             |
| ----------------------------- | ------ | ----- | ---- | -------- | ----- | ----------------- |
| `/lens-refraction-range/list` | GET    | ✅    | ✅   | ✅       | ✅    | Xem range khúc xạ |
| `/lens-refraction-range/:id`  | GET    | ✅    | ✅   | ✅       | ✅    | Chi tiết range    |
| `/lens-refraction-range`      | POST   | ❌    | ❌   | ❌       | ✅    | Tạo range mới     |
| `/lens-refraction-range/:id`  | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật range    |
| `/lens-refraction-range/:id`  | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa range         |

### 🎨 **Lens Variant Coating Controller** ⚠️ **ĐÃ SỬA**

| Endpoint                     | Method | Guest | User | Employee | Admin | Mô tả                   |
| ---------------------------- | ------ | ----- | ---- | -------- | ----- | ----------------------- |
| `/lens-variant/:id/coatings` | GET    | ✅    | ✅   | ✅       | ✅    | Xem coating của variant |
| `/lens-coating/:id/variants` | GET    | ✅    | ✅   | ✅       | ✅    | Xem variant của coating |
| `/lens-variant-coating/:id`  | GET    | ✅    | ✅   | ✅       | ✅    | Chi tiết coating        |
| `/lens-variant-coating/list` | GET    | ❌    | ❌   | ✅       | ✅    | Danh sách quản lý       |
| `/lens-variant-coating`      | POST   | ❌    | ❌   | ❌       | ✅    | Tạo coating             |
| `/lens-variant-coating/:id`  | PUT    | ❌    | ❌   | ❌       | ✅    | Cập nhật coating        |
| `/lens-variant-coating/:id`  | DELETE | ❌    | ❌   | ❌       | ✅    | Xóa coating             |

## Phân quyền theo Controller:

### Brand Controller

- `GET /brand/list` → **Admin + Employee** (danh sách quản lý)
- `GET /brand/:id/detail` → **Public** (chi tiết cho frontend)
- `POST /brand/create` → **Admin only**
- `PUT /brand/:id/update` → **Admin only**
- `DELETE /brand/:id/delete` → **Admin only**
- `GET /brand/getBrandsForFilter` → **Public** (filter dropdown)

### Product Controller

- `GET /products/list` → **Admin + Employee** (danh sách quản lý)
- `GET /products/cards` → **Public** (hiển thị sản phẩm)
- `GET /product/:id/detail` → **Public** (chi tiết sản phẩm)
- `GET /product/:id/with-categories` → **Public** (thông tin category)
- `POST /product/create` → **Admin only**
- `PUT /product/:id/update` → **Admin only**
- `DELETE /product/:id/delete` → **Admin only**

### Category Controller

- `GET /category/list` → **Admin + Employee** (danh sách quản lý)
- `GET /category/:id/details` → **Public** (chi tiết cho frontend)
- `POST /category/create` → **Admin only**
- `PUT /category/:id/update` → **Admin only**
- `DELETE /category/:id/delete` → **Admin only**

### Cart Controller

- `GET /my-cart/*` → **User + Admin + Employee** (giỏ hàng cá nhân)
- `POST /create` → **User + Admin + Employee** (tạo giỏ hàng)
- `GET /:cartId/*` → **Admin + Employee** (xem giỏ hàng bất kỳ)
- `GET /debug/*` → **Admin only** (debug)

### Cart Frame Controller

- `GET /list` → **User + Admin + Employee** (xem frame trong giỏ)
- `POST /create` → **User + Admin + Employee** (thêm frame)
- `PUT /:id/update` → **User + Admin + Employee** (cập nhật frame)
- `DELETE /:id/delete` → **User + Admin + Employee** (xóa frame)

### AI Service Controller

- `POST /analyze-face` → **Public** (phân tích khuôn mặt)
- `GET /analysis/:id/result` → **Public** (kết quả phân tích)
- `GET /analysis/history` → **Authenticated** (lịch sử phân tích)
- `POST /analysis/cleanup` → **Admin only** (dọn dẹp dữ liệu)

### Brand Lens Controller

- `GET /brand-lens/list` → **Admin only**
- `GET /brand-lens/:id/detail` → **Admin only**
- `POST /brand-lens/create` → **Admin only**
- `PUT /brand-lens/:id/update` → **Admin only**
- `DELETE /brand-lens/:id/delete` → **Admin only**
- `GET /brand-lens/getBrandsForFilter` → **Public**
- `GET /brand-lens` → **Public** (navigation dropdown)

---

## 🧪 Quick Test Commands

### Test Guest Access (Không đăng nhập)

```bash
# Những endpoint này PHẢI hoạt động
curl "http://localhost:3000/api/v1/lens/cards"
curl "http://localhost:3000/api/v1/lens-tint-colors/list"
curl "http://localhost:3000/api/v1/lens-thickness/list"
curl "http://localhost:3000/api/v1/products/cards"

# Những endpoint này PHẢI trả về 401 Unauthorized
curl "http://localhost:3000/api/v1/carts/my-cart"
curl "http://localhost:3000/api/v1/orders/my-orders"
curl -X POST "http://localhost:3000/api/v1/lens/create"
```

### Test User Access (Đã đăng nhập)

```bash
# Login trước để lấy token
USER_TOKEN="your_user_token_here"

# User có thể làm được
curl -H "Authorization: Bearer $USER_TOKEN" "http://localhost:3000/api/v1/carts/my-cart"
curl -H "Authorization: Bearer $USER_TOKEN" "http://localhost:3000/api/v1/orders/my-orders"
curl -X POST -H "Authorization: Bearer $USER_TOKEN" "http://localhost:3000/api/v1/orders"

# User KHÔNG thể làm (phải trả về 403 Forbidden)
curl -X POST -H "Authorization: Bearer $USER_TOKEN" "http://localhost:3000/api/v1/lens/create"
curl -H "Authorization: Bearer $USER_TOKEN" "http://localhost:3000/api/v1/orders" # tất cả đơn hàng
```

### Test Admin Access

```bash
ADMIN_TOKEN="your_admin_token_here"

# Admin có thể làm tất cả
curl -H "Authorization: Bearer $ADMIN_TOKEN" "http://localhost:3000/api/v1/orders"
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" "http://localhost:3000/api/v1/lens/create"
curl -H "Authorization: Bearer $ADMIN_TOKEN" "http://localhost:3000/api/v1/payments"
```

---

## ✅ Status Code Mong Đợi

- **200/201**: Thành công
- **401 Unauthorized**: Chưa đăng nhập (cần token)
- **403 Forbidden**: Đã đăng nhập nhưng không đủ quyền
- **404 Not Found**: Endpoint không tồn tại

---

## 🎯 Kết Luận

**✅ ĐÃ HOÀN THÀNH PHÂN QUYỀN:**

1. **Guest** - Xem được thông tin sản phẩm, lens, lọc prescription
2. **User** - Quản lý giỏ hàng, đặt hàng, xem đơn hàng của mình, thanh toán
3. **Employee** - Xem danh sách quản lý, báo cáo
4. **Admin** - Toàn quyền tạo/sửa/xóa, quản lý hệ thống

**🔧 CÁCH KIỂM TRA:**

- Chạy server
- Test endpoints với/không token
- Kiểm tra status code trả về
- Đảm bảo guest không truy cập được protected endpoints
- Đảm bảo user không thể làm admin functions

### Category Lens Controller

- `GET /category-lens/list` → **Admin only**
- `GET /category-lens/:id/details` → **Admin only**
- `POST /category-lens/create` → **Admin only**
- `PUT /category-lens/:id/update` → **Admin only**
- `DELETE /category-lens/:id/delete` → **Admin only**
- `GET /lens-categories` → **Public** (navigation dropdown)

## Các endpoint cần bổ sung phân quyền:

### 1. Còn thiếu trong Product Controller:

```typescript
@Put('product/:productId/update')
@Roles(RoleType.Admin)

@Delete('product/:productId/delete')
@Roles(RoleType.Admin)
```

### 2. Còn thiếu trong Cart Frame Controller:

```typescript
@Get(':cartFrameId/detail')
@Roles(RoleType.User, RoleType.Admin, RoleType.Employee)

@Put(':cartFrameId/update')
@Roles(RoleType.User, RoleType.Admin, RoleType.Employee)

@Delete(':cartFrameId/delete')
@Roles(RoleType.User, RoleType.Admin, RoleType.Employee)

// Các endpoint summary và count
@Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
```

### 3. Cart Item Controller - cần cập nhật tương tự Cart Frame

### 4. Cart Lens Detail Controller - cần cập nhật tương tự

### 5. Cart Combined Controller - cần cập nhật

## Cách test:

1. **Test Guest**: Không token → chỉ truy cập được Public endpoints
2. **Test User**: Token user → truy cập được User + Public endpoints
3. **Test Admin**: Token admin → truy cập được tất cả endpoints
4. **Test Employee**: Token employee → truy cập được Employee + User + Public

## Lưu ý:

- Endpoints có `@Public()` → bypass authentication hoàn toàn
- Endpoints có `@Roles()` rỗng → yêu cầu authentication nhưng không phân quyền
- Endpoints có `@Roles(RoleType.X, RoleType.Y)` → chỉ role X hoặc Y mới truy cập được
- Controller class decorator `@Roles()` sẽ áp dụng cho tất cả endpoints trong controller (nhưng có thể override ở method level)
