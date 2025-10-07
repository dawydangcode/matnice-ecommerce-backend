# 🔒 Hướng dẫn Kiểm tra Phân quyền Matnice E-commerce

## 📖 Tổng quan Hệ thống Phân quyền

Hệ thống sử dụng 4 loại quyền chính:

1. **🌍 GUEST** - Khách vãng lai (không đăng nhập)
2. **👤 USER** - Người dùng đã đăng nhập
3. **👥 EMPLOYEE** - Nhân viên
4. **👑 ADMIN** - Quản trị viên

## 🎯 Nguyên tắc Phân quyền

### Decorator `@Public()`

- Cho phép truy cập mà **không cần đăng nhập**
- Sử dụng cho: xem sản phẩm, danh mục, đăng ký/đăng nhập

### Decorator `@Roles(RoleType.X)`

- Yêu cầu **phải đăng nhập** và có role X
- Role cao hơn thường có thể truy cập endpoint của role thấp hơn

---

## 🧪 Cách Kiểm tra Phân quyền

### 1. Chuẩn bị Test Data

Trước tiên, tạo các tài khoản test:

```bash
# Tạo test users (chạy một lần)
./create-test-users.sh
```

### 2. Kiểm tra GUEST (Không đăng nhập)

```bash
# Test các endpoint Public - PHẢI THÀNH CÔNG
curl -X GET "http://localhost:3000/api/v1/products/cards"
curl -X GET "http://localhost:3000/api/v1/lens/cards"
curl -X GET "http://localhost:3000/api/v1/categories/cards"
curl -X GET "http://localhost:3000/api/v1/brands/cards"
curl -X GET "http://localhost:3000/api/v1/lens/filter-by-prescription?sphereLeft=-2.0"

# Test các endpoint yêu cầu login - PHẢI THẤT BẠI (401/403)
curl -X GET "http://localhost:3000/api/v1/carts/my-cart"
curl -X POST "http://localhost:3000/api/v1/cart-item" -H "Content-Type: application/json" -d '{"productId":1,"quantity":1}'
curl -X GET "http://localhost:3000/api/v1/products/list"
```

### 3. Kiểm tra USER (Đã đăng nhập)

```bash
# Đăng nhập để lấy token
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@matnice.com","password":"testuser123"}'

# Lưu token vào biến (thay YOUR_TOKEN bằng token thực tế)
USER_TOKEN="YOUR_TOKEN_HERE"

# Test các endpoint User có thể truy cập - PHẢI THÀNH CÔNG
curl -X GET "http://localhost:3000/api/v1/carts/my-cart" -H "Authorization: Bearer $USER_TOKEN"
curl -X POST "http://localhost:3000/api/v1/cart-item" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d '{"productId":1,"quantity":1}'

# Test các endpoint chỉ Admin - PHẢI THẤT BẠI (403)
curl -X GET "http://localhost:3000/api/v1/products/list" -H "Authorization: Bearer $USER_TOKEN"
curl -X POST "http://localhost:3000/api/v1/lens/create" -H "Authorization: Bearer $USER_TOKEN"
```

### 4. Kiểm tra ADMIN (Quản trị viên)

```bash
# Đăng nhập admin
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@matnice.com","password":"testadmin123"}'

ADMIN_TOKEN="YOUR_ADMIN_TOKEN_HERE"

# Test các endpoint Admin - PHẢI THÀNH CÔNG
curl -X GET "http://localhost:3000/api/v1/products/list" -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X GET "http://localhost:3000/api/v1/lens/list" -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X POST "http://localhost:3000/api/v1/lens/create" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name":"Test Lens","brandId":1,"origin":"Vietnam","lensType":"single_vision","status":"active"}'
```

---

## 📊 Bảng Phân quyền Chi tiết

| Chức năng                     | Endpoint                           | Guest | User | Employee | Admin |
| ----------------------------- | ---------------------------------- | ----- | ---- | -------- | ----- |
| **👀 Xem sản phẩm**           |
| Danh sách sản phẩm (public)   | `GET /products/cards`              | ✅    | ✅   | ✅       | ✅    |
| Chi tiết sản phẩm             | `GET /product/:id/detail`          | ✅    | ✅   | ✅       | ✅    |
| Danh sách sản phẩm (admin)    | `GET /products/list`               | ❌    | ❌   | ✅       | ✅    |
| **🛒 Giỏ hàng**               |
| Xem giỏ hàng của tôi          | `GET /carts/my-cart`               | ❌    | ✅   | ✅       | ✅    |
| Thêm vào giỏ hàng             | `POST /cart-item`                  | ❌    | ✅   | ✅       | ✅    |
| **👓 Lens**                   |
| Danh sách lens (public)       | `GET /lens/cards`                  | ✅    | ✅   | ✅       | ✅    |
| Lọc lens theo toa             | `GET /lens/filter-by-prescription` | ✅    | ✅   | ✅       | ✅    |
| Danh sách lens (admin)        | `GET /lens/list`                   | ❌    | ❌   | ✅       | ✅    |
| Tạo lens                      | `POST /lens/create`                | ❌    | ❌   | ❌       | ✅    |
| **🏷️ Danh mục & Thương hiệu** |
| Xem danh mục                  | `GET /categories/cards`            | ✅    | ✅   | ✅       | ✅    |
| Xem thương hiệu               | `GET /brands/cards`                | ✅    | ✅   | ✅       | ✅    |
| Quản lý danh mục              | `POST/PUT/DELETE /category/*`      | ❌    | ❌   | ❌       | ✅    |
| **🤖 AI Services**            |
| Phân tích khuôn mặt           | `POST /ai/analyze-face`            | ✅    | ✅   | ✅       | ✅    |
| Xem kết quả                   | `GET /ai/analysis/:id/result`      | ✅    | ✅   | ✅       | ✅    |

