# Boutique Filter Implementation

## Summary
Added support for filtering products by `boutique` field (true/false) in the product cards API.

## Backend Changes

### 1. DTO Update (`src/product/dtos/product.dto.ts`)
Added `boutique` parameter to `GetProductsForCardQueryDto`:
```typescript
@ApiProperty({ required: false, type: String })
@IsOptional()
@IsString()
@Transform(({ value }) => {
  if (value === '1' || value === 'true') return 'true';
  if (value === '0' || value === 'false') return 'false';
  return value;
})
boutique?: string;
```

### 2. Controller Update (`src/product/product.controller.ts`)
Updated `getProductsForCardDisplay` to pass boutique parameter:
```typescript
return await this.productService.getProductsForCardDisplay(
  // ... other parameters
  query.boutique === 'true' ? true : query.boutique === 'false' ? false : undefined,
);
```

### 3. Service Update (`src/product/product.service.ts`)

**Method Signature:**
```typescript
async getProductsForCardDisplay(
  // ... existing parameters
  productType?: ProductType,
  boutique?: boolean,  // NEW PARAMETER
): Promise<PageList<any>>
```

**Query Builder:**
```typescript
// Add boutique filter
if (boutique !== undefined) {
  queryBuilder.andWhere('product.isBoutique = :boutique', {
    boutique: boutique,
  });
}
```

## Frontend Changes

### 1. Types Update (`src/types/product-card.types.ts`)
```typescript
export interface ProductCardQueryParams {
  // ... existing fields
  boutique?: boolean;
}
```

### 2. Service Update (`src/services/product-card.service.ts`)
```typescript
if (params.boutique !== undefined) {
  queryParams.append('boutique', params.boutique ? '1' : '0');
}
```

### 3. New Page (`src/pages/BoutiquePage.tsx`)
- Created dedicated page for boutique products
- Always passes `boutique: true` to API
- Reuses all existing filters (gender, brand, price, etc.)

### 4. Routing (`src/App.tsx`)
```typescript
import BoutiquePage from './pages/BoutiquePage';
// ...
<Route path="/boutique" element={<BoutiquePage />} />
```

## API Usage

### Get All Products
```
GET /api/v1/products/cards
```

### Get Only Boutique Products
```
GET /api/v1/products/cards?boutique=1
```

### Get Non-Boutique Products
```
GET /api/v1/products/cards?boutique=0
```

### Combine with Other Filters
```
GET /api/v1/products/cards?boutique=1&productType=glasses&gender=female
```

## Testing

1. Navigate to `http://localhost:3002/boutique`
2. Should only see products with `isBoutique = true`
3. All filters should work normally (gender, brand, price, etc.)
4. Products without boutique badge should NOT appear

## Database Field
The filter uses the existing `isBoutique` column in the `product` table:
- Type: `tinyint(1)` or `boolean`
- Default: `0` (false)
- Set to `1` (true) for boutique products
