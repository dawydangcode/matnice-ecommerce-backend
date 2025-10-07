# 🔐 Complete Permission Matrix - E-commerce Backend

## 📋 Role-Based Access Control Summary

### 🎭 Available Roles

- **Guest** - Không cần đăng nhập
- **User** - Người dùng đã đăng nhập
- **Admin** - Quản trị viên
- **Employee** - Nhân viên (một số trường hợp)

---

## 🛍️ **PRODUCT MODULES**

### 🎨 **Color Skin Recommendation**

| Endpoint                                       | Method | Permission    | Description                     |
| ---------------------------------------------- | ------ | ------------- | ------------------------------- |
| `/api/v1/color-skin-recommendation/list`       | GET    | @Public()     | Guest xem danh sách khuyến nghị |
| `/api/v1/color-skin-recommendation/create`     | POST   | @Roles(Admin) | Admin tạo khuyến nghị           |
| `/api/v1/color-skin-recommendation/:id/update` | PUT    | @Roles(Admin) | Admin cập nhật                  |
| `/api/v1/color-skin-recommendation/:id/delete` | DELETE | @Roles(Admin) | Admin xóa                       |

### 🖼️ **Model 3D Config**

| Endpoint                             | Method | Permission              | Description                  |
| ------------------------------------ | ------ | ----------------------- | ---------------------------- |
| `/api/v1/model-3d-config/list`       | GET    | @Roles(Admin, Employee) | Admin/Employee xem danh sách |
| `/api/v1/model-3d-config/:id/detail` | GET    | @Public()               | Guest xem chi tiết config    |
| `/api/v1/model-3d-config/create`     | POST   | @Roles(Admin)           | Admin tạo config             |
| `/api/v1/model-3d-config/:id/update` | PUT    | @Roles(Admin)           | Admin cập nhật               |
| `/api/v1/model-3d-config/:id/delete` | DELETE | @Roles(Admin)           | Admin xóa                    |

### 🎯 **Product 3D Model**

| Endpoint                           | Method | Permission    | Description        |
| ---------------------------------- | ------ | ------------- | ------------------ |
| `/api/v1/product-3d-model/serve/*` | GET    | @Public()     | Guest tải model 3D |
| `/api/v1/product-3d-model/upload`  | POST   | @Roles(Admin) | Admin upload model |

### 📁 **Product Category**

| Endpoint                                                  | Method          | Permission    | Description                 |
| --------------------------------------------------------- | --------------- | ------------- | --------------------------- |
| `/api/v1/product-category/list`                           | GET             | @Public()     | Guest xem danh mục          |
| `/api/v1/product-category/product/:id/categories`         | GET             | @Public()     | Guest xem danh mục sản phẩm |
| `/api/v1/product-category/product/:id/categories/details` | GET             | @Public()     | Guest xem chi tiết danh mục |
| Other CRUD                                                | POST/PUT/DELETE | @Roles(Admin) | Admin quản lý danh mục      |

### 🎨 **Product Color**

| Endpoint                                   | Method | Permission    | Description                 |
| ------------------------------------------ | ------ | ------------- | --------------------------- |
| `/api/v1/product-color/list`               | GET    | @Public()     | Guest xem màu sắc           |
| `/api/v1/product-color/:id/detail`         | GET    | @Public()     | Guest xem chi tiết màu      |
| `/api/v1/product-color/:productId/product` | GET    | @Public()     | Guest xem màu theo sản phẩm |
| `/api/v1/product-color/create`             | POST   | @Roles(Admin) | Admin tạo màu               |
| `/api/v1/product-color/:id/update`         | PUT    | @Roles(Admin) | Admin cập nhật              |
| `/api/v1/product-color/:id/delete`         | DELETE | @Roles(Admin) | Admin xóa                   |

### 📝 **Product Detail**

