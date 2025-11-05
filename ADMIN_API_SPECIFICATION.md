# 📘 ADMIN PANEL API SPECIFICATION

**Version:** 1.0  
**Last Updated:** November 3, 2025  
**Base URL:** `http://localhost:3000` (Development)

---

## 🔐 AUTHENTICATION

### Overview
Tất cả API endpoints của Admin Panel yêu cầu:
- **Authentication:** Bearer Token (JWT)
- **Authorization:** Role = `ADMIN`

### Headers Required
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Authentication Flow
```
1. Admin login → Nhận access_token + refresh_token
2. Mỗi request gửi kèm access_token trong header
3. Nếu access_token hết hạn → Dùng refresh_token để lấy token mới
4. Backend verify token + check role === 'ADMIN'
```

---

## 📊 RESPONSE FORMAT

### Success Response
```json
{
  "status": 200,
  "message": "Thành công",
  "data": {
    // ... response data
  }
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Mô tả lỗi",
  "error": {
    "code": "ERROR_CODE",
    "details": "Chi tiết lỗi (nếu có)"
  }
}
```

### Common HTTP Status Codes
| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo mới thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập / Token hết hạn |
| 403 | Forbidden | Không có quyền (not ADMIN) |
| 404 | Not Found | Không tìm thấy resource |
| 500 | Server Error | Lỗi server |

---

## 🗂️ API ENDPOINTS

