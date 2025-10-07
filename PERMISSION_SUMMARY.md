# Phân quyền Endpoint - Tổng kết

## Nguyên tắc phân quyền:

### 1. **GUEST (Public - không cần đăng nhập)**
- Xem sản phẩm, danh mục, thương hiệu
- Phân tích AI 
- Đăng ký, đăng nhập

### 2. **USER (Người dùng đã đăng nhập)**
- Tất cả quyền của Guest
- Quản lý giỏ hàng
- Tạo đơn hàng
- Xem lịch sử đơn hàng của mình

### 3. **EMPLOYEE (Nhân viên)**  
- Tất cả quyền của User
- Xem danh sách sản phẩm, danh mục (admin view)
- Xem báo cáo

### 4. **ADMIN (Quản trị viên)**
- Tất cả quyền
- Tạo/sửa/xóa sản phẩm, danh mục, thương hiệu
- Quản lý người dùng
- Xem tất cả đơn hàng

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
