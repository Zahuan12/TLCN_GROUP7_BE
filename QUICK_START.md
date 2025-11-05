# 🚀 QUICK START - CHẠY DASHBOARD

**Mục tiêu:** Chạy Dashboard page đã build trong 10 phút

---

## 📋 YÊU CẦU

- ✅ Node.js v16+ đã cài đặt
- ✅ npm hoặc yarn
- ✅ Terminal/Command Prompt

---

## 🔧 BƯỚC 1: TẠO PROJECT REACT

```bash
# Mở terminal trong thư mục bạn muốn tạo project
npm create vite@latest admin-panel -- --template react

# Chọn:
# - Framework: React
# - Variant: JavaScript

cd admin-panel
```

---

## 📦 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

```bash
# Core dependencies
npm install react-router-dom axios recharts lucide-react date-fns clsx tailwind-merge

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 🎨 BƯỚC 3: SETUP TAILWIND CSS

### **3.1. Sửa file `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### **3.2. Thay thế nội dung file `src/index.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 🎯 BƯỚC 4: SETUP SHADCN/UI

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Khi được hỏi:
# - TypeScript? No
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - tailwind.config.js: Yes
# - components.json: Yes
# - Import alias: @/components

# Add components cần thiết
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu
```

---

## 📂 BƯỚC 5: COPY CODE

### **Option A: Copy thủ công (RECOMMENDED)**

1. **Copy tất cả files từ thư mục `admin-panel-boilerplate/src/` vào `admin-panel/src/`**

Cấu trúc sẽ như này:
```
admin-panel/src/
├── components/
│   ├── ui/                    ← Từ shadcn/ui
│   ├── molecules/
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   └── SearchBar.jsx
│   ├── organisms/
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   └── templates/
│       └── DashboardLayout.jsx
│
├── pages/
│   └── Dashboard/
│       ├── index.jsx
│       └── components/
│           ├── UsersGrowthChart.jsx
│           └── ActivityTimeline.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── statisticsService.js
│   └── ... (8 services)
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useDebounce.js
│   ├── usePagination.js
│   └── useToast.js
│
├── utils/
│   ├── constants.js
│   ├── formatDate.js
│   ├── validation.js
│   ├── cn.js
│   └── mockData.js
│
├── App.jsx
├── main.jsx
└── index.css
```

### **Option B: Copy bằng command (Windows PowerShell)**

```powershell
# Trong thư mục TLCN_GROUP7_BE
Copy-Item -Path "admin-panel-boilerplate\src\*" -Destination "admin-panel\src\" -Recurse -Force
```

### **Option B: Copy bằng command (Mac/Linux)**

```bash
# Trong thư mục TLCN_GROUP7_BE
cp -r admin-panel-boilerplate/src/* admin-panel/src/
```

---

## 🔧 BƯỚC 6: TẠO FILE .ENV

Tạo file `.env` trong thư mục `admin-panel/`:

```bash
VITE_API_URL=http://localhost:3000
```

---

## 🚀 BƯỚC 7: CHẠY PROJECT

```bash
# Trong thư mục admin-panel
npm run dev
```

Dashboard sẽ chạy tại: **http://localhost:5173/dashboard**

---

## ✅ KẾT QUẢ

Nếu thành công, bạn sẽ thấy:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Mở browser:** http://localhost:5173/dashboard

Bạn sẽ thấy Dashboard với:
- ✅ Sidebar (navigation menu)
- ✅ Header (user menu + notifications)
- ✅ 6 Statistics cards
- ✅ Users Growth Chart
- ✅ Activity Timeline
- ✅ Quick stats & progress bars

---

## 🐛 TROUBLESHOOTING

### **Lỗi 1: "Cannot find module '@/components/ui/...'"**

**Nguyên nhân:** Chưa install shadcn/ui components

**Fix:**
```bash
npx shadcn-ui@latest add button input card badge avatar dropdown-menu
```

### **Lỗi 2: "Module not found: Can't resolve 'lucide-react'"**

**Nguyên nhân:** Chưa install dependencies

**Fix:**
```bash
npm install lucide-react
```

### **Lỗi 3: "Module not found: Can't resolve 'recharts'"**

**Nguyên nhân:** Chưa install recharts

**Fix:**
```bash
npm install recharts
```

### **Lỗi 4: Tailwind styles không hoạt động**

**Nguyên nhân:** Chưa config đúng

**Fix:**
1. Check `tailwind.config.js` có content paths đúng không
2. Check `src/index.css` có import tailwind không
3. Restart dev server: `Ctrl+C` → `npm run dev`

### **Lỗi 5: "404 Not Found" khi vào /dashboard**

**Nguyên nhân:** Routing chưa đúng

**Fix:**
- Vào trực tiếp: http://localhost:5173/dashboard
- Hoặc app sẽ auto redirect từ `/` → `/dashboard`

---

## 📸 SCREENSHOT

Nếu thành công, Dashboard sẽ trông như này:

```
┌─────────────────────────────────────────────────────────┐
│ [☰] Admin Panel                        [🔔 23] [👤 AD]  │
├─────────────────────────────────────────────────────────┤
│ Sidebar │ Dashboard                                     │
│         │                                               │
│ 📊      │ ┌────────┬────────┬────────┬────────┐        │
│ 👥      │ │Users   │Students│Companies│Paths   │        │
│ 🏢 [8]  │ │1,234↑ │1,189   │45↑ [8] │28      │        │
│ 🛤️      │ └────────┴────────┴────────┴────────┘        │
│ 📝 [15] │                                               │
│ 📊      │ [Users Growth Chart] [Activity Timeline]      │
│ ⚙️      │                                               │
│         │ [Quick Stats & Progress Bars]                 │
└─────────┴───────────────────────────────────────────────┘
```

---

## 🎯 NEXT STEPS

Sau khi Dashboard chạy thành công:

1. ✅ Test tất cả features (sidebar, stats, charts)
2. ✅ Kiểm tra responsive (resize browser)
3. ✅ Xem mock data trong console
4. ✅ Chuẩn bị cho backend integration

**Muốn build thêm trang khác?**
- Login Page
- Users Page
- Companies Page
- etc...

---

## 💡 TIPS

### **Xem Mock Data:**
```javascript
// Trong Dashboard/index.jsx
console.log('Stats:', stats);
console.log('Chart Data:', growthData);
console.log('Activities:', activities);
```

### **Thay đổi Stats:**
Edit file `src/utils/mockData.js` → `mockDashboardStats`

### **Thay đổi Menu:**
Edit file `src/components/organisms/Sidebar.jsx` → `menuItems`

### **Thay đổi Colors:**
Edit file `src/utils/constants.js` → `CHART_COLORS`

---

## 📞 CẦN TRỢ GIÚP?

Nếu gặp lỗi:
1. Check console (F12 → Console tab)
2. Check terminal output
3. Đọc error message
4. Google error message
5. Hỏi tôi! 😊

---

**🎉 CHÚC BẠN SETUP THÀNH CÔNG! 🎉**