| Endpoint                              | Method | Permission    | Description                 |
| ------------------------------------- | ------ | ------------- | --------------------------- |
| `/api/v1/products-detail/:id/details` | GET    | @Public()     | Guest xem chi tiết sản phẩm |
| `/api/v1/product-detail/create`       | POST   | @Roles(Admin) | Admin tạo chi tiết          |
| `/api/v1/product-detail/:id/update`   | PUT    | @Roles(Admin) | Admin cập nhật              |
| `/api/v1/product-detail/:id/delete`   | DELETE | @Roles(Admin) | Admin xóa                   |

### 🖼️ **Product Image**

| Endpoint                                 | Method          | Permission              | Description            |
| ---------------------------------------- | --------------- | ----------------------- | ---------------------- |
| `/api/v1/product/:id/product-image/list` | GET             | @Public()               | Guest xem ảnh sản phẩm |
| `/api/v1/product-image/:id/detail`       | GET             | @Public()               | Guest xem chi tiết ảnh |
| `/api/v1/product-image/list`             | GET             | @Roles(Admin, Employee) | Admin/Employee quản lý |
| All Upload/CRUD                          | POST/PUT/DELETE | @Roles(Admin)           | Admin quản lý ảnh      |

### 📏 **Product Thickness Compatibility**

| Endpoint                                                                | Method          | Permission    | Description                    |
| ----------------------------------------------------------------------- | --------------- | ------------- | ------------------------------ |
| `/api/v1/product-thickness-compatibility/list`                          | GET             | @Public()     | Guest xem tương thích          |
| `/api/v1/product-thickness-compatibility/product/:id/thickness-ids`     | GET             | @Public()     | Guest xem độ dày tương thích   |
| `/api/v1/product-thickness-compatibility/thickness/:id/product-ids`     | GET             | @Public()     | Guest xem sản phẩm tương thích |
| `/api/v1/product-thickness-compatibility/check/:productId/:thicknessId` | GET             | @Public()     | Guest kiểm tra tương thích     |
| All CRUD                                                                | POST/PUT/DELETE | @Roles(Admin) | Admin quản lý tương thích      |

---

## 👓 **LENS MODULES**

### 🔍 **Lens Variant**

| Endpoint                            | Method          | Permission              | Description                  |
| ----------------------------------- | --------------- | ----------------------- | ---------------------------- |
| `/api/v1/lens-variant/list`         | GET             | @Roles(Admin, Employee) | Admin/Employee xem danh sách |
| `/api/v1/lens-variant/:lensId/lens` | GET             | @Public()               | Guest xem variant theo lens  |
| `/api/v1/lens-variant/:id/detail`   | GET             | @Public()               | Guest xem chi tiết variant   |
| All CRUD                            | POST/PUT/DELETE | @Roles(Admin)           | Admin quản lý variant        |

### 🎨 **Lens Variant Coating**

| Endpoint                                          | Method          | Permission              | Description                    |
| ------------------------------------------------- | --------------- | ----------------------- | ------------------------------ |
| `/api/v1/lens-variant-coating/list`               | GET             | @Roles(Admin, Employee) | Admin/Employee xem danh sách   |
| `/api/v1/lens-variant-coating/:variantId/variant` | GET             | @Public()               | Guest xem coating theo variant |
| `/api/v1/lens-variant-coating/:id/detail`         | GET             | @Public()               | Guest xem chi tiết coating     |
| All CRUD                                          | POST/PUT/DELETE | @Roles(Admin)           | Admin quản lý coating          |

### 🌈 **Lens Tint Color**

| Endpoint                               | Method          | Permission              | Description                  |
| -------------------------------------- | --------------- | ----------------------- | ---------------------------- |
| `/api/v1/lens-tint-color/list`         | GET             | @Roles(Admin, Employee) | Admin/Employee xem danh sách |
| `/api/v1/lens-tint-color/:lensId/lens` | GET             | @Public()               | Guest xem màu theo lens      |
| `/api/v1/lens-tint-color/:id/detail`   | GET             | @Public()               | Guest xem chi tiết màu       |
| All CRUD                               | POST/PUT/DELETE | @Roles(Admin)           | Admin quản lý màu            |

### 📏 **Lens Thickness & Refraction Range**

