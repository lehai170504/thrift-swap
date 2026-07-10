# ThriftSwap - AI Knowledge Base & Context

Tài liệu này dùng để lưu trữ toàn bộ ngữ cảnh (Context), quy chuẩn giao diện (UI/UX Guidelines), và luồng logic (Business Logic Flow) của dự án ThriftSwap. Khi AI bắt đầu một phiên làm việc mới, hãy đọc file này để nắm bắt hiện trạng dự án.

## 1. Kiến Trúc Hệ Thống (Architecture)
- **Backend:** Spring Boot (Cổng 8081). Phục vụ RESTful APIs tại `/api/v1/*` và WebSocket tại `/ws`.
- **Frontend:** Next.js (Cổng 3000). Dùng App Router. Gọi API thông qua `axios.ts` (đã config sẵn `baseURL` và tự đính kèm JWT Token).

## 2. Các Luồng Nghiệp Vụ Cốt Lõi (Business Logic Flows)

### A. Luồng Đấu Giá (Auction Flow)
1. User tạo sản phẩm với `sellType = AUCTION`, set `startingPrice` và thời gian kết thúc (EndTime).
2. Khi đến giờ, hệ thống mở phiên Đấu giá (`AuctionSession`).
3. Trong phòng đấu giá (`AuctionRoomPage`), Client kết nối WebSocket `/topic/auctions/{id}` để nhận giá thầu (Bids) real-time.
4. Khi đồng hồ đếm ngược về 0 (`onEnd`), Client (hoặc cronjob BE) gửi request `POST /auctions/{id}/end`.
5. Backend xác định người trả giá cao nhất -> Đóng phiên đấu giá -> Chuyển Product status sang `SOLD` -> Tạo `Order` trạng thái `PENDING_PAYMENT` cho người thắng.

### B. Luồng Thanh Toán Escrow (Escrow Hold & Release)
Đây là "linh hồn" của hệ thống, giúp chống lừa đảo 100%.
1. **Nạp tiền:** User nạp tiền (giả lập) vào Wallet (`POST /wallets/deposit`). Tiền vào `balance`.
2. **Hold (Tạm giữ):** Người thắng đấu giá hoặc người Mua Ngay vào trang Đơn Hàng -> Bấm "Thanh toán bằng ví". 
   - Tiền được trừ khỏi `balance` của người mua và cộng vào `heldBalance` (Tạm giữ) của chính người mua đó.
   - Lịch sử Transaction ghi nhận loại `ESCROW_HOLD`.
   - Trạng thái Order chuyển thành `PAID` (Đã thanh toán Escrow).
3. **Release (Nhả tiền):** Người bán giao hàng. Người mua nhận hàng thành công và bấm "Đã nhận được hàng" (`POST /orders/{id}/confirm-receipt`).
   - Tiền bị trừ khỏi `heldBalance` của người mua và cộng thẳng vào `balance` của người bán.
   - Transaction ghi nhận loại `ESCROW_RELEASE`.
   - Trạng thái Order chuyển thành `COMPLETED`.

### C. Luồng Chat Real-time (Messenger-style)
Hệ thống chat 1-1 theo thời gian thực hoạt động hoàn toàn qua STOMP WebSocket.
1. **Gửi tin nhắn:** Frontend push lên `/app/chat.sendMessage`. Backend bắt tại `@MessageMapping`, lưu DB, và gửi broadcast tới `receiver` và `sender` qua `/user/queue/messages`.
2. **Double Message Prevention:** Vì frontend có 2 component (GlobalChatWidget và ChatPage) cùng subscribe chung 1 kênh, cache React Query phải áp dụng thuật toán deduplicate (khử trùng lặp qua `timestamp`, `content` và `senderUsername`).
3. **Read Receipts (Đã xem/Đã gửi):** 
   - `ChatMessage` mặc định có trường `isRead = false`.
   - Lưu ý Java/Lombok + Jackson: Field `boolean isRead` sẽ bị serialize thành JSON `{"read": false}`. Phải dùng `@JsonProperty("isRead")` để Frontend nhận đúng.
   - Khi Receiver mở chat hoặc nhận tin nhắn khi đang mở chat, gọi `PUT /api/v1/chat/read/{username}`.
   - Backend đánh dấu `isRead = true` trong DB và gửi sự kiện STOMP `{"type": "READ_RECEIPT"}` về cho Sender.
   - Sender nhận STOMP, invalidate `chatHistory` cache -> UI nhảy ngay từ "Đã gửi" sang "Đã xem" real-time.