### Table of Contents
1. [Authentication](#1-authentication) (3 endpoints)
2. [Dashboard Statistics](#2-dashboard-statistics) (3 endpoints)
3. [Users Management](#3-users-management) (6 endpoints)
4. [Companies Management](#4-companies-management) (8 endpoints)
5. [Career Paths Management](#5-career-paths-management) (9 endpoints)
6. [Blogs Management](#6-blogs-management) (7 endpoints)
7. [Reports](#7-reports) (4 endpoints)
8. [Settings - Locations](#8-settings---locations) (4 endpoints)

**Total:** 44 endpoints

---

## 1. AUTHENTICATION

### 1.1. Admin Login

**Endpoint:** `POST /auth/login`  
**Auth Required:** No  
**Description:** Admin đăng nhập vào hệ thống

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-admin-1",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": "ADMIN",
      "isActive": true
    }
  }
}
```

**Error (401):**
```json
{
  "status": 401,
  "message": "Sai tên đăng nhập hoặc mật khẩu"
}
```

---

### 1.2. Refresh Token

**Endpoint:** `POST /auth/refresh-token`  
**Auth Required:** No  
**Description:** Lấy access token mới khi token cũ hết hạn

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Refresh token thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3. Logout

**Endpoint:** `POST /auth/logout`  
**Auth Required:** Yes  
**Description:** Admin đăng xuất (xóa refresh token)

**Response (200):**
```json
{
  "status": 200,
  "message": "Đăng xuất thành công"
}
```

---

## 2. DASHBOARD STATISTICS

### 2.1. Get Overview Statistics

**Endpoint:** `GET /admin/statistics/overview`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy số liệu tổng quan cho Dashboard

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy thống kê thành công",
  "data": {
    "totalUsers": 1234,
    "totalStudents": 1189,
    "totalCompanies": 45,
    "totalAdmins": 3,
    "activeGroups": 28,
    "totalBlogs": 567,
    "pendingApprovals": {
      "companies": 8,
      "blogs": 15
    },
    "growth": {
      "users": {
        "value": 12.5,
        "trend": "up"
      },
      "companies": {
        "value": 8.3,
        "trend": "up"
      }
    }
  }
}
```

---

### 2.2. Get Users Growth

**Endpoint:** `GET /admin/statistics/users-growth`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy dữ liệu tăng trưởng users theo tháng (cho Line Chart)

**Query Params:**
- `months` (optional): Số tháng lấy dữ liệu (default: 12)

**Example:** `GET /admin/statistics/users-growth?months=6`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy dữ liệu thành công",
  "data": {
    "labels": ["2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10"],
    "datasets": [
      {
        "label": "Students",
        "data": [120, 185, 245, 312, 389, 456]
      },
      {
        "label": "Companies",
        "data": [5, 8, 12, 18, 25, 32]
      }
    ]
  }
}
```

---

### 2.3. Get Activity Stats

**Endpoint:** `GET /admin/statistics/activities`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy hoạt động gần đây trong hệ thống

**Query Params:**
- `limit` (optional): Số lượng activities (default: 20)

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy hoạt động thành công",
  "data": [
    {
      "id": "activity-1",
      "type": "COMPANY_REGISTERED",
      "actor": {
        "id": "company-uuid-1",
        "name": "FPT Software"
      },
      "description": "Công ty mới đăng ký",
      "timestamp": "2025-11-03T10:30:00Z"
    },
    {
      "id": "activity-2",
      "type": "BLOG_PUBLISHED",
      "actor": {
        "id": "user-uuid-1",
        "name": "Nguyễn Văn A"
      },
      "description": "Đăng bài viết mới: 'Backend Development Guide'",
      "timestamp": "2025-11-03T09:15:00Z"
    },
    {
      "id": "activity-3",
      "type": "TEST_COMPLETED",
      "actor": {
        "id": "student-uuid-1",
        "name": "Trần Thị B"
      },
      "description": "Hoàn thành test 'Node.js Fundamentals' với điểm 85",
      "timestamp": "2025-11-03T08:45:00Z"
    }
  ]
}
```

---

## 3. USERS MANAGEMENT

### 3.1. Get All Users (with filters)

**Endpoint:** `GET /admin/users`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách users với search, filter, pagination

**Query Params:**
- `search` (optional): Tìm kiếm theo username, email, fullName
- `role` (optional): Filter theo role (`STUDENT`, `COMPANY`, `ADMIN`)
- `isActive` (optional): Filter theo trạng thái (`true`, `false`)
- `verifyStatus` (optional): Filter theo verify status (`VERIFIED`, `UNVERIFIED`, `INVALID`)
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items/trang (default: 10)
- `sortBy` (optional): Sắp xếp theo field (default: `createdDate`)
- `sortOrder` (optional): `asc` hoặc `desc` (default: `desc`)

**Example:** `GET /admin/users?role=STUDENT&isActive=true&page=1&limit=20`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách users thành công",
  "data": {
    "users": [
      {
        "id": "uuid-1",
        "username": "student001",
        "email": "student001@gmail.com",
        "fullName": "Nguyễn Văn A",
        "role": "STUDENT",
        "isActive": true,
        "verifyStatus": "VERIFIED",
        "createdDate": "2025-09-01T00:00:00Z",
        "lastLogin": "2025-11-03T10:00:00Z"
      },
      {
        "id": "uuid-2",
        "username": "fpt_software",
        "email": "contact@fpt.com.vn",
        "fullName": "FPT Software",
        "role": "COMPANY",
        "isActive": true,
        "verifyStatus": "VERIFIED",
        "createdDate": "2025-10-15T00:00:00Z",
        "lastLogin": "2025-11-02T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalItems": 1000,
      "itemsPerPage": 20
    }
  }
}
```

---

### 3.2. Get User by ID

**Endpoint:** `GET /admin/users/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy chi tiết user kèm lịch sử hoạt động

**Example:** `GET /admin/users/uuid-1`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy chi tiết user thành công",
  "data": {
    "user": {
      "id": "uuid-1",
      "username": "student001",
      "email": "student001@gmail.com",
      "fullName": "Nguyễn Văn A",
      "role": "STUDENT",
      "isActive": true,
      "verifyStatus": "VERIFIED",
      "createdDate": "2025-09-01T00:00:00Z",
      "lastLogin": "2025-11-03T10:00:00Z"
    },
    "profile": {
      "studentId": "student-profile-1",
      "university": "HCMUT",
      "major": "Computer Science",
      "graduationYear": 2026,
      "careerInterest": "Backend Development"
    },
    "stats": {
      "testsTaken": 12,
      "avgScore": 78.5,
      "careerPathsJoined": 3,
      "blogsPosted": 5
    },
    "activityHistory": [
      {
        "action": "COMPLETED_TEST",
        "description": "Hoàn thành test 'Node.js Fundamentals'",
        "timestamp": "2025-11-03T08:45:00Z"
      },
      {
        "action": "JOINED_PATH",
        "description": "Tham gia lộ trình 'Backend Development'",
        "timestamp": "2025-11-02T15:20:00Z"
      }
    ]
  }
}
```

---

### 3.3. Update User

**Endpoint:** `PUT /admin/users/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Cập nhật thông tin user

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A (Updated)",
  "email": "newemail@gmail.com",
  "isActive": true,
  "verifyStatus": "VERIFIED"
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Cập nhật user thành công",
  "data": {
    "id": "uuid-1",
    "username": "student001",
    "email": "newemail@gmail.com",
    "fullName": "Nguyễn Văn A (Updated)",
    "role": "STUDENT",
    "isActive": true,
    "verifyStatus": "VERIFIED"
  }
}
```

---

### 3.4. Toggle Active Status

**Endpoint:** `PUT /admin/users/:id/toggle-active`  
**Auth Required:** Yes (ADMIN)  
**Description:** Khóa/Kích hoạt tài khoản user

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Vi phạm nội quy" 
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Đã khóa tài khoản user",
  "data": {
    "id": "uuid-1",
    "username": "student001",
    "isActive": false
  }
}
```

---

### 3.5. Verify User (Manual)

**Endpoint:** `PUT /admin/users/:id/verify`  
**Auth Required:** Yes (ADMIN)  
**Description:** Admin verify user thủ công

**Request Body:**
```json
{
  "verifyStatus": "VERIFIED"
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Xác thực user thành công",
  "data": {
    "id": "uuid-1",
    "verifyStatus": "VERIFIED"
  }
}
```

---

### 3.6. Delete User

**Endpoint:** `DELETE /admin/users/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa user (soft delete)

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa user thành công"
}
```

---

## 4. COMPANIES MANAGEMENT

### 4.1. Get All Companies (with filters)

**Endpoint:** `GET /admin/companies`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách companies với filter theo status

**Query Params:**
- `status` (optional): `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`
- `search` (optional): Tìm kiếm theo tên công ty
- `industry` (optional): Filter theo ngành
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Items/trang (default: 10)

**Example:** `GET /admin/companies?status=PENDING&page=1&limit=20`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách công ty thành công",
  "data": {
    "companies": [
      {
        "id": "company-uuid-1",
        "userId": "user-uuid-1",
        "companyName": "FPT Software",
        "industry": "IT Services",
        "website": "https://fpt.com.vn",
        "description": "Leading IT company in Vietnam",
        "status": "PENDING",
        "registeredDate": "2025-11-01T00:00:00Z",
        "stats": {
          "careerPathsCount": 0,
          "testsCount": 0,
          "studentsReached": 0
        }
      },
      {
        "id": "company-uuid-2",
        "userId": "user-uuid-2",
        "companyName": "Viettel Solutions",
        "industry": "Telecommunications",
        "website": "https://viettelsolutions.vn",
        "description": "Digital transformation solutions",
        "status": "APPROVED",
        "registeredDate": "2025-10-15T00:00:00Z",
        "approvedDate": "2025-10-16T10:00:00Z",
        "stats": {
          "careerPathsCount": 5,
          "testsCount": 12,
          "studentsReached": 234
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20
    }
  }
}
```

---

### 4.2. Get Company by ID

**Endpoint:** `GET /admin/companies/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy chi tiết công ty kèm giấy phép, lộ trình, tests

**Example:** `GET /admin/companies/company-uuid-1`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy chi tiết công ty thành công",
  "data": {
    "company": {
      "id": "company-uuid-1",
      "userId": "user-uuid-1",
      "companyId": "COMPANY001",
      "companyName": "FPT Software",
      "industry": "IT Services",
      "website": "https://fpt.com.vn",
      "description": "Leading IT company in Vietnam",
      "status": "PENDING",
      "registeredDate": "2025-11-01T00:00:00Z",
      "contactEmail": "contact@fpt.com.vn",
      "contactPhone": "+84 123 456 789",
      "address": "Hanoi, Vietnam"
    },
    "documents": {
      "businessLicense": "https://cloudinary.com/company-docs/license-1.pdf",
      "taxCode": "0123456789"
    },
    "stats": {
      "careerPathsCount": 0,
      "testsCount": 0,
      "studentsReached": 0,
      "avgTestScore": 0
    }
  }
}
```

---

### 4.3. Approve Company

**Endpoint:** `PUT /admin/companies/:id/approve`  
**Auth Required:** Yes (ADMIN)  
**Description:** Phê duyệt công ty đăng ký

**Response (200):**
```json
{
  "status": 200,
  "message": "Phê duyệt công ty thành công",
  "data": {
    "id": "company-uuid-1",
    "companyName": "FPT Software",
    "status": "APPROVED",
    "approvedBy": "admin-uuid-1",
    "approvedDate": "2025-11-03T10:30:00Z"
  }
}
```

**Note:** Backend nên:
- Gửi email thông báo cho company
- Tạo notification trong hệ thống
- Log action vào activity history

---

### 4.4. Reject Company

**Endpoint:** `PUT /admin/companies/:id/reject`  
**Auth Required:** Yes (ADMIN)  
**Description:** Từ chối công ty đăng ký (kèm lý do)

**Request Body:**
```json
{
  "reason": "Giấy phép kinh doanh không hợp lệ"
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Từ chối công ty thành công",
  "data": {
    "id": "company-uuid-1",
    "companyName": "FPT Software",
    "status": "REJECTED",
    "rejectedBy": "admin-uuid-1",
    "rejectedDate": "2025-11-03T10:30:00Z",
    "reason": "Giấy phép kinh doanh không hợp lệ"
  }
}
```

---

### 4.5. Suspend Company

**Endpoint:** `PUT /admin/companies/:id/suspend`  
**Auth Required:** Yes (ADMIN)  
**Description:** Tạm khóa công ty (nếu vi phạm)

**Request Body:**
```json
{
  "reason": "Vi phạm chính sách nội dung",
  "duration": 30
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Tạm khóa công ty thành công",
  "data": {
    "id": "company-uuid-1",
    "status": "SUSPENDED",
    "suspendedUntil": "2025-12-03T00:00:00Z"
  }
}
```

---

### 4.6. Get Company Career Paths

**Endpoint:** `GET /admin/companies/:id/career-paths`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách lộ trình của công ty

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách lộ trình thành công",
  "data": {
    "careerPaths": [
      {
        "id": "path-uuid-1",
        "title": "Backend Development Path",
        "description": "Learn Node.js, databases, APIs",
        "studentsCount": 234,
        "lessonsCount": 15,
        "testsCount": 8,
        "createdDate": "2025-10-20T00:00:00Z"
      }
    ]
  }
}
```

---

### 4.7. Get Company Tests

**Endpoint:** `GET /admin/companies/:id/tests`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách tests/challenges của công ty

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách tests thành công",
  "data": {
    "tests": [
      {
        "id": "test-uuid-1",
        "title": "Node.js Fundamentals",
        "careerPathId": "path-uuid-1",
        "careerPathTitle": "Backend Development",
        "difficulty": "MEDIUM",
        "submissionsCount": 156,
        "avgScore": 72.5,
        "createdDate": "2025-10-25T00:00:00Z"
      }
    ]
  }
}
```

---

### 4.8. Delete Company

**Endpoint:** `DELETE /admin/companies/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa công ty (soft delete)

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa công ty thành công"
}
```

---

## 5. CAREER PATHS MANAGEMENT

### 5.1. Get All Career Paths

**Endpoint:** `GET /admin/career-paths`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách tất cả lộ trình nghề nghiệp

**Query Params:**
- `companyId` (optional): Filter theo công ty
- `search` (optional): Tìm kiếm theo title
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Items/trang (default: 10)

**Example:** `GET /admin/career-paths?companyId=company-uuid-1`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách lộ trình thành công",
  "data": {
    "careerPaths": [
      {
        "id": "path-uuid-1",
        "title": "Backend Development Path",
        "description": "Học Node.js, databases, REST APIs, microservices",
        "companyId": "company-uuid-1",
        "companyName": "FPT Software",
        "studentsCount": 234,
        "lessonsCount": 15,
        "testsCount": 8,
        "createdDate": "2025-10-15T00:00:00Z"
      },
      {
        "id": "path-uuid-2",
        "title": "Frontend Development Path",
        "description": "Học React, Vue, Angular, UI/UX",
        "companyId": "company-uuid-1",
        "companyName": "FPT Software",
        "studentsCount": 189,
        "lessonsCount": 12,
        "testsCount": 6,
        "createdDate": "2025-10-18T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28,
      "itemsPerPage": 10
    }
  }
}
```

