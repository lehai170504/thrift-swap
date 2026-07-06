# ThriftSwap 🚀

ThriftSwap là nền tảng Thương mại điện tử Đồ cũ (Second-hand) kết hợp **Đấu giá thời gian thực (Real-time Auction)** và **Thanh toán đảm bảo (Escrow Payment)**. Dự án giải quyết triệt để vấn nạn lừa đảo, "bom hàng", và ép giá trong thị trường mua bán đồ cũ truyền thống tại Việt Nam.

## 🌟 Tính năng nổi bật
1. **Đấu Giá Thời Gian Thực (WebSocket):** Phòng đấu giá live đếm ngược, cập nhật giá thầu ngay lập tức không cần tải lại trang. Tự động chốt đơn khi hết giờ.
2. **Thanh Toán Đảm Bảo (Escrow):** Tích hợp cổng thanh toán thực tế VNPAY. Người mua nạp tiền vào Ví. Tiền được hệ thống "Tạm giữ (Hold)" khi thanh toán đơn hàng, và chỉ "Giải phóng (Release)" cho người bán khi người mua xác nhận đã nhận hàng. Kèm hệ thống Khiếu nại (Dispute) chống lừa đảo.
3. **Chat 1-1 Real-time:** Tích hợp STOMP WebSocket xây dựng hệ thống chat với luồng chống trùng lặp tin nhắn, xoá tin nhắn một chiều, hiển thị trạng thái "Đã xem/Đã nhận" siêu mượt mà.
4. **Mua Ngay (Buy Now) an toàn:** Khóa bi quan (Pessimistic Locking) ở Backend để giải quyết bài toán Concurrency khi 2 người cùng mua một món đồ cùng 1 mili-giây.
5. **Admin Panel Toàn Diện:** Quản lý toàn bộ người dùng (Khóa/Mở khóa), sản phẩm, đơn hàng, duyệt rút tiền, xử lý khiếu nại với hệ thống tìm kiếm tự động Debounce. Thống kê bằng biểu đồ Chart sinh động.

## 🛠 Tech Stack

### 🖥 Frontend (Next.js)
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
- **State/API:** React Context API, Axios (với JWT Interceptors), SockJS & StompJS (WebSocket)
- **UI/UX:** Thiết kế Modern, Premium, Glassmorphism, Animation mượt mà.

### ⚙️ Backend (Spring Boot)
- **Framework:** Spring Boot 3, Java 17
- **Database:** PostgreSQL (Spring Data JPA, Hibernate)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Real-time:** Spring WebSocket + STOMP (RabbitMQ/In-memory Broker)
- **Architecture:** Controller-Service-Repository pattern. Trả về chuẩn DTOs chống vòng lặp (Cyclic Reference).

## 🚀 Hướng dẫn chạy dự án

### 1. Khởi động Backend (Spring Boot)
Yêu cầu: Java 17+, PostgreSQL đang chạy ở port 5432.
Tạo database `thrift_auction` trên PostgreSQL.
```bash
cd backend
./mvnw clean spring-boot:run
```
Backend sẽ chạy ở `http://localhost:8081`.

### 2. Khởi động Frontend (Next.js)
Yêu cầu: Node.js 18+
```bash
cd frontend
npm install
npm run dev
```
Frontend sẽ chạy ở `http://localhost:3000`.

## 📁 Cấu trúc thư mục chính
- `/backend`: Mã nguồn Spring Boot API, Entities, Services, WebSocket Config.
- `/frontend`: Mã nguồn Next.js UI, Layouts, Features Hooks, API Clients.
- `/docs`: Tài liệu kỹ thuật, AI Context để duy trì logic dự án.

## 🛡️ License
Phát triển bởi cộng đồng ThriftSwap (2026).