4. **Soft Delete (Xóa 1 phía):** Dùng cờ `deletedBySender` và `deletedByReceiver` trong DB. API Query chỉ lấy những tin nhắn mà cờ tương ứng của current user bằng `false`.

## 3. Quy Chuẩn Kỹ Thuật (Technical Guidelines)

### A. Backend Rules
- **Luôn trả về DTO:** Tuyệt đối không return Entity (như `Product`, `Order`) trực tiếp từ Controller vì sẽ dính lỗi vòng lặp JSON (StackOverflow/Cyclic Reference) do quan hệ `@ManyToOne`. Phải map qua `XResponse` (VD: `OrderResponse`).
- **Tìm User:** Trong Services, khi extract username từ Security Context (JWT), dùng `userRepository.findByEmail(username).or(() -> userRepository.findByUsername(username))` vì claims token có thể lưu email thay vì username.
- **Xử lý Đồng thời (Concurrency):** Để giải quyết bài toán "2 người cùng click Mua Ngay vào cùng 1 thời điểm", sử dụng Pessimistic Locking bằng `@Lock(LockModeType.PESSIMISTIC_WRITE)` trong `ProductRepository.findByIdForUpdate()`. Điều này đảm bảo Request thứ 2 sẽ bị chặn chờ Request 1 hoàn tất, nếu Request 1 đã đổi trạng thái thành `SOLD` thì Request 2 sẽ văng Exception, tránh double-buy.

