# Bảo mật hệ thống

# 1. Mục tiêu

- Xác thực người dùng bằng access token và refresh token.
- Phân quyền theo role giữa người dùng và quản trị viên.
- Hash password và thông tin xác thực trước khi lưu vào database.
- Kiểm tra quyền sở hữu trước khi truy cập hoặc thay đổi tài nguyên.

# 2. Xác thực người dùng

### 2.1. Đăng ký

1. Client gửi `name`, `email` và `password` đến endpoint đăng ký.
2. Server kiểm tra dữ liệu và tính duy nhất của `name`, `email`.
3. Server hash password bằng thuật toán phù hợp, ví dụ BCrypt.
4. Server chỉ lưu password đã hash vào cột `password_hash`.
5. Không lưu password dạng rõ trong database, log hoặc response.

### 2.2. Đăng nhập

Khi thông tin đăng nhập hợp lệ, server:

1. Kiểm tra thông tin.
2. Tạo một session gắn với `user_id`.
3. Tạo access token có thời hạn ngắn, khoảng 5-10 phút.
4. Tạo refresh token có thời hạn dài hơn và lưu bản hash trong session.
5. Trả access token cho client.

## 3. Access token

Access token là JWT dùng để xác thực các request cần đăng nhập.

- JWT được **ký** bằng secret key, không mặc định được mã hóa.
- Payload chỉ nên chứa thông tin cần thiết như `sub`, `roles`, `iat` và `exp`.
- Không lưu password, refresh token hoặc dữ liệu nhạy cảm trong payload.
- Server kiểm tra chữ ký, thời gian hết hạn và các claim trước khi chấp nhận token.

Client gửi access token trong header:

```http
Authorization: Bearer <access_token>
```

Server giải mã payload sau khi xác minh chữ ký thành công, sau đó đưa thông tin user vào security context của request.

Secret key phải được cấu hình bằng biến môi trường, ví dụ `JWT_SECRET`. Server không so sánh JWT với một access token cố định trong file `.env`.

## 4. Refresh token và session

Access token hết hạn không được dùng trực tiếp để cấp token mới. Client phải gửi refresh token đến endpoint refresh:

```http
POST /api/v1/auth/refresh
```

Server thực hiện:

1. Đọc refresh token từ cookie bảo mật hoặc request phù hợp.
2. Hash refresh token nhận được và so sánh với hash trong session.
3. Kiểm tra session chưa hết hạn và chưa bị thu hồi.
4. Kiểm tra user vẫn tồn tại và đang hoạt động.
5. Thu hồi refresh token cũ nếu sử dụng cơ chế rotation.
6. Tạo access token mới và refresh token mới.

Session nên lưu các thông tin tối thiểu:

- `user_id`.
- `refresh_token`.
- `created_at`.
- `expired_at`.
- `revoked_at` nếu session đã bị thu hồi.

## 5. MiddleWare

- Đây là tầng kiểm tra Authorization và Authentication , Ratelimit bất kì request nào cũng phải qua tầng này trước khi đi đến tầng thực thi. Request không đáp ứng yêu cầu thì từ chối.
