# 🚀 FRONTEND SETUP GUIDE - ADMIN PANEL

**Tech Stack:** React + Vite + Tailwind CSS + shadcn/ui  
**Architecture:** Atomic Design Pattern

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Create React Project**

```bash
# Trong thư mục dự án, tạo folder mới cho admin frontend
npm create vite@latest admin-panel -- --template react
cd admin-panel
npm install
```

### **STEP 2: Install Dependencies**

```bash
# Core dependencies
npm install react-router-dom axios @tanstack/react-query zustand

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Charts & Icons
npm install recharts lucide-react

# Utilities
npm install date-fns clsx tailwind-merge

# Forms (optional, for later)
npm install react-hook-form @hookform/resolvers zod
```

### **STEP 3: Setup Tailwind CSS**

**File: `tailwind.config.js`**
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
          foreground: "hsl(var(--foreground))",
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

**File: `src/index.css`**
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

### **STEP 4: Install shadcn/ui Components**

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - TypeScript: No
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
```

### **STEP 5: Run Development Server**

```bash
npm run dev
```

---

## 📁 FOLDER STRUCTURE

Cấu trúc đã được tạo trong thư mục `admin-panel/src/`

---

## 🎨 DESIGN TOKENS

### Colors
- **Primary:** Blue (#3B82F6) - Main actions, links
- **Success:** Green (#10B981) - Approve, success states
- **Warning:** Yellow (#F59E0B) - Pending, warnings
- **Danger:** Red (#EF4444) - Reject, delete, errors
- **Gray:** Slate - Text, borders, backgrounds

### Typography
- **Headings:** Font weight 600-700
- **Body:** Font weight 400
- **Small:** 0.875rem (14px)
- **Base:** 1rem (16px)
- **Large:** 1.125rem (18px)

### Spacing
- **XS:** 0.25rem (4px)
- **SM:** 0.5rem (8px)
- **MD:** 1rem (16px)
- **LG:** 1.5rem (24px)
- **XL:** 2rem (32px)

---

## 🔧 UTILITY FUNCTIONS

Các utility functions đã được tạo trong `src/utils/`

---

## 📱 RESPONSIVE BREAKPOINTS

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🎯 NEXT STEPS

1. ✅ Project setup complete
2. ✅ Dependencies installed
3. ✅ Tailwind configured
4. ✅ Folder structure created
5. ✅ Core components ready
6. ➡️ Start building pages!

---

## 🚀 READY TO CODE!

Run `npm run dev` và bắt đầu code UI trong thư mục `admin-panel/src/pages/`

