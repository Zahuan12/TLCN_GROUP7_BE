/**
 * Mock data for development
 */

// Mock Users
export const mockUsers = [
  {
    id: 'user-1',
    username: 'student001',
    email: 'student001@gmail.com',
    fullName: 'Nguyễn Văn A',
    role: 'STUDENT',
    isActive: true,
    verifyStatus: 'VERIFIED',
    createdDate: '2025-09-01T00:00:00Z',
    lastLogin: '2025-11-03T10:00:00Z'
  },
  {
    id: 'user-2',
    username: 'student002',
    email: 'student002@gmail.com',
    fullName: 'Trần Thị B',
    role: 'STUDENT',
    isActive: true,
    verifyStatus: 'VERIFIED',
    createdDate: '2025-09-05T00:00:00Z',
    lastLogin: '2025-11-03T09:30:00Z'
  },
  {
    id: 'user-3',
    username: 'fpt_software',
    email: 'contact@fpt.com.vn',
    fullName: 'FPT Software',
    role: 'COMPANY',
    isActive: true,
    verifyStatus: 'VERIFIED',
    createdDate: '2025-10-15T00:00:00Z',
    lastLogin: '2025-11-02T14:30:00Z'
  },
  {
    id: 'user-4',
    username: 'student003',
    email: 'student003@gmail.com',
    fullName: 'Lê Văn C',
    role: 'STUDENT',
    isActive: false,
    verifyStatus: 'UNVERIFIED',
    createdDate: '2025-10-20T00:00:00Z',
    lastLogin: null
  }
];

// Mock Companies
export const mockCompanies = [
  {
    id: 'company-1',
    userId: 'user-3',
    companyName: 'FPT Software',
    industry: 'IT Services',
    website: 'https://fpt.com.vn',
    description: 'Leading IT company in Vietnam',
    status: 'APPROVED',
    registeredDate: '2025-10-15T00:00:00Z',
    approvedDate: '2025-10-16T10:00:00Z',
    stats: {
      careerPathsCount: 5,
      testsCount: 12,
      studentsReached: 234
    }
  },
  {
    id: 'company-2',
    userId: 'user-5',
    companyName: 'Viettel Solutions',
    industry: 'Telecommunications',
    website: 'https://viettelsolutions.vn',
    description: 'Digital transformation solutions',
    status: 'PENDING',
    registeredDate: '2025-11-01T00:00:00Z',
    approvedDate: null,
    stats: {
      careerPathsCount: 0,
      testsCount: 0,
      studentsReached: 0
    }
  },
  {
    id: 'company-3',
    userId: 'user-6',
    companyName: 'TMA Solutions',
    industry: 'Software Development',
    website: 'https://tma.vn',
    description: 'Software outsourcing company',
    status: 'REJECTED',
    registeredDate: '2025-10-28T00:00:00Z',
    rejectedDate: '2025-10-30T15:00:00Z',
    rejectionReason: 'Giấy phép kinh doanh không hợp lệ',
    stats: {
      careerPathsCount: 0,
      testsCount: 0,
      studentsReached: 0
    }
  }
];

// Mock Career Paths
export const mockCareerPaths = [
  {
    id: 'path-1',
    title: 'Backend Development Path',
    description: 'Learn Node.js, databases, REST APIs, microservices',
    companyId: 'company-1',
    companyName: 'FPT Software',
    studentsCount: 234,
    lessonsCount: 15,
    testsCount: 8,
    createdDate: '2025-10-15T00:00:00Z'
  },
  {
    id: 'path-2',
    title: 'Frontend Development Path',
    description: 'Learn React, Vue, Angular, UI/UX',
    companyId: 'company-1',
    companyName: 'FPT Software',
    studentsCount: 189,
    lessonsCount: 12,
    testsCount: 6,
    createdDate: '2025-10-18T00:00:00Z'
  },
  {
    id: 'path-3',
    title: 'Data Science Path',
    description: 'Learn Python, Machine Learning, Data Analysis',
    companyId: 'company-1',
    companyName: 'FPT Software',
    studentsCount: 156,
    lessonsCount: 18,
    testsCount: 10,
    createdDate: '2025-10-20T00:00:00Z'
  }
];

