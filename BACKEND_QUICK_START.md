# 🚀 BACKEND QUICK START GUIDE

**Dành cho:** Backend Developer  
**Mục tiêu:** Implement Admin Panel APIs

---

## 📋 TÓM TẮT

### Công việc cần làm:
- ✅ **44 API endpoints** (xem chi tiết trong `ADMIN_API_SPECIFICATION.md`)
- ✅ **8 modules chính:** Auth, Dashboard, Users, Companies, Career Paths, Blogs, Reports, Settings
- ✅ **Ưu tiên:** P0 (15 APIs) → P1 (15 APIs) → P2 (14 APIs)

### Files cần tạo/sửa:
```
CẦN TẠO (13 files mới):
├── src/controllers/
│   ├── adminController.js          (Dashboard stats, Reports)
│   ├── companyController.js        (Company management)
│   ├── careerPathController.js     (Career paths management)
│   └── blogController.js           (Blog moderation)
│
├── src/services/
│   ├── adminService.js
│   ├── companyService.js
│   ├── careerPathService.js
│   └── blogService.js
│
├── src/routes/
│   ├── adminRoute.js               (Tất cả /admin/* routes)
│   └── companyRoute.js
│
└── src/utils/
    ├── pagination.js               (Helper cho pagination)
    └── search.js                   (Helper cho search)

CẦN SỬA (2 files):
├── src/controllers/userController.js  (Thêm search, filter, pagination)
└── src/routes/index.js                (Import adminRoute)
```

---

## 🔥 PRIORITY ROADMAP

### **WEEK 1: FOUNDATION (P0)**

#### **Day 1: Setup & Auth**
```javascript
✅ Task 1: Update RoleMiddleware
File: src/middlewares/RoleMiddleware.js

// Đã có sẵn, chỉ cần dùng:
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(['ADMIN']));
```

#### **Day 2: Dashboard Statistics**
```javascript
✅ Task 2: Create adminController.js

3 endpoints:
- GET /admin/statistics/overview
- GET /admin/statistics/users-growth  
- GET /admin/statistics/activities

Queries cần:
- Count users by role
- Growth data từ database (GROUP BY month)
- Recent activities (log table hoặc query từ các bảng chính)
```

#### **Day 3-4: Users Management**
```javascript
✅ Task 3: Update userController.js

6 endpoints:
- GET /admin/users (IMPORTANT: Add search, filter, pagination)
- GET /admin/users/:id
- PUT /admin/users/:id
- PUT /admin/users/:id/toggle-active
- PUT /admin/users/:id/verify
- DELETE /admin/users/:id

Example search query:
const { search, role, isActive, page = 1, limit = 10 } = req.query;

const where = {};
if (search) {
  where[Op.or] = [
    { username: { [Op.like]: `%${search}%` } },
    { email: { [Op.like]: `%${search}%` } },
    { fullName: { [Op.like]: `%${search}%` } }
  ];
}
if (role) where.role = role;
if (isActive !== undefined) where.isActive = isActive === 'true';

const { count, rows } = await db.User.findAndCountAll({
  where,
  limit: parseInt(limit),
  offset: (parseInt(page) - 1) * parseInt(limit),
  order: [['createdDate', 'DESC']]
});
```

#### **Day 5: Companies Management (Part 1)**
```javascript
✅ Task 4: Create companyController.js

Focus on approval workflow:
- GET /admin/companies?status=PENDING
- GET /admin/companies/:id
- PUT /admin/companies/:id/approve
- PUT /admin/companies/:id/reject

IMPORTANT: Khi approve/reject
→ Gửi email thông báo
→ Tạo notification
→ Log activity
```

---

### **WEEK 2: CORE FEATURES (P1)**

#### **Day 1-2: Career Paths Management**
```javascript
✅ Task 5: Create careerPathController.js

9 endpoints (focus vào 5 quan trọng nhất):
- GET /admin/career-paths
- GET /admin/career-paths/:id
- GET /admin/career-paths/:id/students
- POST /admin/career-paths/:id/students (bulk add)
- DELETE /admin/career-paths/:pathId/students/:studentId

Challenges:
- Cần query relationship: CareerPath → Lessons, Tests, Students
- Bulk add students: transaction để đảm bảo atomicity
```

