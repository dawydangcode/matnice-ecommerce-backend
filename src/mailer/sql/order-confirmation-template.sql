-- Insert Order Confirmation Email Template
INSERT INTO `email_template` (
  `name`,
  `subject`,
  `description`,
  `html`,
  `created_at`,
  `created_by`,
  `updated_at`,
  `updated_by`
) VALUES (
  'order_confirmation',
  'Xác nhận đơn hàng #{{orderId}} - Mat Nice Store',
  'Email template for order confirmation after successful payment',
  '<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #333;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .order-info {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .order-info h2 {
      color: #333;
      font-size: 18px;
      margin-top: 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: bold;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background-color: #333;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .total-row {
      background-color: #f9f9f9;
      font-weight: bold;
      font-size: 16px;
    }
    .shipping-address {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #333;
    }
    .shipping-address h2 {
      color: #333;
      font-size: 18px;
      margin-top: 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #333;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #555;
    }
    .highlight {
      color: #333;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Đặt hàng thành công!</h1>
      <p>Cảm ơn bạn đã mua sắm tại Mat Nice Store</p>
    </div>

    <p>Xin chào <strong>{{customerName}}</strong>,</p>
    
    <p>Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết đơn hàng:</p>

    <div class="order-info">
      <h2>Thông tin đơn hàng</h2>
      <div class="info-row">
        <span class="info-label">Mã đơn hàng:</span>
        <span class="info-value highlight">#{{orderId}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Mã thanh toán PayOS:</span>
        <span class="info-value">{{payosOrderCode}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Thời gian đặt hàng:</span>
        <span class="info-value">{{orderDate}}</span>
      </div>
    </div>

    <h2 style="color: #333;">Sản phẩm trong đơn hàng</h2>
    <table>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th style="text-align: center;">Số lượng</th>
          <th style="text-align: right;">Giá</th>
        </tr>
      </thead>
      <tbody>
        {{productList}}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="text-align: right; padding-right: 12px;">Tạm tính:</td>
          <td style="text-align: right; font-weight: bold;">{{subtotal}}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: right; padding-right: 12px;">Phí vận chuyển:</td>
          <td style="text-align: right; font-weight: bold;">{{shippingCost}}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-right: 12px;">Tổng cộng:</td>
          <td style="text-align: right; color: #333; font-size: 18px;">{{totalPrice}}</td>
        </tr>
      </tfoot>
    </table>

    <div class="shipping-address">
      <h2>Địa chỉ giao hàng</h2>
      <p style="margin: 5px 0;"><strong>Người nhận:</strong> {{shippingFullName}}</p>
      <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> {{shippingPhone}}</p>
      <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> {{shippingAddress}}</p>
    </div>

    <div style="text-align: center;">
      <p>Đơn hàng của bạn sẽ được xử lý và giao đến bạn trong thời gian sớm nhất.</p>
      <a href="https://matnice.com" class="button">Xem đơn hàng</a>
    </div>

    <div class="footer">
      <p><strong>Mat Nice Store</strong></p>
      <p>Email: support@matnice.com | Hotline: 1900-xxxx</p>
      <p>Địa chỉ: Số 1, Võ Văn Ngân, Thủ Đức, TP.HCM</p>
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
        © 2024 Mat Nice Store. All rights reserved.<br>
        Email này được gửi tự động, vui lòng không trả lời email này.
      </p>
    </div>
  </div>
</body>
</html>',
  NOW(),
  1,
  NOW(),
  1
);
