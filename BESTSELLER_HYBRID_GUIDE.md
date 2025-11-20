# Bestseller Hybrid System - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống **Hybrid Bestseller** kết hợp 2 phương pháp:

1. **Tự động từ Database**: Sản phẩm bán chạy dựa trên số lượng bán thực tế
2. **Admin Manual Setting**: Admin có thể tự set/pin sản phẩm bestseller

## Cách Hoạt Động

### 1. Sorting Logic (Ưu tiên sắp xếp)

Sản phẩm được hiển thị theo thứ tự:

1. ⭐ **Pinned products** (Admin đánh dấu ưu tiên)
   - Theo `custom_priority` (1 = cao nhất)
   - Theo `display_order`
2. 📊 **Top selling products** (Tự động từ doanh số)
   - Theo `sales_last_30_days` (Doanh số 30 ngày gần nhất)
   - Theo `total_sales` (Tổng doanh số)

### 2. Database Schema

**Table: `product_bestseller`**

```sql
- id: Primary key
- product_id: Link to product (UNIQUE)
- is_pinned: Admin đánh dấu (boolean)
- custom_priority: Ưu tiên thủ công (1-N, 1 = cao nhất)
- display_order: Thứ tự hiển thị
- total_sales: Tổng số lượng bán (auto)
- sales_last_30_days: Doanh số 30 ngày (auto)
- revenue_generated: Tổng doanh thu (auto)
- is_active: Bật/tắt bestseller
- notes: Ghi chú admin
```

## API Endpoints

### Public Endpoints

#### GET `/api/v1/bestsellers`

Lấy danh sách bestsellers cho homepage

**Query Parameters:**

- `limit` (optional): Số lượng sản phẩm (default: 8)
- `pinnedOnly` (optional): Chỉ lấy sản phẩm pinned (default: false)

**Response:**

```json
[
  {
    "id": 1,
    "productName": "Ray-Ban Aviator",
    "price": 5000000,
    "discountPrice": 4000000,
    "discountPercentage": 20,
    "brand": {
      "id": 1,
      "name": "Ray-Ban"
    },
    "image": "https://...",
    "isBoutique": true,
    "isNew": false,
    "totalSales": 150,
    "isPinned": true,
    "productCode": "RB3025"
  }
]
```

### Admin Endpoints (Cần authentication)

#### GET `/api/v1/bestsellers/admin/all`

Lấy tất cả bestsellers với thông tin chi tiết

**Required Role:** Admin, Employee

#### POST `/api/v1/bestsellers/admin`

Tạo bestseller mới

**Required Role:** Admin

**Body:**

```json
{
  "productId": 1,
  "isPinned": true,
  "customPriority": 1,
  "displayOrder": 1,
  "notes": "Sản phẩm bán chạy nhất tháng này"
}
```

#### PUT `/api/v1/bestsellers/admin/:id`

Cập nhật bestseller

**Required Role:** Admin

**Body:**

```json
{
  "isPinned": false,
  "customPriority": 2,
  "displayOrder": 5,
  "isActive": true,
  "notes": "Updated notes"
}
```

#### DELETE `/api/v1/bestsellers/admin/:id`

Xóa bestseller

**Required Role:** Admin

#### POST `/api/v1/bestsellers/admin/sync-sales`

Đồng bộ dữ liệu doanh số (manual trigger)

**Required Role:** Admin

**Body:**

```json
{
  "days": 30
}
```

## Cách Sử Dụng

### Scenario 1: Admin muốn pin một sản phẩm mới

```bash
# 1. Tạo bestseller entry
POST /api/v1/bestsellers/admin
{
  "productId": 123,
  "isPinned": true,
  "customPriority": 1,
  "notes": "Sản phẩm mới nhất - cần promote"
}

# Sản phẩm này sẽ xuất hiện đầu tiên trong danh sách bestsellers
```

### Scenario 2: Sử dụng hybrid (Auto + Manual)

```bash
# 1. Admin pin 2-3 sản phẩm ưu tiên
POST /api/v1/bestsellers/admin
{
  "productId": 100,
  "isPinned": true,
  "customPriority": 1
}

POST /api/v1/bestsellers/admin
{
  "productId": 101,
  "isPinned": true,
  "customPriority": 2
}

# 2. Các sản phẩm còn lại được tự động sắp xếp theo doanh số
# Khi fetch GET /api/v1/bestsellers?limit=8
# Kết quả: 2 pinned products + 6 top selling products
```