#### **Day 3-4: Blogs Moderation**
```javascript
✅ Task 6: Create blogController.js

7 endpoints (focus vào moderation workflow):
- GET /admin/blogs?status=PENDING
- GET /admin/blogs/:id
- PUT /admin/blogs/:id/approve
- PUT /admin/blogs/:id/reject (với warnUser option)
- DELETE /admin/blogs/:id

IMPORTANT: Reject blog with warning
→ Lưu warning count vào user profile
→ Auto ban nếu warnings >= 3
```

---

### **WEEK 3: ANALYTICS & POLISH (P2)**

#### **Day 1-2: Reports**
```javascript
✅ Task 7: Reports trong adminController.js

4 endpoints:
- GET /admin/reports/users-growth (complex query với GROUP BY)
- GET /admin/reports/top-students (JOIN với test results)
- GET /admin/reports/popular-career-paths (aggregate queries)
- GET /admin/reports/flagged-content (nếu có report system)
```

#### **Day 3: Settings - Locations**
```javascript
✅ Task 8: Location CRUD trong adminController.js

4 endpoints (đơn giản):
- GET /admin/locations
- POST /admin/locations
- PUT /admin/locations/:id
- DELETE /admin/locations/:id
```

---

## 📊 DATABASE CHANGES NEEDED

### **Thêm field vào existing models:**

```javascript
// 1. Blog Model - Thêm status field
// File: src/models/blogModel.js

status: {
  type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
  defaultValue: 'PENDING',
  allowNull: false
},
approvedBy: {
  type: DataTypes.UUID,
  references: { model: 'users', key: 'id' }
},
approvedDate: {
  type: DataTypes.DATE
},
rejectedBy: {
  type: DataTypes.UUID,
  references: { model: 'users', key: 'id' }
},
rejectedDate: {
  type: DataTypes.DATE
},
rejectionReason: {
  type: DataTypes.TEXT
}
```

```javascript
// 2. Company Model - Thêm status field
// File: src/models/companyModel.js

status: {
  type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'),
  defaultValue: 'PENDING',
  allowNull: false
},
approvedBy: {
  type: DataTypes.UUID,
  references: { model: 'users', key: 'id' }
},
approvedDate: {
  type: DataTypes.DATE
},
rejectedBy: {
  type: DataTypes.UUID,
  references: { model: 'users', key: 'id' }
},
rejectedDate: {
  type: DataTypes.DATE
},
rejectionReason: {
  type: DataTypes.TEXT
}
```

```javascript
// 3. User Model - Thêm warning count
// File: src/models/userModel.js

warningCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},
lastWarningDate: {
  type: DataTypes.DATE
}
```

### **Tạo model mới (nếu cần):**

```javascript
// 4. Location Model (NEW)
// File: src/models/locationModel.js

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'locations',
    timestamps: true
  });

  return Location;
};
```

### **Migration Strategy:**

**Option A: Sequelize Migrations (RECOMMENDED)**
```bash
# Tạo migration cho Blog status
npx sequelize-cli migration:generate --name add-status-to-blog

# File migration:
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('blog', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
      allowNull: false
    });
    // Thêm các columns khác...
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('blog', 'status');
  }
};

# Run migration
npx sequelize-cli db:migrate
```

**Option B: Manual ALTER TABLE (Nếu không dùng migrations)**
```sql
-- Blog
ALTER TABLE blog ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING';
ALTER TABLE blog ADD COLUMN approvedBy VARCHAR(36);
ALTER TABLE blog ADD COLUMN approvedDate DATETIME;

-- Company
ALTER TABLE companies ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING';
ALTER TABLE companies ADD COLUMN approvedBy VARCHAR(36);
ALTER TABLE companies ADD COLUMN approvedDate DATETIME;

-- User
ALTER TABLE users ADD COLUMN warningCount INT DEFAULT 0;
```

---

## 🛠️ CODE TEMPLATES

### **Template 1: Admin Route Structure**