---

## 🚀 Script Tự động Kiểm tra

Tạo file `test-all-permissions.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Matnice E-commerce Permissions"
echo "========================================"

BASE_URL="http://localhost:3000/api/v1"

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local description=$4
    local should_work=$5

    if [ -z "$token" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$BASE_URL$endpoint" -o /dev/null)
    else
        response=$(curl -s -w "%{http_code}" -X $method "$BASE_URL$endpoint" -H "Authorization: Bearer $token" -o /dev/null)
    fi

    if [ "$should_work" = "true" ]; then
        if [ "$response" = "200" ] || [ "$response" = "201" ]; then
            echo "✅ $description: PASS ($response)"
        else
            echo "❌ $description: FAIL ($response)"
        fi
    else
        if [ "$response" = "401" ] || [ "$response" = "403" ]; then
            echo "✅ $description (should fail): PASS ($response)"
        else
            echo "❌ $description (should fail): FAIL ($response)"
        fi
    fi
}

# 1. Test Guest endpoints
echo -e "\n🌍 Testing GUEST Access"
echo "------------------------"
test_endpoint "GET" "/products/cards" "" "Product cards" "true"
test_endpoint "GET" "/lens/cards" "" "Lens cards" "true"
test_endpoint "GET" "/categories/cards" "" "Category cards" "true"
test_endpoint "GET" "/carts/my-cart" "" "My cart (should fail)" "false"

# 2. Test User endpoints (need token)
if [ ! -z "$USER_TOKEN" ]; then
    echo -e "\n👤 Testing USER Access"
    echo "----------------------"
    test_endpoint "GET" "/carts/my-cart" "$USER_TOKEN" "My cart" "true"
    test_endpoint "GET" "/products/list" "$USER_TOKEN" "Product list (should fail)" "false"
fi

# 3. Test Admin endpoints (need token)
if [ ! -z "$ADMIN_TOKEN" ]; then
    echo -e "\n👑 Testing ADMIN Access"
    echo "-----------------------"
    test_endpoint "GET" "/products/list" "$ADMIN_TOKEN" "Product list" "true"
    test_endpoint "GET" "/lens/list" "$ADMIN_TOKEN" "Lens list" "true"
fi

echo -e "\n🎉 Test completed!"
```

Sử dụng:

```bash
chmod +x test-all-permissions.sh

# Set tokens (sau khi login)
export USER_TOKEN="your_user_token"
export ADMIN_TOKEN="your_admin_token"

./test-all-permissions.sh
```

---

## 🔍 Checklist Kiểm tra

### ✅ GUEST (Không đăng nhập)

- [ ] Xem danh sách sản phẩm (`/products/cards`)
- [ ] Xem chi tiết sản phẩm (`/product/:id/detail`)
- [ ] Xem danh sách lens (`/lens/cards`)
- [ ] Lọc lens theo toa (`/lens/filter-by-prescription`)
- [ ] Xem danh mục và thương hiệu
- [ ] Sử dụng AI phân tích khuôn mặt
- [ ] **KHÔNG** truy cập được giỏ hàng
- [ ] **KHÔNG** truy cập được admin endpoints

### ✅ USER (Đã đăng nhập)

- [ ] Tất cả quyền của Guest
- [ ] Xem và quản lý giỏ hàng cá nhân
- [ ] Thêm/sửa/xóa items trong giỏ hàng
- [ ] Tạo và quản lý đơn hàng
- [ ] **KHÔNG** truy cập được admin functions
- [ ] **KHÔNG** xem được dữ liệu của user khác

### ✅ ADMIN (Quản trị viên)

- [ ] Tất cả quyền của User
- [ ] Xem danh sách quản lý (`/products/list`, `/lens/list`)
- [ ] Tạo/sửa/xóa sản phẩm và lens
- [ ] Quản lý danh mục và thương hiệu
- [ ] Xem tất cả giỏ hàng và đơn hàng
- [ ] Truy cập debug endpoints

---

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized

- **Nguyên nhân**: Token không hợp lệ hoặc đã hết hạn
- **Giải pháp**: Đăng nhập lại để lấy token mới

### Lỗi 403 Forbidden

- **Nguyên nhân**: User không có quyền truy cập endpoint này
- **Giải pháp**: Kiểm tra role của user và phân quyền endpoint

### Lỗi 404 Not Found

- **Nguyên nhân**: Endpoint không tồn tại hoặc server không chạy
- **Giải pháp**: Kiểm tra URL và trạng thái server

---

## 💡 Tips

1. **Luôn test với Postman hoặc Insomnia** để dễ quản lý tokens
2. **Kiểm tra Network tab** trong browser để xem request/response
3. **Xem logs server** để hiểu lỗi chi tiết
4. **Test cả happy path và edge cases**
5. **Đảm bảo data test có đủ để test các trường hợp**

---

## 📞 Test Endpoints Quan trọng

### 🔐 Authentication

```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### 🌍 Public Endpoints

```bash
GET /api/v1/products/cards
GET /api/v1/lens/cards
GET /api/v1/categories/cards
GET /api/v1/brands/cards
GET /api/v1/lens/filter-by-prescription
```

### 👤 User Endpoints

```bash
GET /api/v1/carts/my-cart
POST /api/v1/cart-item
PUT /api/v1/cart-item/:id
DELETE /api/v1/cart-item/:id
```

### 👑 Admin Endpoints

```bash
GET /api/v1/products/list
GET /api/v1/lens/list
POST /api/v1/lens/create
POST /api/v1/product/create
```