### Scenario 3: Đồng bộ dữ liệu sales

```bash
# Option 1: Manual trigger
POST /api/v1/bestsellers/admin/sync-sales
{
  "days": 30
}

# Option 2: Cron Job (cần implement)
# Chạy mỗi đêm để cập nhật total_sales, sales_last_30_days
```

## Frontend Implementation

### Sử dụng trong React Component

```typescript
import bestsellerService from '../services/bestsellerService';

// Fetch bestsellers
const [bestsellers, setBestsellers] = useState([]);

useEffect(() => {
  const fetchBestsellers = async () => {
    try {
      const data = await bestsellerService.getBestsellers({ limit: 8 });
      setBestsellers(data);
    } catch (error) {
      console.error('Failed to fetch bestsellers:', error);
    }
  };

  fetchBestsellers();
}, []);

// Hiển thị
{bestsellers.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

## Lợi Ích của Hybrid Approach

### ✅ Ưu điểm

1. **Linh hoạt**: Admin có thể promote sản phẩm mới hoặc chiến lược
2. **Tự động**: Phần lớn sản phẩm tự động dựa trên performance
3. **Minh bạch**: Hiển thị cả pinned và sales data
4. **Control**: Admin vẫn kiểm soát được trải nghiệm người dùng
5. **Data-driven**: Quyết định dựa trên dữ liệu thực

### 📊 Best Practices

1. **Pin 2-3 sản phẩm chiến lược** (seasonal, new arrivals, high margin)
2. **Để phần còn lại tự động** (dựa vào sales performance)
3. **Review định kỳ** (monthly) để adjust pinned products
4. **Monitor sales data** để đảm bảo accuracy
5. **A/B testing** khác nhau pinned strategies

## Migration Steps

1. Chạy migration:

```bash
npm run migration:run
```

2. Seed initial data (optional):

```sql
-- Tạo bestseller entries cho top products
INSERT INTO product_bestseller (product_id, total_sales, is_active, created_by, updated_by)
SELECT id, 0, true, 1, 1
FROM product
WHERE id IN (1, 2, 3, 4, 5);
```

3. Setup cron job để sync sales data:

```typescript
// TODO: Implement in product-scheduler.service.ts
@Cron('0 2 * * *') // Chạy 2AM mỗi ngày
async syncBestsellerSales() {
  await this.bestsellerService.syncSalesData(30);
}
```

## Future Enhancements

1. ⏰ **Auto-sync cron job** - Tự động sync sales data hàng ngày
2. 📈 **Analytics dashboard** - Xem performance của bestsellers
3. 🔄 **A/B Testing** - Test different bestseller strategies
4. 🎯 **Personalization** - Bestsellers theo user preferences
5. 📱 **Admin Panel UI** - Giao diện quản lý bestsellers
6. 💰 **Revenue tracking** - Theo dõi doanh thu từ bestsellers
7. 🏷️ **Tags & Categories** - Bestsellers theo category

## Troubleshooting

### Issue: Không fetch được bestsellers

**Check:**

1. Backend đã chạy chưa?
2. Migration đã chạy chưa?
3. Có data trong `product_bestseller` table?
4. CORS settings đúng chưa?

**Solution:**

```bash
# Check backend logs
npm run start:dev

# Check database
SELECT * FROM product_bestseller;

# Test API directly
curl http://localhost:3001/api/v1/bestsellers
```

### Issue: Sản phẩm không hiển thị đúng thứ tự

**Check:**

1. `is_active` = true?
2. `is_pinned` và `custom_priority` đã set đúng?
3. Sales data đã sync chưa?

**Solution:**

```sql
-- Check bestseller data
SELECT
  pb.id,
  p.product_name,
  pb.is_pinned,
  pb.custom_priority,
  pb.total_sales,
  pb.is_active
FROM product_bestseller pb
JOIN product p ON pb.product_id = p.id
ORDER BY
  pb.is_pinned DESC,
  pb.custom_priority ASC,
  pb.total_sales DESC;
```

## Contact & Support

Nếu có vấn đề, vui lòng:

1. Check logs ở backend
2. Verify database schema
3. Test API endpoints với Postman/Thunder Client
4. Review code trong `bestseller.service.ts` và `bestseller.controller.ts`