```javascript
// src/routes/adminRoute.js

const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
const AdminController = require('../controllers/adminController');
const UserController = require('../controllers/userController');
const CompanyController = require('../controllers/companyController');
const CareerPathController = require('../controllers/careerPathController');
const BlogController = require('../controllers/blogController');

// Apply auth middleware cho tất cả routes
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(['ADMIN']));

// === STATISTICS ===
router.get('/statistics/overview', AdminController.getOverview);
router.get('/statistics/users-growth', AdminController.getUsersGrowth);
router.get('/statistics/activities', AdminController.getActivities);

// === USERS ===
router.get('/users', UserController.getAllAdmin);
router.get('/users/:id', UserController.getByIdAdmin);
router.put('/users/:id', UserController.updateAdmin);
router.put('/users/:id/toggle-active', UserController.toggleActive);
router.put('/users/:id/verify', UserController.verifyUser);
router.delete('/users/:id', UserController.deleteAdmin);

// === COMPANIES ===
router.get('/companies', CompanyController.getAll);
router.get('/companies/:id', CompanyController.getById);
router.put('/companies/:id/approve', CompanyController.approve);
router.put('/companies/:id/reject', CompanyController.reject);
router.put('/companies/:id/suspend', CompanyController.suspend);
router.get('/companies/:id/career-paths', CompanyController.getCareerPaths);
router.get('/companies/:id/tests', CompanyController.getTests);
router.delete('/companies/:id', CompanyController.delete);

// === CAREER PATHS ===
router.get('/career-paths', CareerPathController.getAll);
router.get('/career-paths/:id', CareerPathController.getById);
router.get('/career-paths/:id/lessons', CareerPathController.getLessons);
router.get('/career-paths/:id/tests', CareerPathController.getTests);
router.get('/career-paths/:id/students', CareerPathController.getStudents);
router.post('/career-paths/:id/students', CareerPathController.addStudents);
router.delete('/career-paths/:pathId/students/:studentId', CareerPathController.removeStudent);
router.put('/career-paths/:id', CareerPathController.update);
router.delete('/career-paths/:id', CareerPathController.delete);

// === BLOGS ===
router.get('/blogs', BlogController.getAll);
router.get('/blogs/:id', BlogController.getById);
router.get('/blogs/:id/comments', BlogController.getComments);
router.put('/blogs/:id/approve', BlogController.approve);
router.put('/blogs/:id/reject', BlogController.reject);
router.delete('/blogs/:id', BlogController.delete);
router.delete('/comments/:id', BlogController.deleteComment);

// === REPORTS ===
router.get('/reports/users-growth', AdminController.getUsersGrowthReport);
router.get('/reports/top-students', AdminController.getTopStudents);
router.get('/reports/popular-career-paths', AdminController.getPopularPaths);
router.get('/reports/flagged-content', AdminController.getFlaggedContent);

// === SETTINGS - LOCATIONS ===
router.get('/locations', AdminController.getLocations);
router.post('/locations', AdminController.createLocation);
router.put('/locations/:id', AdminController.updateLocation);
router.delete('/locations/:id', AdminController.deleteLocation);

module.exports = router;
```

### **Template 2: Pagination Helper**

```javascript
// src/utils/pagination.js

class PaginationHelper {
  static paginate(page = 1, limit = 10) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    return {
      limit: parseInt(limit),
      offset: offset >= 0 ? offset : 0
    };
  }

  static formatResponse(data, count, page, limit) {
    const totalPages = Math.ceil(count / limit);
    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }
}

module.exports = PaginationHelper;
```

### **Template 3: Search Helper**

```javascript
// src/utils/search.js

const { Op } = require('sequelize');

class SearchHelper {
  static searchByFields(searchTerm, fields = []) {
    if (!searchTerm || searchTerm.trim() === '') {
      return {};
    }

    return {
      [Op.or]: fields.map(field => ({
        [field]: { [Op.like]: `%${searchTerm.trim()}%` }
      }))
    };
  }
}

module.exports = SearchHelper;
```

### **Template 4: Admin Controller Example**

