# Hướng dẫn Test Phân quyền cho Project

## 1. Các loại User cần test:

### A. GUEST (Không đăng nhập):

- Không cần token
- Chỉ truy cập được các endpoint có `@Public()`

### B. USER (Đã đăng nhập):

- Cần token với role = 'user'
- Truy cập được endpoint của user và một số endpoint chung

### C. ADMIN (Quản trị viên):

- Cần token với role = 'admin'
- Truy cập được tất cả endpoint

## 2. Cách test với Postman/API Client:

### Bước 1: Tạo các loại tài khoản

```bash
# Tạo tài khoản USER
POST /api/v1/auth/register
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}

# Tạo tài khoản ADMIN (hoặc sử dụng tài khoản admin có sẵn)
```

### Bước 2: Đăng nhập để lấy token

```bash
# Đăng nhập USER
POST /api/v1/auth/login
{
  "username": "testuser",
  "password": "password123"
}
# Lưu access_token từ response

# Đăng nhập ADMIN
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "admin_password"
}
# Lưu access_token từ response
```

## 3. Test các endpoint:

### A. Test GUEST (không token):

```bash
GET /api/v1/test-permissions/guest/products
# Kết quả: 200 OK

GET /api/v1/test-permissions/user/profile
# Kết quả: 401 Unauthorized
```

### B. Test USER (với token user):

```bash
# Header: Authorization: Bearer <user_token>
GET /api/v1/test-permissions/user/profile
# Kết quả: 200 OK

GET /api/v1/test-permissions/authenticated/orders
# Kết quả: 200 OK

GET /api/v1/test-permissions/admin/products
# Kết quả: 403 Forbidden
```

### C. Test ADMIN (với token admin):

```bash
# Header: Authorization: Bearer <admin_token>
GET /api/v1/test-permissions/admin/products
# Kết quả: 200 OK

GET /api/v1/test-permissions/user/profile
# Kết quả: 403 Forbidden (vì admin không có role user)
```

## 4. Danh sách endpoint test:

### GUEST (Public - không cần token):

- GET `/api/v1/test-permissions/guest/products`
- GET `/api/v1/test-permissions/guest/categories`

### USER ONLY (cần token user):

- GET `/api/v1/test-permissions/user/profile`
- POST `/api/v1/test-permissions/user/cart`

### AUTHENTICATED (user, admin, employee):

- GET `/api/v1/test-permissions/authenticated/orders`
- PUT `/api/v1/test-permissions/authenticated/profile`

### ADMIN ONLY:

- POST `/api/v1/test-permissions/admin/products`
- DELETE `/api/v1/test-permissions/admin/products/1`

### STAFF (admin + employee):

- GET `/api/v1/test-permissions/staff/reports`
- PUT `/api/v1/test-permissions/staff/inventory`

### ALL ROLES:

- GET `/api/v1/test-permissions/public/announcements`

## 5. Kết quả mong đợi:

| Endpoint             | Guest | User | Admin | Employee |
| -------------------- | ----- | ---- | ----- | -------- |
| guest/\*             | ✅    | ✅   | ✅    | ✅       |
| user/\*              | ❌    | ✅   | ❌    | ❌       |
| authenticated/\*     | ❌    | ✅   | ✅    | ✅       |
| admin/\*             | ❌    | ❌   | ✅    | ❌       |
| staff/\*             | ❌    | ❌   | ✅    | ✅       |
| public/announcements | ✅    | ✅   | ✅    | ✅       |

## 6. Cách áp dụng cho controller thực tế:

### Ví dụ Product Controller:

```typescript
@Controller('api/v1/products')
export class ProductController {
  // GUEST có thể xem danh sách sản phẩm
  @Public()
  @Get('list')
  async getProducts() {}

  // USER đã đăng nhập có thể xem chi tiết và thêm vào giỏ hàng
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @Get(':id')
  async getProductDetail() {}

  // Chỉ ADMIN mới tạo/sửa/xóa sản phẩm
  @Roles(RoleType.Admin)
  @Post()
  async createProduct() {}

  @Roles(RoleType.Admin)
  @Put(':id')
  async updateProduct() {}

  @Roles(RoleType.Admin)
  @Delete(':id')
  async deleteProduct() {}
}
```

## 7. Lưu ý quan trọng:

1. **@Public()**: Bỏ qua authentication hoàn toàn
2. **@Roles()**: Rỗng = tất cả authenticated user
3. **@Roles(RoleType.User)**: Chỉ user role
4. **@Roles(RoleType.Admin, RoleType.User)**: Admin HOẶC User
5. **Không có decorator**: Mặc định cần authentication nhưng không phân quyền

## 8. Troubleshooting:

- **401 Unauthorized**: Không có token hoặc token không hợp lệ
- **403 Forbidden**: Có token nhưng không đủ quyền
- **500 Error**: Lỗi server, kiểm tra code

## 9. Chạy test:

```bash
# Start server
npm run start:dev

# Test với curl hoặc Postman
curl -X GET http://localhost:3000/api/v1/test-permissions/guest/products
```
