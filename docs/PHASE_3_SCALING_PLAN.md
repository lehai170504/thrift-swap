# Kế hoạch mở rộng Hệ sinh thái ThriftSwap (Phase 3: Scaling & Monetization)

Tài liệu này phác thảo kiến trúc và các bước triển khai cho 3 tính năng lớn giúp ThriftSwap trở nên chuyên nghiệp và bắt đầu sinh lời:
1. **Tích hợp vận chuyển (Logistics Integration)**
2. **Hệ thống Khuyến mãi (Voucher System)**
3. **Chiến lược kiếm tiền (Monetization)**

---

## 1. Tích hợp Đơn vị vận chuyển bên thứ 3 (GHTK / GHN)
Hiện tại, ThriftSwap chỉ quản lý mã vận đơn (tracking code) thủ công. Việc tích hợp API vận chuyển sẽ tự động hoá quy trình này.

### Thay đổi Database (Entity `Order`)
- Thêm các trường liên quan đến phí và vận chuyển:
  - `shippingFee` (BigDecimal): Phí vận chuyển
  - `shippingProvider` (Enum: `GHTK`, `GHN`, `VIETTEL_POST`, `SELF_MANAGED`)
  - `shippingAddress` (String): Địa chỉ nhận hàng chi tiết (có thể tách thành entity riêng nếu cần)
  - `shippingStatus` (String): Trạng thái vận chuyển đồng bộ từ đối tác (VD: "Đang giao", "Giao thành công").

### Logic xử lý (Backend)
- **Tính phí tự động:** Khi người dùng ở trang Checkout, BE sẽ gọi API của GHTK/GHN để tính phí ship dựa trên khoảng cách (từ địa chỉ Seller đến địa chỉ Buyer) và khối lượng ước tính của sản phẩm.
- **Tạo đơn tự động:** Khi Buyer thanh toán (tiền vào Escrow), hệ thống tự động bắn API sang GHTK/GHN để tạo đơn giao hàng. Tracking code sẽ được trả về và lưu vào Order.
- **Webhooks:** Viết API endpoint để nhận Webhook từ GHTK/GHN. Khi shipper giao hàng thành công, GHTK sẽ ping vào Webhook của ta -> Hệ thống tự động chuyển trạng thái Order thành `COMPLETED` và giải ngân tiền cho Seller.

---

## 2. Hệ thống Khuyến mãi & Vouchers
Voucher là công cụ cực kỳ quan trọng để thu hút user mới và thúc đẩy doanh số.

### Thay đổi Database
Tạo Entity mới `Voucher`:
- `code` (String): Mã voucher (VD: `FREESHIP50`, `WELCOME2026`)
- `type` (Enum: `FIXED_AMOUNT`, `PERCENTAGE`, `FREE_SHIPPING`)
- `discountValue` (BigDecimal): Giá trị giảm (Ví dụ: 50,000 VNĐ hoặc 10%)
- `minOrderValue` (BigDecimal): Giá trị đơn hàng tối thiểu
- `maxDiscount` (BigDecimal): Giảm tối đa (Dành cho % discount)
- `quantity` (Integer): Số lượng mã có sẵn
- `expiryDate` (LocalDateTime): Ngày hết hạn
- `seller_id` (User - Nullable): Nếu Null, đây là voucher của hệ thống (Platform Voucher). Nếu có giá trị, đây là voucher do riêng Shop đó tạo ra.

Tạo Entity `VoucherUsage`:
- Lưu lịch sử user nào đã dùng voucher nào cho đơn hàng nào (để tránh 1 người dùng 1 mã nhiều lần).

### Thay đổi ở Order Entity
- Thêm `appliedVoucher` (ManyToOne -> Voucher)
- Thêm `discountAmount` (BigDecimal): Số tiền được giảm.

---

## 3. Chiến lược Kiếm tiền (Monetization Strategies)
Đây là cách hệ thống ThriftSwap sẽ tạo ra doanh thu thực tế.

### A. Phí sàn (Platform Commission Fee)
- **Cơ chế:** Sàn thu phí giao dịch X% (VD: 5%) trên mỗi đơn hàng thành công.
- **Triển khai:** 
  - Tại entity `Order`, thêm trường `platformFee` (BigDecimal).
  - Khi Order chuyển sang `COMPLETED`, thay vì chuyển 100% tiền từ Escrow Wallet sang Seller Wallet, hệ thống sẽ:
    - Chuyển `(100% - 5%)` cho Seller.
    - Chuyển `5%` vào ví của Admin (Hệ thống).
- **Lợi ích:** Dòng tiền ổn định nhất, giao dịch càng nhiều sàn càng giàu.

### B. Tin đăng nổi bật (Promoted/Sponsored Listings)
- **Cơ chế:** Seller có thể dùng tiền trong Ví để "Đẩy tin" hoặc ghim sản phẩm lên đầu trang Tìm kiếm / Trang chủ trong 24h hoặc 7 ngày.
- **Triển khai:**
  - Entity `Product` thêm trường `boostedUntil` (LocalDateTime).
  - Viết API `POST /api/products/{id}/boost`, trừ tiền trong Wallet của Seller.
  - Sửa lại query tìm kiếm sản phẩm: Ưu tiên `ORDER BY boostedUntil DESC` để các tin được trả tiền hiển thị đầu tiên (có tag "Tài trợ" hoặc "Nổi bật").

### C. Phí rút tiền (Withdrawal Fee)
- **Cơ chế:** Thu 1 khoản phí nhỏ (VD: 5,000đ/lần rút) hoặc % khi Seller yêu cầu rút tiền về ngân hàng.

---

## Các bước triển khai tiếp theo
*Tài liệu này được lưu trữ để phân tích và đánh giá độ phức tạp trước khi chia nhỏ thành các ticket/task.*