```javascript
// src/controllers/adminController.js

const AdminService = require('../services/adminService');
const ApiResponse = require('../utils/ApiResponse');

class AdminController {
  // Dashboard Overview
  async getOverview(req, res) {
    try {
      const stats = await AdminService.getOverviewStatistics();
      return ApiResponse.success(res, 'Lấy thống kê thành công', stats);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // Users Growth Report
  async getUsersGrowth(req, res) {
    try {
      const { months = 12 } = req.query;
      const data = await AdminService.getUsersGrowthData(parseInt(months));
      return ApiResponse.success(res, 'Lấy dữ liệu thành công', data);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // Get Activities
  async getActivities(req, res) {
    try {
      const { limit = 20 } = req.query;
      const activities = await AdminService.getRecentActivities(parseInt(limit));
      return ApiResponse.success(res, 'Lấy hoạt động thành công', activities);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  // ... other methods
}

module.exports = new AdminController();
```

### **Template 5: Admin Service Example**

```javascript
// src/services/adminService.js

const db = require('../models');
const { Op } = require('sequelize');

class AdminService {
  async getOverviewStatistics() {
    // Count users by role
    const totalUsers = await db.User.count();
    const totalStudents = await db.User.count({ where: { role: 'STUDENT' } });
    const totalCompanies = await db.User.count({ where: { role: 'COMPANY' } });
    const totalAdmins = await db.User.count({ where: { role: 'ADMIN' } });

    // Count other entities
    const activeGroups = await db.CareerPath.count();
    const totalBlogs = await db.Blog.count();

    // Count pending approvals
    const pendingCompanies = await db.Company.count({ 
      where: { status: 'PENDING' } 
    });
    const pendingBlogs = await db.Blog.count({ 
      where: { status: 'PENDING' } 
    });

    // Calculate growth (last 30 days vs previous 30 days)
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const usersLast30 = await db.User.count({
      where: { createdDate: { [Op.gte]: last30Days } }
    });
    const usersPrevious30 = await db.User.count({
      where: { 
        createdDate: { 
          [Op.gte]: previous30Days,
          [Op.lt]: last30Days
        }
      }
    });

    const usersGrowth = usersPrevious30 > 0 
      ? ((usersLast30 - usersPrevious30) / usersPrevious30 * 100).toFixed(1)
      : 0;

    return {
      totalUsers,
      totalStudents,
      totalCompanies,
      totalAdmins,
      activeGroups,
      totalBlogs,
      pendingApprovals: {
        companies: pendingCompanies,
        blogs: pendingBlogs
      },
      growth: {
        users: {
          value: parseFloat(usersGrowth),
          trend: usersGrowth >= 0 ? 'up' : 'down'
        }
      }
    };
  }

  async getUsersGrowthData(months = 12) {
    // Complex query với GROUP BY month
    // Sử dụng Sequelize.fn để format date
    const results = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdDate'), '%Y-%m'), 'month'],
        'role',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      where: {
        createdDate: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - months))
        }
      },
      group: ['month', 'role'],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdDate'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Format data cho chart
    const labels = [];
    const studentsData = [];
    const companiesData = [];

    // Group by month
    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.month]) {
        grouped[row.month] = { students: 0, companies: 0 };
      }
      if (row.role === 'STUDENT') {
        grouped[row.month].students = parseInt(row.count);
      } else if (row.role === 'COMPANY') {
        grouped[row.month].companies = parseInt(row.count);
      }
    });

    Object.keys(grouped).sort().forEach(month => {
      labels.push(month);
      studentsData.push(grouped[month].students);
      companiesData.push(grouped[month].companies);
    });

    return {
      labels,
      datasets: [
        { label: 'Students', data: studentsData },
        { label: 'Companies', data: companiesData }
      ]
    };
  }

  // ... other methods
}

module.exports = new AdminService();
```

---

## ⚠️ COMMON PITFALLS

### 1. **Pagination với offset lớn**
```javascript
// ❌ BAD: Slow với offset lớn
const users = await db.User.findAll({
  limit: 10,
  offset: 10000 // Very slow!
});

// ✅ GOOD: Dùng cursor-based pagination nếu cần performance
// Hoặc cache results
```

### 2. **N+1 Query Problem**
```javascript
// ❌ BAD: N+1 queries
const paths = await db.CareerPath.findAll();
for (let path of paths) {
  path.company = await db.Company.findByPk(path.companyId); // N queries!
}

// ✅ GOOD: Use include
const paths = await db.CareerPath.findAll({
  include: [{ model: db.Company }]
});
```