---

### 5.2. Get Career Path by ID

**Endpoint:** `GET /admin/career-paths/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy chi tiết lộ trình (info, lessons, tests, students)

**Example:** `GET /admin/career-paths/path-uuid-1`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy chi tiết lộ trình thành công",
  "data": {
    "careerPath": {
      "id": "path-uuid-1",
      "title": "Backend Development Path",
      "description": "Học Node.js, databases, REST APIs...",
      "companyId": "company-uuid-1",
      "companyName": "FPT Software",
      "createdDate": "2025-10-15T00:00:00Z",
      "updatedDate": "2025-10-20T00:00:00Z"
    },
    "stats": {
      "studentsCount": 234,
      "lessonsCount": 15,
      "testsCount": 8,
      "avgCompletionRate": 68.5,
      "avgTestScore": 75.2
    }
  }
}
```

---

### 5.3. Get Lessons in Career Path

**Endpoint:** `GET /admin/career-paths/:id/lessons`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách bài học trong lộ trình

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách bài học thành công",
  "data": {
    "lessons": [
      {
        "id": "lesson-uuid-1",
        "title": "Introduction to Node.js",
        "content": "Node.js là runtime environment...",
        "order": 1,
        "duration": 45,
        "createdDate": "2025-10-15T00:00:00Z"
      },
      {
        "id": "lesson-uuid-2",
        "title": "Express.js Basics",
        "content": "Express là framework...",
        "order": 2,
        "duration": 60,
        "createdDate": "2025-10-16T00:00:00Z"
      }
    ]
  }
}
```

---

### 5.4. Get Tests in Career Path

**Endpoint:** `GET /admin/career-paths/:id/tests`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách tests/challenges trong lộ trình

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách tests thành công",
  "data": {
    "tests": [
      {
        "id": "test-uuid-1",
        "title": "Node.js Fundamentals Quiz",
        "difficulty": "EASY",
        "duration": 30,
        "questionsCount": 20,
        "submissionsCount": 156,
        "avgScore": 78.5,
        "createdDate": "2025-10-17T00:00:00Z"
      },
      {
        "id": "test-uuid-2",
        "title": "Build REST API Challenge",
        "difficulty": "MEDIUM",
        "duration": 120,
        "questionsCount": 5,
        "submissionsCount": 89,
        "avgScore": 65.3,
        "createdDate": "2025-10-20T00:00:00Z"
      }
    ]
  }
}
```

