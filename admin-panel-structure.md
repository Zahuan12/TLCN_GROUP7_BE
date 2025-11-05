# 📂 ADMIN PANEL - FOLDER STRUCTURE

Cấu trúc thư mục hoàn chỉnh cho Admin Panel Frontend

---

## 🌳 FULL STRUCTURE

```
admin-panel/
├── public/
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── molecules/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── FilterGroup.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── organisms/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── UsersTable.jsx
│   │   │   ├── CompaniesTable.jsx
│   │   │   ├── CareerPathsList.jsx
│   │   │   ├── BlogsTable.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── UserDetailModal.jsx
│   │   │   ├── CompanyDetailModal.jsx
│   │   │   └── index.js
│   │   │
│   │   └── templates/
│   │       ├── DashboardLayout.jsx
│   │       ├── AuthLayout.jsx
│   │       └── index.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── StatsCards.jsx
│   │   │       ├── UsersGrowthChart.jsx
│   │   │       └── ActivityTimeline.jsx
│   │   │
│   │   ├── Users/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── UserFilters.jsx
│   │   │       └── UserActionMenu.jsx
│   │   │
│   │   ├── Companies/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── CompanyFilters.jsx
│   │   │       ├── ApprovalActions.jsx
│   │   │       └── RejectReasonForm.jsx
│   │   │
│   │   ├── CareerPaths/
│   │   │   ├── index.jsx
│   │   │   ├── CareerPathDetail.jsx
│   │   │   └── components/
│   │   │       ├── PathCard.jsx
│   │   │       ├── StudentsInPath.jsx
│   │   │       ├── TestsInPath.jsx
│   │   │       └── AddStudentModal.jsx
│   │   │
│   │   ├── Blogs/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── BlogFilters.jsx
│   │   │       ├── BlogPreview.jsx
│   │   │       └── ModerationActions.jsx
│   │   │
│   │   ├── Reports/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── UsersGrowthReport.jsx
│   │   │       ├── TopStudentsReport.jsx
│   │   │       ├── PopularPathsReport.jsx
│   │   │       └── FlaggedContentReport.jsx
│   │   │
│   │   └── Settings/
│   │       ├── index.jsx
│   │       └── components/
│   │           └── LocationsManagement.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── companyService.js
│   │   ├── careerPathService.js
│   │   ├── blogService.js
│   │   ├── reportService.js
│   │   └── locationService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── useToast.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   └── uiStore.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatDate.js
│   │   ├── validation.js
│   │   ├── cn.js
│   │   └── mockData.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 📝 FILE DESCRIPTIONS

### **Atoms (Smallest Components)**
- **Button.jsx**: Primary, Secondary, Danger buttons
- **Input.jsx**: Text input với icon support
- **Badge.jsx**: Status badges (success, warning, danger)
- **Avatar.jsx**: User avatars với fallback
- **Select.jsx**: Dropdown select
- **Textarea.jsx**: Multi-line input

### **Molecules (Combination of Atoms)**
- **SearchBar.jsx**: Search input + icon + clear button
- **StatCard.jsx**: Dashboard statistics card
- **UserCard.jsx**: User info card
- **FilterGroup.jsx**: Multiple filters
- **Pagination.jsx**: Page navigation
- **StatusBadge.jsx**: Smart badge với color mapping

### **Organisms (Complex Components)**
- **Sidebar.jsx**: Navigation sidebar với menu items
- **Header.jsx**: Top bar với user menu & notifications
- **DataTable.jsx**: Reusable table với sort/filter
- **UsersTable.jsx**: Users-specific table
- **CompaniesTable.jsx**: Companies-specific table
- **CareerPathsList.jsx**: Career paths list/grid
- **BlogsTable.jsx**: Blogs table
- **ConfirmDialog.jsx**: Confirmation dialogs
- **UserDetailModal.jsx**: User detail modal
- **CompanyDetailModal.jsx**: Company detail modal

### **Templates (Page Layouts)**
- **DashboardLayout.jsx**: Main admin layout (Sidebar + Header + Content)
- **AuthLayout.jsx**: Login/Auth pages layout

### **Pages (Complete Views)**
- **Login.jsx**: Login page
- **Dashboard/**: Dashboard với stats & charts
- **Users/**: User management
- **Companies/**: Company management & approval
- **CareerPaths/**: Career paths & students
- **Blogs/**: Blog moderation
- **Reports/**: Analytics & reports
- **Settings/**: Settings & locations

### **Services (API Calls)**
- **api.js**: Axios instance với interceptors
- **authService.js**: Login, logout, refresh
- **userService.js**: User CRUD operations
- **companyService.js**: Company operations
- **careerPathService.js**: Career path operations
- **blogService.js**: Blog operations
- **reportService.js**: Reports & analytics
- **locationService.js**: Locations CRUD

### **Hooks (Custom React Hooks)**
- **useAuth.js**: Authentication hook
- **useFetch.js**: Generic fetch hook
- **useDebounce.js**: Debounce for search
- **usePagination.js**: Pagination logic
- **useToast.js**: Toast notifications

### **Context (React Context)**
- **AuthContext.jsx**: Auth state management
- **ThemeContext.jsx**: Theme (light/dark mode)

### **Store (Zustand)**
- **authStore.js**: Auth state (user, token)
- **uiStore.js**: UI state (sidebar open/close)

### **Utils (Utilities)**
- **constants.js**: Constants (API URLs, status enums)
- **formatDate.js**: Date formatting
- **validation.js**: Form validation
- **cn.js**: Classname utility (clsx + tailwind-merge)
- **mockData.js**: Mock data for development

---

## 🎯 DEVELOPMENT FLOW

1. **Start with Atoms**: Build basic components
2. **Compose Molecules**: Combine atoms
3. **Build Organisms**: Complex UI sections
4. **Create Templates**: Page layouts
5. **Assemble Pages**: Complete views

---

## 📦 COMPONENT EXPORT PATTERN

```javascript
// atoms/index.js
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
// ...

// Usage in pages:
import { Button, Input, Badge } from '@/components/atoms';
```

---

## 🚀 READY TO BUILD!

Cấu trúc này follows best practices:
- ✅ Atomic Design Pattern
- ✅ Scalable & Maintainable
- ✅ Easy to test
- ✅ Reusable components
- ✅ Clear separation of concerns