### 3. **Missing Transaction**
```javascript
// ❌ BAD: Bulk add students without transaction
async addStudents(pathId, studentIds) {
  for (let studentId of studentIds) {
    await db.StudentProgress.create({ pathId, studentId });
    // Nếu fail giữa chừng → data inconsistent
  }
}

// ✅ GOOD: Use transaction
async addStudents(pathId, studentIds) {
  const t = await db.sequelize.transaction();
  try {
    for (let studentId of studentIds) {
      await db.StudentProgress.create({ pathId, studentId }, { transaction: t });
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
```

### 4. **Không gửi notification khi approve/reject**
```javascript
// ✅ GOOD: Luôn gửi notification
async approveCompany(id, adminId) {
  const company = await db.Company.findByPk(id);
  
  // Update status
  await company.update({
    status: 'APPROVED',
    approvedBy: adminId,
    approvedDate: new Date()
  });

  // Send notification
  await notificationService.send({
    userId: company.userId,
    type: 'COMPANY_APPROVED',
    message: 'Công ty của bạn đã được phê duyệt!'
  });

  // Send email
  await mailService.sendApprovalEmail(company);

  return company;
}
```

---

## 🧪 TESTING CHECKLIST

### Manual Testing với Postman:

```
1. Auth:
   ✅ Login với admin account
   ✅ Access token hết hạn → Refresh token
   ✅ Logout

2. Dashboard:
   ✅ Get overview stats
   ✅ Get users growth chart data
   ✅ Get recent activities

3. Users:
   ✅ Get all users (no filter)
   ✅ Search by username/email
   ✅ Filter by role (STUDENT, COMPANY)
   ✅ Filter by isActive
   ✅ Pagination (page 1, 2, 3...)
   ✅ Get user detail by ID
   ✅ Update user info
   ✅ Toggle active (khóa user)
   ✅ Delete user

4. Companies:
   ✅ Get pending companies
   ✅ Get company detail
   ✅ Approve company → Check notification sent
   ✅ Reject company với lý do → Check notification
   ✅ Get company's career paths
   ✅ Get company's tests

5. Career Paths:
   ✅ Get all paths
   ✅ Get path detail
   ✅ Get students in path
   ✅ Add students to path (bulk)
   ✅ Remove student from path

6. Blogs:
   ✅ Get pending blogs
   ✅ Approve blog
   ✅ Reject blog với warnUser=true → Check warning count
   ✅ Delete blog
   ✅ Delete comment

7. Reports:
   ✅ Users growth report (6 months, 12 months)
   ✅ Top 10 students
   ✅ Popular career paths
   ✅ Flagged content (if implemented)
```

---

## 📞 NEED HELP?

### Common Questions:

**Q: Model nào cần thêm field `status`?**  
A: Blog và Company models cần thêm status field (PENDING/APPROVED/REJECTED)

**Q: Làm sao để track admin actions?**  
A: Thêm fields `approvedBy`, `rejectedBy`, `approvedDate`, `rejectedDate` vào models

**Q: Pagination nên default bao nhiêu items?**  
A: Default `limit=10` cho tables, `limit=20` cho students lists

**Q: Search có cần case-insensitive không?**  
A: Có, dùng `LIKE` với MySQL tự động case-insensitive (nếu collation là utf8_general_ci)

**Q: Có cần rate limiting cho admin APIs không?**  
A: Không cần strict rate limiting, nhưng nên có logging cho audit trail

---

## ✅ DONE CRITERIA

Bạn hoàn thành khi:
- [ ] Tất cả 44 endpoints trả về đúng format JSON
- [ ] Pagination hoạt động với page/limit
- [ ] Search/Filter trả về kết quả chính xác
- [ ] Approve/Reject gửi notification cho user
- [ ] Database có đầy đủ status fields
- [ ] Postman collection test thành công
- [ ] Có error handling cho tất cả cases
- [ ] Frontend có thể call APIs và nhận response

---

**Good luck! 🚀**  
Nếu cần clarification, ping frontend dev hoặc check lại `ADMIN_API_SPECIFICATION.md`.