| Endpoint          | Method          | Permission              | Description            |
| ----------------- | --------------- | ----------------------- | ---------------------- |
| Viewing endpoints | GET             | @Public()               | Guest xem thông tin    |
| List endpoints    | GET             | @Roles(Admin, Employee) | Admin/Employee quản lý |
| All CRUD          | POST/PUT/DELETE | @Roles(Admin)           | Admin quản lý          |

---

## 🛒 **ORDER & PAYMENT MODULES**

### 📦 **Order**

| Endpoint                   | Method | Permission                    | Description                   |
| -------------------------- | ------ | ----------------------------- | ----------------------------- |
| `/api/v1/order/list`       | GET    | @Roles(Admin, Employee)       | Admin/Employee xem tất cả đơn |
| `/api/v1/order/create`     | POST   | @Roles(User, Admin, Employee) | User tạo đơn hàng             |
| `/api/v1/order/:id/detail` | GET    | @Roles(User, Admin, Employee) | User xem đơn của mình         |
| `/api/v1/order/:id/update` | PUT    | @Roles(Admin, Employee)       | Admin/Employee cập nhật       |
| `/api/v1/order/:id/delete` | DELETE | @Roles(Admin)                 | Admin xóa đơn                 |

### 🛍️ **Order Item**

| Endpoint                             | Method | Permission                    | Description               |
| ------------------------------------ | ------ | ----------------------------- | ------------------------- |
| `/api/v1/order-item/list`            | GET    | @Roles(Admin, Employee)       | Admin/Employee xem tất cả |
| `/api/v1/order-item/order/:id/items` | GET    | @Roles(User, Admin, Employee) | User xem item của đơn     |
| `/api/v1/order-item/create`          | POST   | @Roles(User, Admin, Employee) | User tạo item             |
| `/api/v1/order-item/:id/update`      | PUT    | @Roles(Admin, Employee)       | Admin/Employee cập nhật   |
| `/api/v1/order-item/:id/delete`      | DELETE | @Roles(Admin)                 | Admin xóa                 |

### 💳 **Payment**

| Endpoint                             | Method | Permission                    | Description               |
| ------------------------------------ | ------ | ----------------------------- | ------------------------- |
| `/api/v1/payment/list`               | GET    | @Roles(Admin, Employee)       | Admin/Employee xem tất cả |
| `/api/v1/payment/create`             | POST   | @Roles(User, Admin, Employee) | User tạo thanh toán       |
| `/api/v1/payment/order/:id/payments` | GET    | @Roles(User, Admin, Employee) | User xem thanh toán đơn   |
| `/api/v1/payment/:id/update`         | PUT    | @Roles(Admin, Employee)       | Admin/Employee cập nhật   |
| `/api/v1/payment/:id/delete`         | DELETE | @Roles(Admin)                 | Admin xóa                 |

### 💰 **PayOS**

| Endpoint                            | Method   | Permission                    | Description              |
| ----------------------------------- | -------- | ----------------------------- | ------------------------ |
| `/api/v1/payos/create-payment-link` | POST     | @Roles(User, Admin, Employee) | User tạo link thanh toán |
| Other PayOS endpoints               | GET/POST | @Roles(User, Admin, Employee) | User xử lý thanh toán    |

---

## 👥 **USER MODULES**

### 👤 **User Management**

| Endpoint                  | Method | Permission    | Description              |
| ------------------------- | ------ | ------------- | ------------------------ |
| `/api/v1/user/list`       | GET    | @Roles(Admin) | Admin xem danh sách user |
| `/api/v1/user/:id/detail` | GET    | @Roles(Admin) | Admin xem chi tiết user  |
| `/api/v1/user/create`     | POST   | @Roles(Admin) | Admin tạo user           |
| `/api/v1/user/:id/update` | PUT    | @Roles(Admin) | Admin cập nhật user      |
| `/api/v1/user/:id/delete` | DELETE | @Roles(Admin) | Admin xóa user           |

### 🏠 **User Address**