### B. Frontend UI/UX Rules
- **Aesthetics (Thẩm mỹ):** Giao diện phải mang phong cách Modern, Premium. Không dùng màu nguyên bản (như plain red/blue) mà dùng màu HSL/Tailwind xịn (như slate, neutral, emerald, rose).
- **Icons:** Tuyệt đối không sử dụng Emoji (như ✨, 🚀, 📦) để làm icon trên giao diện Web vì thiếu tính chuyên nghiệp và render không đồng nhất trên các HĐH. Phải sử dụng thư viện icon chuyên nghiệp (như `lucide-react`) cho toàn bộ UI.
- **Trạng thái rỗng (Empty States):** Mọi danh sách (Đơn hàng, Sản phẩm) phải có giao diện "Empty State" thiết kế đẹp mắt (Kèm Icon Lucide bự, màu nhạt) khi không có dữ liệu.
- **Loading States:** Sử dụng `min-h-[60vh]` kết hợp spinner để layout không bị vỡ/giật khi chuyển trang. Không dùng text "Đang tải..." thô thiển.
- **Hình ảnh:** Nếu sản phẩm chưa có ảnh (null), luôn dùng ảnh placeholder từ Unsplash kết hợp với seed (VD: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?seed=${id}`).

### C. Clean Architecture Rules (Frontend)
- **Không bao giờ gọi `useQuery` / `useMutation` trực tiếp trong file `page.tsx` hoặc các components dùng chung.**
- Quy định các API call phải được wrap trong các Custom Hook (VD: `useGetProducts`, `useCreateOrder`) và đặt tại `src/features/[feature-name]/hooks/`.
- Nếu có component lớn, phải bóc tách (refactor) ra đặt vào `src/features/[feature-name]/components/`.
- `page.tsx` chỉ nên đóng vai trò là Controller/Container, nhận state từ custom hook và truyền xuống cho các Child Components.

## 4. Tình Trạng Hiện Tại & Việc Cần Làm (Next Steps)

### ✅ Đã hoàn thành (Backend + Frontend)
- Luồng Auth (Đăng ký/Đăng nhập), Luồng Sản phẩm, Ví điện tử (Nạp tiền).
- UI Trang Chủ, `/about`, `/escrow` (Marketing pages).
- Toàn bộ luồng Đấu giá Realtime (WebSocket), Luồng Escrow (Hold/Release) cho Đơn Hàng.
- Khóa bi quan (Pessimistic Lock) chống lỗi mua trùng đơn hàng.
- Hệ thống Thông báo (Notification Bell + STOMP WebSocket real-time, click to read, unread badge).
- Giao diện Kho hàng Người bán (`/seller/orders`) quản lý đơn cần giao.
- Nút Khiếu nại (Dispute) trên trang quản lý đơn hàng.
- Live Search Dropdown trên `AppHeader`.
- Tự động attach token vào `axios.ts` interceptor để xử lý lỗi 403.
- Xử lý Khiếu nại & Admin Panel (Dashboard `/admin/disputes` cho Admin phán quyết hoàn tiền/giao tiền).
- Hồ sơ người dùng & Chỉnh sửa (Profile Modal). Có thể xem và cập nhật Họ tên, SĐT, Địa chỉ.
  - Cập nhật mã vận đơn (API ship order và UI).
  - Đánh giá & Uy tín (Review API).
  - **[PHIÊN 2026-07-05]** Toàn bộ hạ tầng Admin Panel – chi tiết xem Mục 5.
  - **[PHIÊN 2026-07-06]** Ban/Unban User + Review UI hoàn chỉnh.
  - **[PHIÊN 2026-07-06 (Chat)]** Xây dựng hạ tầng Chat Real-time chuẩn Messenger: Soft Delete 1 chiều, STOMP WebSockets cho luồng chat và Read Receipts (Đã xem/Đã gửi), khử trùng lặp cache.
  - **[PHIÊN 2026-07-06 (Thanh toán)]** Đã tích hợp cổng thanh toán thực tế VNPAY cho luồng nạp tiền vào ví.
  - **[PHIÊN 2026-07-06 (Hoàn thiện Admin)]** 
    - Tối ưu hiệu năng Admin (Debounce search 500ms, `keepPreviousData` chống giật lag).
    - Hoàn thiện Trang Dashboard thống kê (AreaChart doanh thu, BarChart đơn hàng lấy API thật từ BE).
    - Hoàn thiện `AdminProductsPage`: Quản lý, tìm kiếm toàn bộ sản phẩm và xóa sản phẩm vi phạm.
    - Sửa các lỗi UI của `DropdownMenuTrigger` trong `@base-ui/react`.
  - **[PHIÊN 2026-07-07 (Auth & Security)]** 
    - Nâng cấp giao diện Đăng nhập/Đăng ký sang dạng Split-screen sang trọng, hiện đại.
    - Triển khai hệ thống **Refresh Token**: Thời hạn Access Token còn 15 phút (bảo mật cao), tích hợp Axios Interceptor tự động catch lỗi 401 để gọi ngầm cấp lại token mà không văng ứng dụng.
    - Xây dựng **Quên & Khôi phục mật khẩu**: Tích hợp `spring-boot-starter-mail` gửi OTP qua email, thiết lập 2 trang `/forgot-password` và `/reset-password`. Backend chặn việc đổi mật khẩu mới trùng với mật khẩu cũ.
    - Xây dựng **Đổi mật khẩu trong Profile**: Refactor giao diện `/profile` thành 2 Tabs (Thông tin chung & Đổi mật khẩu) xịn xò. Validate cả ở Frontend và Backend chặn việc người dùng đặt lại mật khẩu cũ.
    - Xây dựng **Quản lý & Sửa Sản Phẩm (Kho hàng Seller)**: Trang `/seller/products` cho phép người bán xem, tìm kiếm, xóa và **Sửa** (Edit) thông tin sản phẩm. Có logic Backend chặn không cho phép sửa thông tin nếu đó là phiên Đấu Giá (AUCTION) đã có lượt bid.
    - **[PHIÊN 2026-07-07 (Tạm hoãn PayOS)]**: Đã phát triển hoàn thiện tính năng thanh toán thực tế PayOS, tuy nhiên do User chưa có tài khoản ngân hàng để cấp API Key nên đã **Rollback PayOS** và giữ lại bản **VNPay Test** để tiếp tục quá trình phát triển. Việc tích hợp PayOS sẽ được thực hiện sau.
  - **[PHIÊN 2026-07-07 (AI Generative)]**
    - Tích hợp **Google Gemini API** (`gemini-1.5-flash`) vào Backend: Thêm `spring-boot-starter-webflux`, tạo `AiConfig.java`, `AiService.java` và `AiController.java`.
    - Endpoint `POST /api/v1/ai/generate-description`: Nhận `productName` + `condition`, trả về mô tả sản phẩm hấp dẫn do AI sinh ra.
    - Endpoint `POST /api/v1/ai/suggest-price`: Nhận `productName` + `condition`, trả về gợi ý mức giá khởi điểm phù hợp.
    - Tích hợp vào cả 2 form Frontend: `CreateProductForm.tsx` và `EditProductForm.tsx`. Thêm 2 nút sử dụng icon `Sparkles` từ `lucide-react` (không dùng emoji) cạnh Label của ô Mô tả và Giá khởi điểm.
  - **[PHIÊN 2026-07-10 (AI Provider Switch)]**
    - Chuyển đổi API cung cấp AI từ **Google Gemini** sang **Groq API** do Gemini giới hạn Rate Limit cực kỳ gắt gao.
    - Chỉnh sửa `AiService.java` và `application.yml` theo chuẩn giao tiếp OpenAI (`messages`, `role`, `content`).
    - Sử dụng model `llama-3.1-8b-instant` của Meta thông qua GroqCloud giúp tăng tốc độ phản hồi lên gấp nhiều lần.
  - **[PHIÊN 2026-07-09 (Live Auction & Agora)]**
    - Xây dựng toàn bộ hệ thống API và WebSockets (`LiveSessionController`, `LiveSessionChatController`, `useLiveSocket.ts`) quản lý phiên Live.
    - Tích hợp thành công **SDK Agora RTC (`agora-rtc-react`)** với Authentication Mechanism là **App ID (Testing Mode)**. Đã xử lý lỗi xin quyền Camera (`NotReadableError: Device in use`) bằng cách giới hạn quyền publish cho Host, còn Audience chỉ làm viewer.
    - Xây dựng giao diện Split-screen hiện đại tại route `/auctions/[id]/live`, gộp chung Video Streaming (trái), Live Chat Real-time và Khung đặt giá `useAuctionSocket` (phải).
    - Đồng bộ tham số giữa Frontend và Backend: Chuyển toàn bộ identifier trong Live APIs từ `auctionSessionId` sang `productId` (`findByProductId`) để Frontend lấy dữ liệu dễ dàng hơn từ object `product`.
  - **[PHIÊN 2026-07-10 (Fix Auth & Checkout Refactor)]**
    - Đã cấp quyền Public (`permitAll`) cho các endpoints GET (`/products`, `/categories`, `/auctions`) trong Spring Security để Guest (Khách) có thể xem trang thoải mái mà không bị văng về Login (401 Redirect).
    - Tối ưu lại Component nhập Thông tin giao hàng (Họ tên, SĐT, Địa chỉ, Map) thành `ShippingInfoForm` dùng chung cho `ProfilePage` và `MissingInfoModal`.
    - Bắt buộc cập nhật Thông tin giao hàng tại các chốt kiểm soát giao dịch: "Mua ngay", "Đặt giá" (trong phòng Live), và "Đăng tin". Nếu thiếu sẽ hiển thị popup điền và tự động thực hiện tiếp hành động (`pendingAction`) sau khi lưu thành công.
- **Hoàn thành hệ thống Social Commerce (Ngày 10/07/2026):**
    - Tích hợp tính năng Theo dõi (Follow) gian hàng.
    - Gửi thông báo Real-time STOMP (Rung chuông + Popup) ngay khi Seller đăng bán sản phẩm mới hoặc khi có người ấn theo dõi.
    - Bổ sung Popup Danh sách người theo dõi (Followers) hiển thị Avatar, Username tại trang cá nhân và trang của người bán, giống thiết kế của Instagram.
    - Cập nhật Badge "Gian hàng uy tín" dựa trên điểm đánh giá trung bình.
  - **[PHIÊN 2026-07-10 (Logistics & GHN API)]**
    - Tích hợp thành công API Giao Hàng Nhanh (GHN Sandbox) tạo luồng vận chuyển hoàn toàn tự động.
    - Tự động sinh Mã vận đơn (Tracking Code) khi người mua thanh toán tiền vào ví Escrow (Trạng thái `PAID`).
    - Xây dựng cổng Webhook `/api/v1/webhooks/ghn` (Public) để lắng nghe sự kiện từ tài xế GHN. Tự động chuyển trạng thái đơn hàng sang `SHIPPED` (Đang giao) và `DELIVERED` (Đã giao hàng).
    - Cập nhật UI hiển thị huy hiệu `DELIVERED` (Đã giao hàng) và điều chỉnh lại nút bấm (Chỉ cho phép Xác nhận/Khiếu nại khi đã thanh toán, đang giao hoặc đã giao xong).

### 🚧 Cần làm tiếp theo (Ưu tiên cao → thấp)

#### 2. Chống phá giá & Lừa đảo nâng cao (Anti-Abuse)
- **Xác thực SĐT / Cọc tiền:** Yêu cầu xác thực tài khoản hoặc hold cọc trong ví trước khi tham gia đấu giá để chống clone phá giá.

#### 4. Tích hợp PayOS (Khi có tài khoản ngân hàng)
- Đăng ký tài khoản MB Bank, lấy API Key từ PayOS Dashboard và bỏ vào `.env` để test thanh toán thực tế.

#### 5. Tính năng Vouchers (Chống Spam/Abuse)
- Thiết kế cơ chế giới hạn số lượng sử dụng Voucher (Long-term anti-spam) để tránh việc user lạm dụng spam.

#### 6. Hoàn thiện các tính năng nâng cao (Tùy chọn)
- Triển khai Global Search (Command Palette) nâng cao bằng phím tắt `Ctrl + K`.
- AI Gợi ý sản phẩm (Recommendation) dựa trên lịch sử duyệt web của người dùng.
- Trang bị thêm Skeleton Loading thay thế cho spinner hiện tại.

---

## 5. Hạ Tầng Admin Panel (Admin Infrastructure) – Cập nhật phiên 2026-07-05

### Kiến Trúc Routing Admin

| Route | Vai trò | Ghi chú |
|---|---|---|
| `/admin/login` | Trang đăng nhập Admin độc lập | Không có Sidebar; chỉ tài khoản ROLE=ADMIN mới vào được |
| `/admin` | Dashboard tổng quan | Hiển thị: Tổng Users, Tổng Orders, Pending Withdrawals, Tổng Escrow đang giữ |
| `/admin/users` | Quản lý người dùng | Chỉ hiển thị User (ẩn Admin), có nút Khóa/Kích hoạt (UI) |
| `/admin/orders` | Quản lý đơn hàng toàn hệ thống | Xem trạng thái, bộ lọc theo page |
| `/admin/withdrawals` | Duyệt lệnh rút tiền | Approve / Reject |
| `/admin/disputes` | Xử lý khiếu nại | Phán quyết hoàn tiền / chuyển tiền cho Seller |

### Cấu trúc Component Admin (Frontend)
```
src/components/admin/
├── AdminSidebar.tsx   – Sidebar cố định bên trái, light mode, active state dùng text-primary
├── AdminHeader.tsx    – Header cố định bên trên, có Search, Bell, Avatar, Logout
└── AdminFooter.tsx    – Footer copyright đơn giản
```

### Layout Pattern (layout.tsx)
- Dùng `h-screen overflow-hidden` ở root để toàn trang không scroll.
- Dùng `flex-1 overflow-y-auto` ở `<main>` để **chỉ vùng nội dung cuộn**, sidebar và header đứng yên.
- Route `/admin/login` được render riêng, không có Sidebar/Header.
- Auth Guard: Nếu chưa đăng nhập → redirect về `/admin/login`. Nếu đã đăng nhập nhưng role không phải ADMIN → redirect về `/`.

### Quy Chuẩn UI Admin
- **Theme:** Light mode hoàn toàn (`bg-white`, `border-neutral-100`), nhất quán với giao diện User.
- **Active state Sidebar:** `bg-primary/10 text-primary font-bold` (không dùng nền tối).
- **Table không có scrollbar ngang:** Dùng `table-fixed` + `<colgroup>` để chia tỉ lệ cột cố định, không dùng `overflow-x-auto`.
- **DropdownMenu:** Dùng `@base-ui/react` (không phải Radix), `DropdownMenuTrigger` **không hỗ trợ prop `asChild`**. Phải style trực tiếp bằng `className`.

### API Mới Thêm (Backend)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/admin/withdrawals/total-escrow` | Trả về tổng `heldBalance` của toàn hệ thống |
| GET | `/api/v1/users?page=&size=` | Chỉ trả về User (role ≠ ADMIN), dùng `findByRoleNot(Role.ADMIN, pageable)` |

### Luồng Đăng Nhập Admin
1. Truy cập `/admin/login` → Form Email/Password.
2. Gọi API login, nếu role trả về **không phải ADMIN** → toast lỗi, dừng.
3. Nếu ADMIN → `login(data)` → `AuthContext` redirect về `/admin`.
4. `AuthContext` có guard: bất kỳ user ADMIN nào cố truy cập `/` hoặc `/products` đều bị redirect ngược về `/admin`.