---

### 5.5. Get Students in Career Path

**Endpoint:** `GET /admin/career-paths/:id/students`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách sinh viên tham gia lộ trình

**Query Params:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Items/trang (default: 20)

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách sinh viên thành công",
  "data": {
    "students": [
      {
        "id": "student-uuid-1",
        "userId": "user-uuid-1",
        "fullName": "Nguyễn Văn A",
        "email": "student001@gmail.com",
        "university": "HCMUT",
        "major": "Computer Science",
        "enrolledDate": "2025-10-16T00:00:00Z",
        "progress": {
          "completedLessons": 8,
          "totalLessons": 15,
          "completedTests": 3,
          "totalTests": 8,
          "avgTestScore": 82.5
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 12,
      "totalItems": 234,
      "itemsPerPage": 20
    }
  }
}
```

---

### 5.6. Add Students to Career Path

**Endpoint:** `POST /admin/career-paths/:id/students`  
**Auth Required:** Yes (ADMIN)  
**Description:** Thêm sinh viên vào lộ trình (bulk add)

**Request Body:**
```json
{
  "studentIds": [
    "student-uuid-1",
    "student-uuid-2",
    "student-uuid-3"
  ]
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Thêm sinh viên thành công",
  "data": {
    "addedCount": 3,
    "failedCount": 0,
    "results": [
      {
        "studentId": "student-uuid-1",
        "status": "success"
      },
      {
        "studentId": "student-uuid-2",
        "status": "success"
      },
      {
        "studentId": "student-uuid-3",
        "status": "success"
      }
    ]
  }
}
```

---

### 5.7. Remove Student from Career Path

**Endpoint:** `DELETE /admin/career-paths/:pathId/students/:studentId`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa sinh viên khỏi lộ trình

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa sinh viên khỏi lộ trình thành công"
}
```

---

### 5.8. Update Career Path

**Endpoint:** `PUT /admin/career-paths/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Cập nhật thông tin lộ trình

**Request Body:**
```json
{
  "title": "Backend Development Path (Updated)",
  "description": "Updated description..."
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Cập nhật lộ trình thành công",
  "data": {
    "id": "path-uuid-1",
    "title": "Backend Development Path (Updated)",
    "description": "Updated description..."
  }
}
```

---

### 5.9. Delete Career Path

**Endpoint:** `DELETE /admin/career-paths/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa lộ trình (soft delete)

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa lộ trình thành công"
}
```

**Note:** Khi xóa career path:
- Không xóa lessons/tests (giữ lại cho audit)
- Unlink students khỏi path
- Mark path là deleted

---

## 6. BLOGS MANAGEMENT

### 6.1. Get All Blogs

**Endpoint:** `GET /admin/blogs`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách blogs với filter và search

**Query Params:**
- `status` (optional): `PENDING`, `APPROVED`, `REJECTED`
- `search` (optional): Tìm kiếm theo title/content
- `authorId` (optional): Filter theo tác giả
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Items/trang (default: 10)

**Example:** `GET /admin/blogs?status=PENDING&page=1`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách blogs thành công",
  "data": {
    "blogs": [
      {
        "id": "blog-uuid-1",
        "title": "What is Backend Development?",
        "content": "Backend development involves...",
        "imageUrl": "https://cloudinary.com/blog-images/img1.jpg",
        "category": "Career Guide",
        "author": {
          "id": "user-uuid-1",
          "fullName": "Nguyễn Văn A",
          "role": "STUDENT"
        },
        "status": "PENDING",
        "createdDate": "2025-11-03T08:00:00Z",
        "stats": {
          "views": 0,
          "likes": 0,
          "comments": 0
        }
      },
      {
        "id": "blog-uuid-2",
        "title": "5 Tips for Learning React",
        "content": "React is a popular library...",
        "imageUrl": null,
        "category": "Tutorial",
        "author": {
          "id": "company-uuid-1",
          "fullName": "FPT Software",
          "role": "COMPANY"
        },
        "status": "APPROVED",
        "createdDate": "2025-11-02T10:00:00Z",
        "approvedDate": "2025-11-02T14:00:00Z",
        "stats": {
          "views": 234,
          "likes": 45,
          "comments": 12
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 57,
      "totalItems": 567,
      "itemsPerPage": 10
    }
  }
}
```