| Endpoint                               | Method | Permission          | Description               |
| -------------------------------------- | ------ | ------------------- | ------------------------- |
| `/api/v1/user-address/list`            | GET    | @Roles(Admin)       | Admin xem tất cả địa chỉ  |
| `/api/v1/user-address/:userId/user`    | GET    | @Roles(User, Admin) | User xem địa chỉ của mình |
| `/api/v1/user-address/:id/detail`      | GET    | @Roles(User, Admin) | User xem chi tiết địa chỉ |
| `/api/v1/user-address/create`          | POST   | @Roles(User, Admin) | User tạo địa chỉ          |
| `/api/v1/user-address/:id/update`      | PUT    | @Roles(User, Admin) | User cập nhật địa chỉ     |
| `/api/v1/user-address/:id/delete`      | DELETE | @Roles(User, Admin) | User xóa địa chỉ          |
| `/api/v1/user-address/:id/set-default` | PUT    | @Roles(User, Admin) | User đặt mặc định         |

### 📋 **User Detail**

| Endpoint                           | Method | Permission          | Description                 |
| ---------------------------------- | ------ | ------------------- | --------------------------- |
| `/api/v1/user-detail/list`         | GET    | @Roles(Admin)       | Admin xem tất cả            |
| `/api/v1/user-detail/:id/detail`   | GET    | @Roles(User, Admin) | User xem chi tiết của mình  |
| `/api/v1/user/:userId/user-detail` | GET    | @Roles(User, Admin) | User xem detail theo userId |
| `/api/v1/user-detail/create`       | POST   | @Roles(User, Admin) | User tạo thông tin          |
| `/api/v1/user-detail/:id/update`   | PUT    | @Roles(User, Admin) | User cập nhật               |
| `/api/v1/user-detail/:id/delete`   | DELETE | @Roles(User, Admin) | User xóa                    |

---

## 🎭 **ROLE MODULE**

### 👑 **Role Management**

| Endpoint                  | Method | Permission    | Description              |
| ------------------------- | ------ | ------------- | ------------------------ |
| `/api/v1/role/list`       | GET    | @Public()     | Guest xem danh sách role |
| `/api/v1/role/create`     | POST   | @Roles(Admin) | Admin tạo role           |
| `/api/v1/role/:id/update` | PUT    | @Roles(Admin) | Admin cập nhật role      |
| `/api/v1/role/:id/delete` | DELETE | @Roles(Admin) | Admin xóa role           |

---

## 🔧 **Testing Guidelines**

### 🔓 **Guest Access (Không token)**

```bash
# Test guest endpoints
curl -X GET "http://localhost:3000/api/v1/product-color/list"
curl -X GET "http://localhost:3000/api/v1/lens-variant/1/lens"
curl -X GET "http://localhost:3000/api/v1/role/list"
```

### 👤 **User Access (User token)**

```bash
# Test user endpoints
curl -X POST "http://localhost:3000/api/v1/order/create" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [...]}'
```

### 👑 **Admin Access (Admin token)**

```bash
# Test admin endpoints
curl -X POST "http://localhost:3000/api/v1/product-color/create" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"colorName": "Red", ...}'
```

---

## 🎯 **Permission Summary**

### ✅ **Guest (Public Access)**

- Xem tất cả thông tin sản phẩm, lens, màu sắc
- Xem danh sách role
- Không thể tạo, sửa, xóa

### 👤 **User (Authenticated)**

- Tất cả quyền của Guest
- Quản lý đơn hàng của mình
- Quản lý thông tin cá nhân
- Quản lý địa chỉ của mình
- Thanh toán đơn hàng

### 👑 **Admin (Full Access)**

- Tất cả quyền của User
- Quản lý toàn bộ sản phẩm, lens
- Quản lý tất cả đơn hàng
- Quản lý user và role
- Upload file, ảnh

### 👔 **Employee**

- Một số quyền xem danh sách (ít dùng)
- Quản lý đơn hàng và thanh toán
- Không có quyền quản lý user/role

---

> ✅ **Status**: Đã hoàn thành cập nhật permissions cho toàn bộ hệ thống!
> 🔄 **Last Updated**: $(date)