// Mock Blogs
export const mockBlogs = [
  {
    id: 'blog-1',
    title: 'What is Backend Development?',
    content: 'Backend development involves server-side programming...',
    imageUrl: null,
    category: 'Career Guide',
    author: {
      id: 'user-1',
      fullName: 'Nguyễn Văn A',
      role: 'STUDENT'
    },
    status: 'PENDING',
    createdDate: '2025-11-03T08:00:00Z',
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 'blog-2',
    title: '5 Tips for Learning React',
    content: 'React is a popular library for building user interfaces...',
    imageUrl: null,
    category: 'Tutorial',
    author: {
      id: 'user-3',
      fullName: 'FPT Software',
      role: 'COMPANY'
    },
    status: 'APPROVED',
    createdDate: '2025-11-02T10:00:00Z',
    approvedDate: '2025-11-02T14:00:00Z',
    stats: {
      views: 234,
      likes: 45,
      comments: 12
    }
  }
];

// Mock Dashboard Statistics
export const mockDashboardStats = {
  totalUsers: 1234,
  totalStudents: 1189,
  totalCompanies: 45,
  totalAdmins: 3,
  activeGroups: 28,
  totalBlogs: 567,
  pendingApprovals: {
    companies: 8,
    blogs: 15
  },
  growth: {
    users: {
      value: 12.5,
      trend: 'up'
    },
    companies: {
      value: 8.3,
      trend: 'up'
    }
  }
};

// Mock Users Growth Chart Data
export const mockUsersGrowthData = {
  labels: ['2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10'],
  datasets: [
    {
      label: 'Students',
      data: [120, 185, 245, 312, 389, 456],
      color: '#3B82F6'
    },
    {
      label: 'Companies',
      data: [5, 8, 12, 18, 25, 32],
      color: '#8B5CF6'
    }
  ]
};

// Mock Recent Activities
export const mockActivities = [
  {
    id: 'activity-1',
    type: 'COMPANY_REGISTERED',
    actor: {
      id: 'company-2',
      name: 'Viettel Solutions'
    },
    description: 'Công ty mới đăng ký',
    timestamp: '2025-11-03T10:30:00Z'
  },
  {
    id: 'activity-2',
    type: 'BLOG_PUBLISHED',
    actor: {
      id: 'user-1',
      name: 'Nguyễn Văn A'
    },
    description: 'Đăng bài viết mới: "Backend Development Guide"',
    timestamp: '2025-11-03T09:15:00Z'
  },
  {
    id: 'activity-3',
    type: 'TEST_COMPLETED',
    actor: {
      id: 'user-2',
      name: 'Trần Thị B'
    },
    description: 'Hoàn thành test "Node.js Fundamentals" với điểm 85',
    timestamp: '2025-11-03T08:45:00Z'
  }
];

// Mock Locations
export const mockLocations = [
  {
    id: 'location-1',
    code: 'HN',
    name: 'Hà Nội',
    description: 'Thủ đô Việt Nam',
    createdDate: '2025-01-01T00:00:00Z'
  },
  {
    id: 'location-2',
    code: 'HCM',
    name: 'Hồ Chí Minh',
    description: 'Thành phố lớn nhất Việt Nam',
    createdDate: '2025-01-01T00:00:00Z'
  },
  {
    id: 'location-3',
    code: 'DN',
    name: 'Đà Nẵng',
    description: 'Thành phố miền Trung',
    createdDate: '2025-01-01T00:00:00Z'
  }
];

// Helper function to generate more mock users
export const generateMockUsers = (count = 50) => {
  const users = [];
  const roles = ['STUDENT', 'COMPANY'];
  const statuses = [true, false];
  const verifyStatuses = ['VERIFIED', 'UNVERIFIED'];

  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i + 10}`,
      username: `user${i + 10}`,
      email: `user${i + 10}@example.com`,
      fullName: `User ${i + 10}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      isActive: statuses[Math.floor(Math.random() * statuses.length)],
      verifyStatus: verifyStatuses[Math.floor(Math.random() * verifyStatuses.length)],
      createdDate: new Date(2025, 8, Math.floor(Math.random() * 30)).toISOString(),
      lastLogin: Math.random() > 0.3 ? new Date().toISOString() : null
    });
  }

  return users;
};