---

### 6.2. Get Blog by ID

**Endpoint:** `GET /admin/blogs/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy chi tiết blog kèm comments

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy chi tiết blog thành công",
  "data": {
    "blog": {
      "id": "blog-uuid-1",
      "title": "What is Backend Development?",
      "content": "Full content here...",
      "imageUrl": "https://cloudinary.com/blog-images/img1.jpg",
      "category": "Career Guide",
      "author": {
        "id": "user-uuid-1",
        "fullName": "Nguyễn Văn A",
        "email": "student001@gmail.com",
        "role": "STUDENT"
      },
      "status": "PENDING",
      "createdDate": "2025-11-03T08:00:00Z",
      "updatedDate": "2025-11-03T08:00:00Z"
    },
    "stats": {
      "views": 0,
      "likes": 0,
      "commentsCount": 0
    }
  }
}
```

---

### 6.3. Get Comments of Blog

**Endpoint:** `GET /admin/blogs/:id/comments`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách comments của blog

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy comments thành công",
  "data": {
    "comments": [
      {
        "id": "comment-uuid-1",
        "content": "Great article!",
        "author": {
          "id": "user-uuid-2",
          "fullName": "Trần Thị B",
          "role": "STUDENT"
        },
        "createdDate": "2025-11-03T09:00:00Z",
        "likes": 3
      },
      {
        "id": "comment-uuid-2",
        "content": "Spam content here...",
        "author": {
          "id": "user-uuid-3",
          "fullName": "Suspicious User",
          "role": "STUDENT"
        },
        "createdDate": "2025-11-03T09:30:00Z",
        "likes": 0,
        "flagged": true
      }
    ]
  }
}
```

---

### 6.4. Approve Blog

**Endpoint:** `PUT /admin/blogs/:id/approve`  
**Auth Required:** Yes (ADMIN)  
**Description:** Phê duyệt blog (Status → APPROVED)

**Response (200):**
```json
{
  "status": 200,
  "message": "Phê duyệt blog thành công",
  "data": {
    "id": "blog-uuid-1",
    "title": "What is Backend Development?",
    "status": "APPROVED",
    "approvedBy": "admin-uuid-1",
    "approvedDate": "2025-11-03T10:30:00Z"
  }
}
```

**Note:** Backend nên gửi notification cho author

---

### 6.5. Reject Blog

**Endpoint:** `PUT /admin/blogs/:id/reject`  
**Auth Required:** Yes (ADMIN)  
**Description:** Từ chối blog (Status → REJECTED) + Cảnh báo user

**Request Body:**
```json
{
  "reason": "Nội dung vi phạm chính sách cộng đồng",
  "warnUser": true
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Từ chối blog và đã cảnh báo user",
  "data": {
    "id": "blog-uuid-1",
    "status": "REJECTED",
    "rejectedBy": "admin-uuid-1",
    "rejectedDate": "2025-11-03T10:30:00Z",
    "reason": "Nội dung vi phạm chính sách cộng đồng"
  }
}
```

**Note:** 
- Nếu `warnUser: true` → Gửi email/notification cảnh báo
- Lưu warning vào user profile
- Nếu user vi phạm nhiều lần → Auto ban

---

### 6.6. Delete Blog

**Endpoint:** `DELETE /admin/blogs/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa blog vi phạm nghiêm trọng

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa blog thành công"
}
```

---

### 6.7. Delete Comment

**Endpoint:** `DELETE /admin/comments/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa comment spam/vi phạm

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa comment thành công"
}
```

---

## 7. REPORTS

### 7.1. Get Users Growth Report

**Endpoint:** `GET /admin/reports/users-growth`  
**Auth Required:** Yes (ADMIN)  
**Description:** Báo cáo tăng trưởng users theo thời gian

**Query Params:**
- `startDate` (optional): Ngày bắt đầu (ISO format)
- `endDate` (optional): Ngày kết thúc (ISO format)
- `groupBy` (optional): `day`, `week`, `month` (default: `month`)

**Example:** `GET /admin/reports/users-growth?startDate=2025-06-01&endDate=2025-11-03&groupBy=month`

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy báo cáo thành công",
  "data": {
    "period": {
      "startDate": "2025-06-01",
      "endDate": "2025-11-03",
      "groupBy": "month"
    },
    "data": [
      {
        "period": "2025-06",
        "students": 120,
        "companies": 5,
        "total": 125
      },
      {
        "period": "2025-07",
        "students": 185,
        "companies": 8,
        "total": 193
      },
      {
        "period": "2025-08",
        "students": 245,
        "companies": 12,
        "total": 257
      },
      {
        "period": "2025-09",
        "students": 312,
        "companies": 18,
        "total": 330
      },
      {
        "period": "2025-10",
        "students": 389,
        "companies": 25,
        "total": 414
      },
      {
        "period": "2025-11",
        "students": 456,
        "companies": 32,
        "total": 488
      }
    ],
    "summary": {
      "totalGrowth": 488,
      "growthRate": 290.4
    }
  }
}
```

