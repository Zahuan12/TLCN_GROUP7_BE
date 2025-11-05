// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  COMPANY: 'COMPANY'
};

// User Status
export const USER_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

// Verify Status
export const VERIFY_STATUS = {
  VERIFIED: 'VERIFIED',
  UNVERIFIED: 'UNVERIFIED',
  INVALID: 'INVALID'
};

// Company Status
export const COMPANY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED'
};

// Blog Status
export const BLOG_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// Test Difficulty
export const TEST_DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Status Colors (for badges)
export const STATUS_COLORS = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
  VERIFIED: 'success',
  UNVERIFIED: 'warning',
  INVALID: 'destructive',
  ACTIVE: 'success',
  INACTIVE: 'secondary'
};

// Status Labels
export const STATUS_LABELS = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  SUSPENDED: 'Tạm khóa',
  VERIFIED: 'Đã xác thực',
  UNVERIFIED: 'Chưa xác thực',
  INVALID: 'Không hợp lệ',
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động'
};

// Role Labels
export const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  STUDENT: 'Sinh viên',
  COMPANY: 'Doanh nghiệp'
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4'
};

