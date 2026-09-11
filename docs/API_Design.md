# API Specification

## 1. Thông tin chung

- **Base URL:** `/api/v1`
- **Định dạng:** JSON
- **Content-Type:** `application/json`
  Các endpoint yêu cầu đăng nhập sử dụng header:

```http
Authorization: Bearer <access_token>
```

## 2. Quy ước phản hồi

    Mọi phản hồi đều dưới dạng json.

### Thành công

```json
{
    "data": {},
    "message": "Success"
}
```

### Lỗi

```json
{
    "error": "VALIDATION_ERROR",
    "message": "Request data is invalid",
    "timestamp": "2026-08-21T10:00:00Z",
    "path": "/api/v1/auth/register"
}
```

Các mã HTTP sử dụng:

| Mã    | Ý nghĩa                                             |
| ----- | --------------------------------------------------- |
| `200` | Yêu cầu thành công.                                 |
| `201` | Tạo tài nguyên thành công.                          |
| `204` | Xử lý thành công, không có nội dung trả về.         |
| `400` | Dữ liệu gửi lên không hợp lệ.                       |
| `401` | Chưa xác thực hoặc thông tin xác thực không hợp lệ. |
| `403` | Không có quyền thực hiện thao tác.                  |
| `404` | Không tìm thấy tài nguyên.                          |
| `409` | Dữ liệu bị trùng hoặc xung đột.                     |
| `500` | Lỗi hệ thống.                                       |

## 3. Xác thực tài khoản

### Đăng ký

```http
POST /api/v1/auth/register
```

**Request body:**

```json
{
    "name": "nguyen.van.a",
    "email": "a@example.com",
    "password": "StrongPassword123!"
}
```

**Response `201 Created`:**

```json
{
    "data": {},
    "message": "Account created"
}
```

### Đăng nhập

```http
POST /api/v1/auth/login
```

**Request body:**

```json
{
    "email": "a@example.com",
    "password": "StrongPassword123!"
}
```

**Response `200 OK`:**

```json
{
    "data": {
        "accessToken": "<access_token>",
        "expiresAt": "2026-08-22T10:00:00Z"
    },
    "message": "Login successful"
}
```

### Đăng xuất

```http
POST /api/v1/auth/logout
```

Yêu cầu `Authorization`. Hệ thống hủy session hoặc access token hiện tại.