---

### 7.2. Get Top Students Report

**Endpoint:** `GET /admin/reports/top-students`  
**Auth Required:** Yes (ADMIN)  
**Description:** Top học sinh xuất sắc (theo điểm test)

**Query Params:**
- `limit` (optional): Số lượng students (default: 10)
- `careerPathId` (optional): Filter theo lộ trình

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy báo cáo thành công",
  "data": {
    "topStudents": [
      {
        "rank": 1,
        "student": {
          "id": "student-uuid-1",
          "fullName": "Nguyễn Văn A",
          "university": "HCMUT",
          "major": "Computer Science"
        },
        "stats": {
          "testsTaken": 25,
          "avgScore": 92.5,
          "careerPathsCompleted": 3
        }
      },
      {
        "rank": 2,
        "student": {
          "id": "student-uuid-2",
          "fullName": "Trần Thị B",
          "university": "HCMUS",
          "major": "Software Engineering"
        },
        "stats": {
          "testsTaken": 23,
          "avgScore": 89.8,
          "careerPathsCompleted": 2
        }
      }
    ]
  }
}
```

---

### 7.3. Get Popular Career Paths Report

**Endpoint:** `GET /admin/reports/popular-career-paths`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lộ trình phổ biến nhất (theo số học viên)

**Query Params:**
- `limit` (optional): Số lượng paths (default: 10)

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy báo cáo thành công",
  "data": {
    "popularPaths": [
      {
        "rank": 1,
        "careerPath": {
          "id": "path-uuid-1",
          "title": "Backend Development Path",
          "companyName": "FPT Software"
        },
        "stats": {
          "studentsCount": 234,
          "avgCompletionRate": 68.5,
          "avgTestScore": 75.2
        }
      },
      {
        "rank": 2,
        "careerPath": {
          "id": "path-uuid-2",
          "title": "Frontend Development Path",
          "companyName": "FPT Software"
        },
        "stats": {
          "studentsCount": 189,
          "avgCompletionRate": 72.3,
          "avgTestScore": 78.9
        }
      }
    ]
  }
}
```

