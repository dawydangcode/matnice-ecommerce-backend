INSERT INTO email_template (name, subject, content, created_at, updated_at)
VALUES (
  'order_status_update',
  'Cập nhật trạng thái đơn hàng #{{orderId}} - Mat Nice Store',
  '<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cập nhật trạng thái đơn hàng</title>
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
      font-size: 14px;
    }
    .status-update {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #333;
    }
    .status-row {
      padding: 8px 0;
    }
    .status-label {
      color: #666;
      font-size: 14px;
      font-weight: bold;
    }
    .status-old {
      color: #999;
      font-size: 14px;
      text-decoration: line-through;
      margin-left: 10px;
    }
    .status-new {
      color: #333;
      font-size: 16px;
      font-weight: bold;
      margin-left: 10px;
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
    .notice-box {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
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
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mat Nice Store</h1>
      <p>Cập nhật trạng thái đơn hàng</p>
    </div>

    <p>Xin chào <strong>{{customerName}}</strong>,</p>
    
    <p>Đơn hàng <strong>#{{orderId}}</strong> của bạn đã được cập nhật trạng thái.</p>

    <div class="status-update">
      <div class="status-row">
        <span class="status-label">Trạng thái cũ:</span>
        <span class="status-old">{{oldStatus}}</span>
      </div>
      <div class="status-row">
        <span class="status-label">Trạng thái mới:</span>
        <span class="status-new">{{newStatus}}</span>
      </div>
    </div>

    <div class="order-info">
      <h2>Thông tin đơn hàng</h2>
      <div class="info-row">
        <span class="info-label">Mã đơn hàng:</span>
        <span class="info-value">#{{orderId}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Ngày đặt hàng:</span>
        <span class="info-value">{{orderDate}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Mã vận đơn:</span>
        <span class="info-value">{{trackingNumber}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dự kiến giao hàng:</span>
        <span class="info-value">{{estimatedDelivery}}</span>
      </div>
    </div>

    <div class="notice-box">
      <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.6;">
        <strong>Lưu ý:</strong> Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.
      </p>
    </div>

    <div style="text-align: center;">
      <p>Đơn hàng của bạn đang được xử lý và giao đến bạn trong thời gian sớm nhất.</p>
      <a href="https://matnice.com/orders/{{orderId}}" class="button">Xem chi tiết đơn hàng</a>
    </div>

    <p style="margin-top: 30px;">Cảm ơn bạn đã tin tưởng Mat Nice Store!</p>

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
  NOW()
)
ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  content = VALUES(content),
  updated_at = NOW();
