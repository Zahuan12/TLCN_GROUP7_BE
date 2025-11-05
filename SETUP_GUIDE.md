# 🚀 HƯỚNG DẪN SETUP ADMIN PANEL

**Mục tiêu:** Chạy được toàn bộ Admin Panel trong 5 phút ⏱️

---

## 📋 YÊU CẦU HỆ THỐNG

- ✅ **Node.js** v16 trở lên ([Tải về](https://nodejs.org/))
- ✅ **npm** (đi kèm Node.js)
- ✅ **Git** (để clone project)
- ✅ **Terminal** (CMD, PowerShell, hoặc Git Bash)

Kiểm tra phiên bản:
```bash
node --version    # Phải >= v16.0.0
npm --version     # Phải >= 7.0.0
```

---

## 🔧 BƯỚC 1: MỞ TERMINAL

**Windows:**
- Mở thư mục project
- Nhấn chuột phải → Chọn **"Open in Terminal"** hoặc **"Git Bash Here"**

**Hoặc:**
- Mở CMD/PowerShell
- `cd` đến thư mục project:
  ```bash
  cd "D:\4th Year\Semester 1\TLCN\TLCN_GROUP7_BE"
  ```

---

## 📦 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

```bash
# Di chuyển vào thư mục admin-panel
cd admin-panel

# Cài đặt tất cả packages
npm install
```

⏳ **Chờ khoảng 2-3 phút** để npm tải và cài đặt packages.

### ❌ Nếu gặp lỗi:

**Lỗi 1: "npm ERR! code ENOENT"**
```bash
# Xóa node_modules và package-lock.json, cài lại:
rm -rf node_modules package-lock.json
npm install
```

**Lỗi 2: "EACCES permission denied"**
```bash
# Chạy với quyền admin (Windows: Run as Administrator)
```

**Lỗi 3: Network timeout**
```bash
# Đổi npm registry sang Taobao (mirror nhanh hơn):
npm config set registry https://registry.npmmirror.com
npm install
```

---

## ▶️ BƯỚC 3: CHẠY DEVELOPMENT SERVER

```bash
npm run dev
```

✅ **Thành công khi thấy:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🌐 BƯỚC 4: MỞ TRÌNH DUYỆT

1. Mở trình duyệt (Chrome, Edge, Firefox...)
2. Truy cập: **http://localhost:5173/**
3. ✨ Admin Panel sẽ hiển thị!

---

## 🗺️ CÁC TRANG ĐÃ HOÀN THÀNH

Sau khi chạy thành công, bạn có thể truy cập các trang:

| Trang | URL | Mô tả |
|-------|-----|-------|
| 🏠 Dashboard | `/dashboard` | Tổng quan thống kê |
| 👥 Users | `/users` | Quản lý tất cả users |
| 🏢 Companies | `/companies` | Phê duyệt & quản lý công ty |
| 📚 Career Paths | `/career-paths` | Quản lý lộ trình học tập |
| ✍️ Blogs | `/blogs` | Kiểm duyệt nội dung blog |
| 🎓 Students | `/students` | Theo dõi tiến độ sinh viên |
| 📊 Reports | `/reports` | Báo cáo & thống kê |

### 🧭 Hoặc dùng Sidebar:

- Click vào **menu items** bên trái để chuyển trang
- Menu có **submenu** (như Companies, Blogs) → Click để expand
- **Badge đỏ** hiển thị số items chờ xử lý

---

## 🎨 CẤU TRÚC PROJECT

```
admin-panel/
├── src/
│   ├── components/         # UI Components (Atomic Design)
│   │   ├── atoms/         # Button, Input, Badge...
│   │   ├── molecules/     # SearchBar, StatCard...
│   │   ├── organisms/     # Sidebar, Header, DataTable...
│   │   ├── templates/     # DashboardLayout
│   │   └── ui/           # shadcn/ui components
│   │
│   ├── pages/             # Các trang chính
│   │   ├── Dashboard/
│   │   ├── Users/
│   │   ├── Companies/
│   │   ├── CareerPaths/
│   │   ├── Blogs/
│   │   ├── Students/
│   │   └── Reports/
│   │
│   ├── services/          # API services (hiện tại dùng mock data)
│   ├── utils/             # Utilities & constants
│   ├── context/           # React Context (AuthContext)
│   ├── hooks/             # Custom hooks
│   └── App.jsx            # Main app với routing
│
├── package.json           # Dependencies
└── vite.config.js         # Vite config
```

---

## 🧪 TESTING CÁC TÍNH NĂNG

### ✅ Test Sidebar Navigation:
1. Click **"Quản lý Users"** → Mở submenu
2. Click **"Students"** → Filter chỉ hiển thị sinh viên
3. Click **"Companies"** → Filter chỉ hiển thị công ty

### ✅ Test Search & Filter:
1. Vào trang **Users** hoặc **Students**
2. Gõ tên vào search bar
3. Chọn filters (Role, Status, etc.)
4. Kết quả tự động cập nhật

### ✅ Test Modals:
1. Vào trang **Companies** hoặc **Career Paths**
2. Click **menu (⋮)** bên phải mỗi row
3. Chọn **"Xem chi tiết"**
4. Modal hiển thị với đầy đủ thông tin

### ✅ Test Approval Workflow:
1. Vào **Companies** → Tab **"Chờ duyệt"**
2. Click **menu (⋮)** → **"Phê duyệt"** hoặc **"Từ chối"**
3. Toast notification hiển thị
4. Item chuyển tab tương ứng

---

## 📝 MOCK DATA

**Lưu ý:** Hiện tại project dùng **mock data** (dữ liệu giả) để test frontend.

- Tất cả mock data nằm trong: `src/utils/mockData.js`
- Các API services trong `src/services/` hiện tại return mock data
- Khi backend hoàn thành, chỉ cần thay đổi services để call API thật

### 🔄 Để kết nối Backend sau này:

1. Mở file `src/services/api.js`
2. Đổi `baseURL` từ mock sang backend URL:
   ```javascript
   baseURL: 'http://localhost:8080/api'  // Backend URL
   ```
3. Remove mock implementation trong các service files
4. Uncomment real API calls

---

## 🛠️ CÁC LỆNH THƯỜNG DÙNG

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Cài thêm package mới
npm install <package-name>

# Cài shadcn/ui component mới
npx shadcn@latest add <component-name>

# Xem danh sách packages đã cài
npm list --depth=0
```

---

## ❓ TROUBLESHOOTING (XỬ LÝ LỖI)

### Lỗi 1: Trang trắng, không hiển thị gì

**Nguyên nhân:** JavaScript error hoặc thiếu component

**Giải pháp:**
1. Mở **DevTools** (F12)
2. Vào tab **Console**
3. Xem lỗi đỏ
4. Thường là thiếu shadcn/ui component:
   ```bash
   # Cài component thiếu, ví dụ:
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add dialog
   ```

### Lỗi 2: "Failed to resolve import"

**Nguyên nhân:** Thiếu file hoặc đường dẫn sai

**Giải pháp:**
1. Kiểm tra file có tồn tại không
2. Kiểm tra đường dẫn import có đúng không
3. Thử restart dev server:
   ```bash
   # Ctrl+C để stop
   npm run dev  # Chạy lại
   ```

### Lỗi 3: Styling không hiển thị

**Nguyên nhân:** Tailwind CSS chưa config đúng

**Giải pháp:**
1. Kiểm tra `tailwind.config.js` có đúng content paths:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```
2. Kiểm tra `src/index.css` có Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Lỗi 4: Port 5173 đã được sử dụng

**Giải pháp:**
```bash
# Kill process đang dùng port (Windows):
netstat -ano | findstr :5173
taskkill /PID <process_id> /F

# Hoặc đổi port khác trong vite.config.js:
# server: { port: 3000 }
```

### Lỗi 5: npm install bị treo/chậm

**Giải pháp:**
```bash
# 1. Xóa cache npm
npm cache clean --force

# 2. Đổi sang registry mirror nhanh hơn
npm config set registry https://registry.npmmirror.com

# 3. Hoặc dùng yarn thay vì npm
npm install -g yarn
yarn install
yarn dev
```

---

## 📚 TÀI LIỆU THAM KHẢO

### 🔗 Links hữu ích:

- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **Recharts:** https://recharts.org/
- **Lucide Icons:** https://lucide.dev/icons/

### 📄 Các file docs quan trọng:

- `ADMIN_API_SPECIFICATION.md` - API docs cho backend teammate
- `BACKEND_QUICK_START.md` - Hướng dẫn implement backend
- `admin-panel-structure.md` - Cấu trúc Atomic Design

---

## 👥 HỖ TRỢ

### Nếu gặp vấn đề:

1. **Xem Console trong DevTools** (F12) để biết lỗi cụ thể
2. **Google error message** - Thường có solution trên StackOverflow
3. **Hỏi teammate** - Người đã setup sẽ giúp được

### Checklist trước khi hỏi:

- ✅ Đã chạy `npm install` chưa?
- ✅ Đã restart dev server chưa?
- ✅ Đã xem Console errors chưa?
- ✅ Đã thử clear cache chưa? (`Ctrl+Shift+Del` trong browser)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Node.js v16+ đã cài đặt
- [ ] Clone/Pull code mới nhất
- [ ] `cd admin-panel`
- [ ] `npm install` thành công
- [ ] `npm run dev` chạy được
- [ ] Truy cập http://localhost:5173/ thấy Dashboard
- [ ] Test navigation qua các trang
- [ ] Test search, filter, modals
- [ ] Đọc qua cấu trúc code

---

## 🎉 CHÚC MỪNG!

Bạn đã setup thành công Admin Panel! 🚀

**Các trang đã hoàn thành:**
✅ Dashboard  
✅ Users Management  
✅ Companies Management  
✅ Career Paths Management  
✅ Blogs Management  
✅ Students Management  
✅ Reports & Analytics  

**Tổng cộng:** 7/8 trang (còn Settings/Locations)

---

**📝 Ghi chú:**
- Code hiện tại sử dụng **mock data** để test
- Tất cả **API services** đã chuẩn bị sẵn structure
- Khi backend xong, chỉ cần **replace mock implementation** bằng real API calls
- UI/UX design theo **Atomic Design pattern**
- Responsive, modern, đẹp mắt 🎨

**Happy Coding! 💻✨**