---

### 7.4. Get Flagged Content Report

**Endpoint:** `GET /admin/reports/flagged-content`  
**Auth Required:** Yes (ADMIN)  
**Description:** Nội dung bị báo cáo vi phạm

**Query Params:**
- `type` (optional): `BLOG`, `COMMENT` (default: all)
- `status` (optional): `PENDING`, `REVIEWED` (default: `PENDING`)

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy báo cáo thành công",
  "data": {
    "flaggedContent": [
      {
        "id": "flag-uuid-1",
        "type": "BLOG",
        "contentId": "blog-uuid-5",
        "contentTitle": "Suspicious Blog Title",
        "author": {
          "id": "user-uuid-5",
          "fullName": "User Name"
        },
        "reason": "Spam content",
        "reportedBy": {
          "id": "user-uuid-10",
          "fullName": "Reporter Name"
        },
        "reportedDate": "2025-11-03T08:00:00Z",
        "status": "PENDING"
      },
      {
        "id": "flag-uuid-2",
        "type": "COMMENT",
        "contentId": "comment-uuid-20",
        "contentPreview": "Toxic comment here...",
        "author": {
          "id": "user-uuid-8",
          "fullName": "Another User"
        },
        "reason": "Harassment",
        "reportedBy": {
          "id": "user-uuid-12",
          "fullName": "Reporter 2"
        },
        "reportedDate": "2025-11-03T09:30:00Z",
        "status": "PENDING"
      }
    ]
  }
}
```

---

## 8. SETTINGS - LOCATIONS

### 8.1. Get All Locations

**Endpoint:** `GET /admin/locations`  
**Auth Required:** Yes (ADMIN)  
**Description:** Lấy danh sách địa bàn

**Response (200):**
```json
{
  "status": 200,
  "message": "Lấy danh sách địa bàn thành công",
  "data": {
    "locations": [
      {
        "id": "location-uuid-1",
        "code": "HN",
        "name": "Hà Nội",
        "description": "Thủ đô Việt Nam",
        "createdDate": "2025-01-01T00:00:00Z"
      },
      {
        "id": "location-uuid-2",
        "code": "HCM",
        "name": "Hồ Chí Minh",
        "description": "Thành phố lớn nhất Việt Nam",
        "createdDate": "2025-01-01T00:00:00Z"
      },
      {
        "id": "location-uuid-3",
        "code": "DN",
        "name": "Đà Nẵng",
        "description": "Thành phố miền Trung",
        "createdDate": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### 8.2. Create Location

**Endpoint:** `POST /admin/locations`  
**Auth Required:** Yes (ADMIN)  
**Description:** Tạo địa bàn mới

**Request Body:**
```json
{
  "code": "CT",
  "name": "Cần Thơ",
  "description": "Thành phố miền Tây"
}
```

**Response (201):**
```json
{
  "status": 201,
  "message": "Tạo địa bàn thành công",
  "data": {
    "id": "location-uuid-4",
    "code": "CT",
    "name": "Cần Thơ",
    "description": "Thành phố miền Tây",
    "createdDate": "2025-11-03T10:30:00Z"
  }
}
```

---

### 8.3. Update Location

**Endpoint:** `PUT /admin/locations/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Cập nhật địa bàn

**Request Body:**
```json
{
  "name": "Cần Thơ (Updated)",
  "description": "Thành phố lớn nhất Đồng bằng sông Cửu Long"
}
```

**Response (200):**
```json
{
  "status": 200,
  "message": "Cập nhật địa bàn thành công",
  "data": {
    "id": "location-uuid-4",
    "code": "CT",
    "name": "Cần Thơ (Updated)",
    "description": "Thành phố lớn nhất Đồng bằng sông Cửu Long"
  }
}
```

---

### 8.4. Delete Location

**Endpoint:** `DELETE /admin/locations/:id`  
**Auth Required:** Yes (ADMIN)  
**Description:** Xóa địa bàn

**Response (200):**
```json
{
  "status": 200,
  "message": "Xóa địa bàn thành công"
}
```

---

## 📦 MOCK DATA SAMPLES

### Sample Users
```json
[
  {
    "id": "user-uuid-1",
    "username": "student001",
    "email": "student001@gmail.com",
    "fullName": "Nguyễn Văn A",
    "role": "STUDENT",
    "isActive": true,
    "verifyStatus": "VERIFIED",
    "createdDate": "2025-09-01T00:00:00Z"
  },
  {
    "id": "user-uuid-2",
    "username": "fpt_software",
    "email": "contact@fpt.com.vn",
    "fullName": "FPT Software",
    "role": "COMPANY",
    "isActive": true,
    "verifyStatus": "VERIFIED",
    "createdDate": "2025-10-15T00:00:00Z"
  },
  {
    "id": "user-uuid-admin",
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "ADMIN",
    "isActive": true,
    "verifyStatus": "VERIFIED",
    "createdDate": "2025-01-01T00:00:00Z"
  }
]
```

### Sample Companies
```json
[
  {
    "id": "company-uuid-1",
    "userId": "user-uuid-2",
    "companyName": "FPT Software",
    "industry": "IT Services",
    "website": "https://fpt.com.vn",
    "status": "APPROVED",
    "registeredDate": "2025-10-15T00:00:00Z"
  },
  {
    "id": "company-uuid-2",
    "userId": "user-uuid-3",
    "companyName": "Viettel Solutions",
    "industry": "Telecommunications",
    "website": "https://viettelsolutions.vn",
    "status": "PENDING",
    "registeredDate": "2025-11-01T00:00:00Z"
  }
]
```

### Sample Career Paths
```json
[
  {
    "id": "path-uuid-1",
    "title": "Backend Development Path",
    "description": "Learn Node.js, databases, APIs",
    "companyId": "company-uuid-1",
    "studentsCount": 234,
    "lessonsCount": 15,
    "testsCount": 8
  }
]
```

---

## 🔧 IMPLEMENTATION NOTES

### For Backend Developer

#### 1. **Authentication Middleware**
```javascript
// src/middlewares/AuthMiddleware.js (đã có)
// Cần thêm: checkRole(['ADMIN'])

// Usage:
router.get('/admin/users', 
  AuthMiddleware.verifyToken,
  RoleMiddleware.checkRole(['ADMIN']),
  UserController.getAll
);
```

#### 2. **Pagination Helper**
```javascript
// src/utils/pagination.js (tạo mới)
function paginate(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return {
    ...query,
    limit,
    offset
  };
}
```

#### 3. **Search Helper**
```javascript
// src/utils/search.js (tạo mới)
const { Op } = require('sequelize');

function searchFields(searchTerm, fields = []) {
  if (!searchTerm) return {};
  
  return {
    [Op.or]: fields.map(field => ({
      [field]: { [Op.like]: `%${searchTerm}%` }
    }))
  };
}
```

#### 4. **Status Updates**
```javascript
// Khi approve/reject company hoặc blog:
// - Update status
// - Lưu adminId (ai approve/reject)
// - Lưu timestamp
// - Gửi notification cho user
// - Log vào activity history
```

#### 5. **Error Handling**
```javascript
// Wrap tất cả async controllers với try-catch
// Sử dụng ApiResponse.error() đã có sẵn
```

---

## 📋 CHECKLIST FOR BACKEND

### Phase 1 - Authentication & Core (Priority: P0)
- [ ] POST /auth/login
- [ ] POST /auth/refresh-token  
- [ ] POST /auth/logout
- [ ] Middleware: verifyToken + checkRole(['ADMIN'])

### Phase 2 - Dashboard (Priority: P0)
- [ ] GET /admin/statistics/overview
- [ ] GET /admin/statistics/users-growth
- [ ] GET /admin/statistics/activities

### Phase 3 - Users (Priority: P0)
- [ ] GET /admin/users (with filters/search/pagination)
- [ ] GET /admin/users/:id
- [ ] PUT /admin/users/:id
- [ ] PUT /admin/users/:id/toggle-active
- [ ] PUT /admin/users/:id/verify
- [ ] DELETE /admin/users/:id

### Phase 4 - Companies (Priority: P0)
- [ ] GET /admin/companies (with filters)
- [ ] GET /admin/companies/:id
- [ ] PUT /admin/companies/:id/approve
- [ ] PUT /admin/companies/:id/reject
- [ ] PUT /admin/companies/:id/suspend
- [ ] GET /admin/companies/:id/career-paths
- [ ] GET /admin/companies/:id/tests
- [ ] DELETE /admin/companies/:id

### Phase 5 - Career Paths (Priority: P1)
- [ ] GET /admin/career-paths
- [ ] GET /admin/career-paths/:id
- [ ] GET /admin/career-paths/:id/lessons
- [ ] GET /admin/career-paths/:id/tests
- [ ] GET /admin/career-paths/:id/students
- [ ] POST /admin/career-paths/:id/students
- [ ] DELETE /admin/career-paths/:pathId/students/:studentId
- [ ] PUT /admin/career-paths/:id
- [ ] DELETE /admin/career-paths/:id

### Phase 6 - Blogs (Priority: P1)
- [ ] GET /admin/blogs (with filters)
- [ ] GET /admin/blogs/:id
- [ ] GET /admin/blogs/:id/comments
- [ ] PUT /admin/blogs/:id/approve
- [ ] PUT /admin/blogs/:id/reject
- [ ] DELETE /admin/blogs/:id
- [ ] DELETE /admin/comments/:id

### Phase 7 - Reports (Priority: P2)
- [ ] GET /admin/reports/users-growth
- [ ] GET /admin/reports/top-students
- [ ] GET /admin/reports/popular-career-paths
- [ ] GET /admin/reports/flagged-content

### Phase 8 - Settings (Priority: P2)
- [ ] GET /admin/locations
- [ ] POST /admin/locations
- [ ] PUT /admin/locations/:id
- [ ] DELETE /admin/locations/:id

---

## 📞 CONTACT & QUESTIONS

Nếu có thắc mắc về API spec, vui lòng liên hệ:
- **Frontend Dev:** [Your Name]
- **Backend Dev:** [Teammate Name]

**Document Version:** 1.0  
**Last Updated:** November 3, 2025

