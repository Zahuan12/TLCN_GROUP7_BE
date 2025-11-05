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
    description: 'Leading IT company in Vietnam with 30+ years of experience in software development and digital transformation.',
    status: 'APPROVED',
    registeredDate: '2025-10-15T00:00:00Z',
    approvedDate: '2025-10-16T10:00:00Z',
    contactEmail: 'hr@fpt.com.vn',
    contactPhone: '024-37371799',
    address: 'FPT Tower, 10 Pham Van Bach, Cau Giay, Ha Noi',
    documents: {
      businessLicense: 'https://example.com/fpt-license.pdf',
      taxCode: '0100200160'
    },
    stats: {
      careerPathsCount: 5,
      testsCount: 12,
      studentsReached: 234,
      avgTestScore: 78.5
    }
  },
  {
    id: 'company-2',
    userId: 'user-5',
    companyName: 'Viettel Solutions',
    industry: 'Telecommunications',
    website: 'https://viettelsolutions.vn',
    description: 'Digital transformation solutions provider with expertise in cloud computing, AI, and IoT.',
    status: 'PENDING',
    registeredDate: '2025-11-01T00:00:00Z',
    approvedDate: null,
    contactEmail: 'hr@viettelsolutions.vn',
    contactPhone: '024-39741166',
    address: 'Viettel Building, 285 Cach Mang Thang 8, District 10, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/viettel-license.pdf',
      taxCode: '0106869738'
    },
    stats: {
      careerPathsCount: 0,
      testsCount: 0,
      studentsReached: 0,
      avgTestScore: null
    }
  },
  {
    id: 'company-3',
    userId: 'user-6',
    companyName: 'TMA Solutions',
    industry: 'Software Development',
    website: 'https://tma.vn',
    description: 'Software outsourcing company specializing in web and mobile app development.',
    status: 'REJECTED',
    registeredDate: '2025-10-28T00:00:00Z',
    rejectedDate: '2025-10-30T15:00:00Z',
    rejectionReason: 'Giấy phép kinh doanh không hợp lệ. Vui lòng gửi lại giấy phép kinh doanh được cấp bởi Sở Kế hoạch và Đầu tư.',
    contactEmail: 'hr@tma.vn',
    contactPhone: '028-39971638',
    address: 'TMA Building, Quang Trung Software City, District 12, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/tma-license-invalid.pdf',
      taxCode: '0303546798'
    },
    stats: {
      careerPathsCount: 0,
      testsCount: 0,
      studentsReached: 0,
      avgTestScore: null
    }
  },
  {
    id: 'company-4',
    userId: 'user-7',
    companyName: 'Shopee Vietnam',
    industry: 'E-commerce',
    website: 'https://careers.shopee.vn',
    description: 'Leading e-commerce platform in Southeast Asia, revolutionizing online shopping experience.',
    status: 'APPROVED',
    registeredDate: '2025-10-20T00:00:00Z',
    approvedDate: '2025-10-22T09:00:00Z',
    contactEmail: 'careers@shopee.com',
    contactPhone: '028-73073388',
    address: 'Flemington Tower, 182 Le Dai Hanh, District 11, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/shopee-license.pdf',
      taxCode: '0312120987'
    },
    stats: {
      careerPathsCount: 3,
      testsCount: 8,
      studentsReached: 156,
      avgTestScore: 82.3
    }
  },
  {
    id: 'company-5',
    userId: 'user-8',
    companyName: 'VNG Corporation',
    industry: 'Software Development',
    website: 'https://careers.vng.com.vn',
    description: 'Pioneer in developing innovative digital products and services for Vietnamese and global markets.',
    status: 'APPROVED',
    registeredDate: '2025-09-10T00:00:00Z',
    approvedDate: '2025-09-12T14:30:00Z',
    contactEmail: 'tuyendung@vng.com.vn',
    contactPhone: '028-54587998',
    address: 'Z06 Street, Saigon High-Tech Park, District 9, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/vng-license.pdf',
      taxCode: '0304738941'
    },
    stats: {
      careerPathsCount: 7,
      testsCount: 15,
      studentsReached: 312,
      avgTestScore: 75.8
    }
  },
  {
    id: 'company-6',
    userId: 'user-9',
    companyName: 'MoMo Tech',
    industry: 'Finance',
    website: 'https://momo.vn/careers',
    description: 'Leading fintech company providing mobile payment and financial services.',
    status: 'PENDING',
    registeredDate: '2025-11-02T00:00:00Z',
    approvedDate: null,
    contactEmail: 'careers@momo.vn',
    contactPhone: '028-36222999',
    address: 'Phu My Hung Tower, District 7, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/momo-license.pdf',
      taxCode: '0312081657'
    },
    stats: {
      careerPathsCount: 0,
      testsCount: 0,
      studentsReached: 0,
      avgTestScore: null
    }
  },
  {
    id: 'company-7',
    userId: 'user-10',
    companyName: 'TIKI',
    industry: 'E-commerce',
    website: 'https://tiki.vn/tuyen-dung',
    description: 'Fast-growing e-commerce platform focused on customer experience and technology innovation.',
    status: 'SUSPENDED',
    registeredDate: '2025-08-15T00:00:00Z',
    approvedDate: '2025-08-16T10:00:00Z',
    suspendedDate: '2025-10-25T00:00:00Z',
    suspendedReason: 'Vi phạm quy định về nội dung bài test',
    contactEmail: 'hr@tiki.vn',
    contactPhone: '1900-6035',
    address: '52 Ut Tich, Tan Binh, Ho Chi Minh City',
    documents: {
      businessLicense: 'https://example.com/tiki-license.pdf',
      taxCode: '0312120904'
    },
    stats: {
      careerPathsCount: 2,
      testsCount: 5,
      studentsReached: 89,
      avgTestScore: 68.5
    }
  }
];

// Mock Career Paths
export const mockCareerPaths = [
  {
    id: 'path-1',
    title: 'Backend Development with Node.js',
    description: 'Comprehensive path covering Node.js, Express, databases (MongoDB, PostgreSQL), REST APIs, authentication, and microservices architecture. Perfect for aspiring backend developers.',
    companyId: '1',
    companyName: 'FPT Software',
    status: 'APPROVED',
    difficulty: 'INTERMEDIATE',
    duration: '6 tháng',
    totalLessons: 15,
    studentsCount: 234,
    completionRate: 68,
    testsCount: 8,
    createdAt: '2025-09-15T00:00:00Z',
    approvedAt: '2025-09-16T10:00:00Z'
  },
  {
    id: 'path-2',
    title: 'Frontend Development with React',
    description: 'Master modern frontend development with React, including hooks, state management (Redux, Zustand), routing, and best practices for building scalable web applications.',
    companyId: '1',
    companyName: 'FPT Software',
    status: 'APPROVED',
    difficulty: 'BEGINNER',
    duration: '4 tháng',
    totalLessons: 12,
    studentsCount: 189,
    completionRate: 72,
    testsCount: 6,
    createdAt: '2025-09-18T00:00:00Z',
    approvedAt: '2025-09-19T14:00:00Z'
  },
  {
    id: 'path-3',
    title: 'Data Science & Machine Learning',
    description: 'Learn Python programming, data analysis with Pandas, data visualization, machine learning algorithms, and deep learning with TensorFlow. Includes real-world projects.',
    companyId: '2',
    companyName: 'Viettel Solutions',
    status: 'PENDING',
    difficulty: 'ADVANCED',
    duration: '8 tháng',
    totalLessons: 18,
    studentsCount: 0,
    completionRate: 0,
    testsCount: 10,
    createdAt: '2025-11-01T00:00:00Z',
    approvedAt: null
  },
  {
    id: 'path-4',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Learn navigation, native modules, animations, and deployment to App Store and Google Play.',
    companyId: '3',
    companyName: 'VNG Corporation',
    status: 'APPROVED',
    difficulty: 'INTERMEDIATE',
    duration: '5 tháng',
    totalLessons: 14,
    studentsCount: 156,
    completionRate: 65,
    testsCount: 7,
    createdAt: '2025-09-25T00:00:00Z',
    approvedAt: '2025-09-26T09:00:00Z'
  },
  {
    id: 'path-5',
    title: 'DevOps & Cloud Infrastructure',
    description: 'Master DevOps practices including CI/CD, Docker, Kubernetes, AWS/Azure, monitoring, and infrastructure as code. Essential skills for modern software deployment.',
    companyId: '4',
    companyName: 'Tiki Corporation',
    status: 'APPROVED',
    difficulty: 'ADVANCED',
    duration: '7 tháng',
    totalLessons: 16,
    studentsCount: 98,
    completionRate: 58,
    testsCount: 9,
    createdAt: '2025-10-05T00:00:00Z',
    approvedAt: '2025-10-06T11:00:00Z'
  },
  {
    id: 'path-6',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn design principles, user research, wireframing, prototyping with Figma, and usability testing. Create beautiful and user-friendly interfaces.',
    companyId: '5',
    companyName: 'Sendo',
    status: 'REJECTED',
    difficulty: 'BEGINNER',
    duration: '3 tháng',
    totalLessons: 10,
    studentsCount: 0,
    completionRate: 0,
    testsCount: 4,
    createdAt: '2025-10-28T00:00:00Z',
    approvedAt: null,
    rejectedReason: 'Nội dung chưa đủ chi tiết, cần bổ sung thêm các bài thực hành.'
  }
];

// Mock Lessons for Career Paths
export const mockLessons = {
  'path-1': [
    {
      id: 'lesson-1-1',
      careerPathId: 'path-1',
      title: 'Introduction to Node.js',
      description: 'Learn what Node.js is, its architecture, and why it\'s popular for backend development.',
      order: 1,
      duration: '45 phút',
      type: 'Video',
      isPublished: true,
      createdAt: '2025-09-15T00:00:00Z'
    },
    {
      id: 'lesson-1-2',
      careerPathId: 'path-1',
      title: 'Setting up Development Environment',
      description: 'Install Node.js, npm, and set up your first project with best practices.',
      order: 2,
      duration: '30 phút',
      type: 'Tutorial',
      isPublished: true,
      createdAt: '2025-09-15T00:00:00Z'
    },
    {
      id: 'lesson-1-3',
      careerPathId: 'path-1',
      title: 'Express.js Fundamentals',
      description: 'Build your first web server with Express.js, routing, and middleware.',
      order: 3,
      duration: '60 phút',
      type: 'Video',
      isPublished: true,
      createdAt: '2025-09-16T00:00:00Z'
    },
    {
      id: 'lesson-1-4',
      careerPathId: 'path-1',
      title: 'Working with Databases',
      description: 'Connect to MongoDB and PostgreSQL, perform CRUD operations.',
      order: 4,
      duration: '75 phút',
      type: 'Video',
      isPublished: true,
      createdAt: '2025-09-17T00:00:00Z'
    },
    {
      id: 'lesson-1-5',
      careerPathId: 'path-1',
      title: 'Authentication & Authorization',
      description: 'Implement JWT authentication, password hashing, and role-based access control.',
      order: 5,
      duration: '90 phút',
      type: 'Video',
      isPublished: false,
      createdAt: '2025-09-18T00:00:00Z'
    }
  ],
  'path-2': [
    {
      id: 'lesson-2-1',
      careerPathId: 'path-2',
      title: 'React Basics',
      description: 'Components, JSX, props, and state management fundamentals.',
      order: 1,
      duration: '50 phút',
      type: 'Video',
      isPublished: true,
      createdAt: '2025-09-18T00:00:00Z'
    },
    {
      id: 'lesson-2-2',
      careerPathId: 'path-2',
      title: 'React Hooks',
      description: 'Master useState, useEffect, useContext, and custom hooks.',
      order: 2,
      duration: '65 phút',
      type: 'Video',
      isPublished: true,
      createdAt: '2025-09-19T00:00:00Z'
    },
    {
      id: 'lesson-2-3',
      careerPathId: 'path-2',
      title: 'State Management with Zustand',
      description: 'Learn modern state management patterns with Zustand.',
      order: 3,
      duration: '55 phút',
      type: 'Tutorial',
      isPublished: true,
      createdAt: '2025-09-20T00:00:00Z'
    }
  ],
  'path-3': [],
  'path-4': [
    {
      id: 'lesson-4-1',
      careerPathId: 'path-4',
      title: 'React Native Setup',
      description: 'Set up development environment for iOS and Android.',
      order: 1,
      duration: '40 phút',
      type: 'Tutorial',
      isPublished: true,
      createdAt: '2025-09-25T00:00:00Z'
    }
  ]
};

// Mock Students enrolled in Career Paths
export const mockPathStudents = {
  'path-1': [
    {
      id: 'user-1',
      fullName: 'Nguyễn Văn A',
      email: 'student001@gmail.com',
      progress: 85,
      completedLessons: 13,
      enrolledDate: '2025-09-20T00:00:00Z'
    },
    {
      id: 'user-2',
      fullName: 'Trần Thị B',
      email: 'student002@gmail.com',
      progress: 60,
      completedLessons: 9,
      enrolledDate: '2025-09-22T00:00:00Z'
    },
    {
      id: 'user-4',
      fullName: 'Lê Văn C',
      email: 'student003@gmail.com',
      progress: 40,
      completedLessons: 6,
      enrolledDate: '2025-10-01T00:00:00Z'
    }
  ],
  'path-2': [
    {
      id: 'user-1',
      fullName: 'Nguyễn Văn A',
      email: 'student001@gmail.com',
      progress: 100,
      completedLessons: 12,
      enrolledDate: '2025-09-25T00:00:00Z'
    },
    {
      id: 'user-2',
      fullName: 'Trần Thị B',
      email: 'student002@gmail.com',
      progress: 75,
      completedLessons: 9,
      enrolledDate: '2025-10-01T00:00:00Z'
    }
  ],
  'path-3': [],
  'path-4': [
    {
      id: 'user-4',
      fullName: 'Lê Văn C',
      email: 'student003@gmail.com',
      progress: 55,
      completedLessons: 8,
      enrolledDate: '2025-10-05T00:00:00Z'
    }
  ]
};

// Mock Blogs
export const mockBlogs = [
  {
    id: 'blog-1',
    title: 'What is Backend Development?',
    content: 'Backend development involves server-side programming and creating the logic that powers web applications. It includes working with databases, APIs, server management, and ensuring data security.\n\nKey technologies include Node.js, Python, Java, databases like MySQL and MongoDB, and frameworks like Express.js and Django.\n\nBackend developers are responsible for:\n- Creating and maintaining databases\n- Building RESTful APIs\n- Implementing authentication and authorization\n- Ensuring application security\n- Optimizing performance',
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
    title: '5 Tips for Learning React Effectively',
    content: 'React is a popular library for building user interfaces. Here are 5 essential tips to master React:\n\n1. **Understand JavaScript First**: Make sure you\'re comfortable with ES6+ features like arrow functions, destructuring, and modules.\n\n2. **Master the Basics**: Learn JSX, components, props, and state before diving into advanced topics.\n\n3. **Practice with Projects**: Build real projects like todo apps, weather apps, or e-commerce sites.\n\n4. **Learn Hooks**: useState, useEffect, useContext are essential for modern React development.\n\n5. **Study Best Practices**: Learn about component composition, code splitting, and performance optimization.',
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
  },
  {
    id: 'blog-3',
    title: 'How to Ace Your Technical Interview',
    content: 'Technical interviews can be challenging, but with proper preparation, you can succeed. Here\'s a comprehensive guide:\n\n**Before the Interview:**\n- Study data structures and algorithms\n- Practice coding problems on platforms like LeetCode\n- Review your past projects\n- Prepare questions to ask the interviewer\n\n**During the Interview:**\n- Think out loud and explain your approach\n- Ask clarifying questions\n- Start with a simple solution, then optimize\n- Test your code with edge cases\n\n**Common Topics:**\n- Arrays and strings\n- Linked lists and trees\n- Hash tables and graphs\n- Dynamic programming\n- System design (for senior roles)',
    imageUrl: null,
    category: 'Interview Tips',
    author: {
      id: 'user-2',
      fullName: 'Trần Thị B',
      role: 'STUDENT'
    },
    status: 'APPROVED',
    createdDate: '2025-11-01T15:00:00Z',
    approvedDate: '2025-11-01T16:30:00Z',
    stats: {
      views: 567,
      likes: 89,
      comments: 23
    }
  },
  {
    id: 'blog-4',
    title: 'AI and Machine Learning in 2025',
    content: 'The AI landscape is evolving rapidly...',
    imageUrl: null,
    category: 'Industry News',
    author: {
      id: 'user-3',
      fullName: 'FPT Software',
      role: 'COMPANY'
    },
    status: 'PENDING',
    createdDate: '2025-11-04T09:00:00Z',
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 'blog-5',
    title: 'From Intern to Full-Time Developer',
    content: 'My journey from a nervous intern to a confident full-stack developer at a leading tech company. Here\'s what I learned along the way and tips for making the most of your internship.',
    imageUrl: null,
    category: 'Success Stories',
    author: {
      id: 'user-1',
      fullName: 'Nguyễn Văn A',
      role: 'STUDENT'
    },
    status: 'APPROVED',
    createdDate: '2025-10-28T11:00:00Z',
    approvedDate: '2025-10-28T14:00:00Z',
    stats: {
      views: 892,
      likes: 156,
      comments: 45
    }
  },
  {
    id: 'blog-6',
    title: 'Top Programming Languages in 2025',
    content: 'An overview of the most in-demand programming languages...',
    imageUrl: null,
    category: 'Career Guide',
    author: {
      id: 'user-3',
      fullName: 'FPT Software',
      role: 'COMPANY'
    },
    status: 'PENDING',
    createdDate: '2025-11-04T14:00:00Z',
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 'blog-7',
    title: 'Understanding RESTful API Design',
    content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. Learn the principles and best practices for building robust APIs.',
    imageUrl: null,
    category: 'Tutorial',
    author: {
      id: 'user-2',
      fullName: 'Trần Thị B',
      role: 'STUDENT'
    },
    status: 'APPROVED',
    createdDate: '2025-10-30T10:00:00Z',
    approvedDate: '2025-10-30T12:00:00Z',
    stats: {
      views: 445,
      likes: 67,
      comments: 18
    }
  }
];

// Mock Comments for Blogs
export const mockComments = {
  'blog-2': [
    {
      id: 'comment-1',
      blogId: 'blog-2',
      content: 'Great tips! React Hooks really changed the game for me.',
      author: {
        id: 'user-1',
        fullName: 'Nguyễn Văn A',
        role: 'STUDENT'
      },
      createdDate: '2025-11-02T15:30:00Z'
    },
    {
      id: 'comment-2',
      blogId: 'blog-2',
      content: 'Thanks for sharing! Would love to see more advanced topics.',
      author: {
        id: 'user-2',
        fullName: 'Trần Thị B',
        role: 'STUDENT'
      },
      createdDate: '2025-11-02T16:00:00Z'
    },
    {
      id: 'comment-3',
      blogId: 'blog-2',
      content: 'Very helpful for beginners. Bookmarked!',
      author: {
        id: 'user-4',
        fullName: 'Lê Văn C',
        role: 'STUDENT'
      },
      createdDate: '2025-11-03T09:00:00Z'
    }
  ],
  'blog-3': [
    {
      id: 'comment-4',
      blogId: 'blog-3',
      content: 'This helped me prepare for my recent interview. Thank you!',
      author: {
        id: 'user-1',
        fullName: 'Nguyễn Văn A',
        role: 'STUDENT'
      },
      createdDate: '2025-11-02T08:00:00Z'
    },
    {
      id: 'comment-5',
      blogId: 'blog-3',
      content: 'Could you add more examples of system design questions?',
      author: {
        id: 'user-4',
        fullName: 'Lê Văn C',
        role: 'STUDENT'
      },
      createdDate: '2025-11-02T10:30:00Z'
    }
  ],
  'blog-5': [
    {
      id: 'comment-6',
      blogId: 'blog-5',
      content: 'Inspiring story! Congrats on your journey.',
      author: {
        id: 'user-2',
        fullName: 'Trần Thị B',
        role: 'STUDENT'
      },
      createdDate: '2025-10-29T14:00:00Z'
    }
  ],
  'blog-7': [
    {
      id: 'comment-7',
      blogId: 'blog-7',
      content: 'Clear explanation of REST principles. Thanks!',
      author: {
        id: 'user-1',
        fullName: 'Nguyễn Văn A',
        role: 'STUDENT'
      },
      createdDate: '2025-10-31T11:00:00Z'
    }
  ]
};

// Mock Dashboard Statistics
export const mockDashboardStats = {
  totalUsers: 1234,
  totalStudents: 1189,
  totalCompanies: 45,
  totalAdmins: 3,
  activeGroups: 28,
  totalBlogs: 567,
  pendingApprovals: {
    companies: 2, // Updated to match actual mock data (2 pending companies)
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

// Mock Students (detailed profiles)
export const mockStudents = [
  {
    id: 'user-1',
    userId: 'user-1',
    studentCode: 'SV2021001',
    fullName: 'Nguyễn Văn A',
    email: 'student001@gmail.com',
    phone: '0901234567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    university: 'Đại học Bách Khoa TP.HCM',
    major: 'Khoa học Máy tính',
    enrollmentYear: 2021,
    learningStatus: 'ACTIVE',
    overallProgress: 68,
    enrolledPathsCount: 2,
    completedLessons: 18,
    avgScore: 78.5,
    createdDate: '2025-09-01T00:00:00Z',
    lastLogin: '2025-11-05T10:00:00Z'
  },
  {
    id: 'user-2',
    userId: 'user-2',
    studentCode: 'SV2022045',
    fullName: 'Trần Thị B',
    email: 'student002@gmail.com',
    phone: '0902345678',
    address: 'Quận 3, TP. Hồ Chí Minh',
    university: 'Đại học Công nghệ Thông tin',
    major: 'Công nghệ Phần mềm',
    enrollmentYear: 2022,
    learningStatus: 'ACTIVE',
    overallProgress: 82,
    enrolledPathsCount: 3,
    completedLessons: 27,
    avgScore: 85.3,
    createdDate: '2025-09-05T00:00:00Z',
    lastLogin: '2025-11-05T09:30:00Z'
  },
  {
    id: 'user-4',
    userId: 'user-4',
    studentCode: 'SV2023012',
    fullName: 'Lê Văn C',
    email: 'student003@gmail.com',
    phone: '0903456789',
    address: 'Quận 7, TP. Hồ Chí Minh',
    university: 'Đại học FPT',
    major: 'Kỹ thuật Phần mềm',
    enrollmentYear: 2023,
    learningStatus: 'INACTIVE',
    overallProgress: 25,
    enrolledPathsCount: 1,
    completedLessons: 4,
    avgScore: 62.0,
    createdDate: '2025-10-20T00:00:00Z',
    lastLogin: '2025-10-25T14:00:00Z'
  },
  {
    id: 'student-4',
    userId: 'user-10',
    studentCode: 'SV2021078',
    fullName: 'Phạm Thị D',
    email: 'phamthid@student.edu.vn',
    phone: '0904567890',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    university: 'Đại học Quốc gia',
    major: 'Hệ thống Thông tin',
    enrollmentYear: 2021,
    learningStatus: 'COMPLETED',
    overallProgress: 100,
    enrolledPathsCount: 2,
    completedLessons: 24,
    avgScore: 92.5,
    createdDate: '2025-08-15T00:00:00Z',
    lastLogin: '2025-11-04T16:00:00Z'
  },
  {
    id: 'student-5',
    userId: 'user-11',
    studentCode: 'SV2022089',
    fullName: 'Hoàng Văn E',
    email: 'hoangvane@student.edu.vn',
    phone: '0905678901',
    address: 'Quận 10, TP. Hồ Chí Minh',
    university: 'Đại học Bách Khoa Hà Nội',
    major: 'Khoa học Dữ liệu',
    enrollmentYear: 2022,
    learningStatus: 'ACTIVE',
    overallProgress: 45,
    enrolledPathsCount: 1,
    completedLessons: 8,
    avgScore: 75.0,
    createdDate: '2025-09-10T00:00:00Z',
    lastLogin: '2025-11-05T08:00:00Z'
  }
];

// Mock Student Enrolled Paths (with detailed progress)
export const mockStudentEnrolledPaths = {
  'user-1': [
    {
      id: 'path-1',
      title: 'Backend Development with Node.js',
      companyName: 'FPT Software',
      progress: 85,
      completedLessons: 13,
      totalLessons: 15,
      enrolledDate: '2025-09-20T00:00:00Z'
    },
    {
      id: 'path-2',
      title: 'Frontend Development with React',
      companyName: 'FPT Software',
      progress: 50,
      completedLessons: 6,
      totalLessons: 12,
      enrolledDate: '2025-09-25T00:00:00Z'
    }
  ],
  'user-2': [
    {
      id: 'path-1',
      title: 'Backend Development with Node.js',
      companyName: 'FPT Software',
      progress: 60,
      completedLessons: 9,
      totalLessons: 15,
      enrolledDate: '2025-09-22T00:00:00Z'
    },
    {
      id: 'path-2',
      title: 'Frontend Development with React',
      companyName: 'FPT Software',
      progress: 100,
      completedLessons: 12,
      totalLessons: 12,
      enrolledDate: '2025-10-01T00:00:00Z'
    },
    {
      id: 'path-4',
      title: 'Mobile App Development with React Native',
      companyName: 'VNG Corporation',
      progress: 75,
      completedLessons: 10,
      totalLessons: 14,
      enrolledDate: '2025-10-15T00:00:00Z'
    }
  ],
  'user-4': [
    {
      id: 'path-4',
      title: 'Mobile App Development with React Native',
      companyName: 'VNG Corporation',
      progress: 25,
      completedLessons: 4,
      totalLessons: 14,
      enrolledDate: '2025-10-05T00:00:00Z'
    }
  ],
  'student-4': [
    {
      id: 'path-1',
      title: 'Backend Development with Node.js',
      companyName: 'FPT Software',
      progress: 100,
      completedLessons: 15,
      totalLessons: 15,
      enrolledDate: '2025-08-20T00:00:00Z'
    },
    {
      id: 'path-2',
      title: 'Frontend Development with React',
      companyName: 'FPT Software',
      progress: 100,
      completedLessons: 12,
      totalLessons: 12,
      enrolledDate: '2025-09-01T00:00:00Z'
    }
  ],
  'student-5': [
    {
      id: 'path-3',
      title: 'Data Science & Machine Learning',
      companyName: 'Viettel Solutions',
      progress: 45,
      completedLessons: 8,
      totalLessons: 18,
      enrolledDate: '2025-09-15T00:00:00Z'
    }
  ]
};

// Mock Student Test Results
export const mockStudentTestResults = {
  'user-1': [
    {
      id: 'test-1',
      testName: 'Node.js Fundamentals Assessment',
      careerPath: 'Backend Development with Node.js',
      score: 88,
      duration: '45 phút',
      completedDate: '2025-10-05T14:30:00Z',
      rank: 12
    },
    {
      id: 'test-2',
      testName: 'Express.js & REST APIs',
      careerPath: 'Backend Development with Node.js',
      score: 75,
      duration: '60 phút',
      completedDate: '2025-10-15T10:00:00Z',
      rank: 28
    },
    {
      id: 'test-3',
      testName: 'React Basics Quiz',
      careerPath: 'Frontend Development with React',
      score: 72,
      duration: '30 phút',
      completedDate: '2025-10-20T16:00:00Z'
    }
  ],
  'user-2': [
    {
      id: 'test-4',
      testName: 'Node.js Fundamentals Assessment',
      careerPath: 'Backend Development with Node.js',
      score: 85,
      duration: '45 phút',
      completedDate: '2025-10-08T11:00:00Z',
      rank: 18
    },
    {
      id: 'test-5',
      testName: 'React Advanced Patterns',
      careerPath: 'Frontend Development with React',
      score: 92,
      duration: '75 phút',
      completedDate: '2025-10-25T14:00:00Z',
      rank: 5
    },
    {
      id: 'test-6',
      testName: 'React Native Basics',
      careerPath: 'Mobile App Development with React Native',
      score: 78,
      duration: '50 phút',
      completedDate: '2025-10-30T09:30:00Z',
      rank: 22
    }
  ],
  'user-4': [
    {
      id: 'test-7',
      testName: 'React Native Setup & Basics',
      careerPath: 'Mobile App Development with React Native',
      score: 55,
      duration: '40 phút',
      completedDate: '2025-10-10T15:00:00Z'
    }
  ],
  'student-4': [
    {
      id: 'test-8',
      testName: 'Node.js Fundamentals Assessment',
      careerPath: 'Backend Development with Node.js',
      score: 95,
      duration: '45 phút',
      completedDate: '2025-09-10T10:00:00Z',
      rank: 2
    },
    {
      id: 'test-9',
      testName: 'Express.js & REST APIs',
      careerPath: 'Backend Development with Node.js',
      score: 98,
      duration: '60 phút',
      completedDate: '2025-09-20T14:00:00Z',
      rank: 1
    },
    {
      id: 'test-10',
      testName: 'React Complete Assessment',
      careerPath: 'Frontend Development with React',
      score: 90,
      duration: '90 phút',
      completedDate: '2025-10-05T11:00:00Z',
      rank: 8
    }
  ],
  'student-5': [
    {
      id: 'test-11',
      testName: 'Python for Data Science',
      careerPath: 'Data Science & Machine Learning',
      score: 75,
      duration: '60 phút',
      completedDate: '2025-10-01T13:00:00Z'
    }
  ]
};

// Mock Student Progress in Lessons (for a specific path)
export const mockStudentLessonProgress = {
  'user-1_path-1': [
    {
      id: 'lesson-1-1',
      title: 'Introduction to Node.js',
      description: 'Learn what Node.js is and its architecture',
      duration: '45 phút',
      type: 'Video',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-09-21T10:00:00Z',
      score: 90
    },
    {
      id: 'lesson-1-2',
      title: 'Setting up Development Environment',
      description: 'Install Node.js and set up your project',
      duration: '30 phút',
      type: 'Tutorial',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-09-22T14:00:00Z',
      score: 85
    },
    {
      id: 'lesson-1-3',
      title: 'Express.js Fundamentals',
      description: 'Build your first web server with Express',
      duration: '60 phút',
      type: 'Video',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-09-25T11:00:00Z',
      score: 88
    },
    {
      id: 'lesson-1-4',
      title: 'Working with Databases',
      description: 'Connect to MongoDB and PostgreSQL',
      duration: '75 phút',
      type: 'Video',
      isCompleted: false,
      isInProgress: true,
      completedDate: null
    },
    {
      id: 'lesson-1-5',
      title: 'Authentication & Authorization',
      description: 'Implement JWT authentication and RBAC',
      duration: '90 phút',
      type: 'Video',
      isCompleted: false,
      isInProgress: false,
      completedDate: null
    }
  ],
  'user-2_path-2': [
    {
      id: 'lesson-2-1',
      title: 'React Basics',
      description: 'Components, JSX, props, and state',
      duration: '50 phút',
      type: 'Video',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-10-02T09:00:00Z',
      score: 95
    },
    {
      id: 'lesson-2-2',
      title: 'React Hooks',
      description: 'Master useState, useEffect, useContext',
      duration: '65 phút',
      type: 'Video',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-10-05T10:00:00Z',
      score: 92
    },
    {
      id: 'lesson-2-3',
      title: 'State Management with Zustand',
      description: 'Modern state management patterns',
      duration: '55 phút',
      type: 'Tutorial',
      isCompleted: true,
      isInProgress: false,
      completedDate: '2025-10-08T14:00:00Z',
      score: 88
    }
  ]
};

// Mock Reports Data
export const mockReportsData = {
  usersGrowth: {
    totalUsers: 1234,
    totalStudents: 1189,
    totalCompanies: 45,
    growthRate: 12.5,
    chartData: [
      { month: 'Tháng 6', students: 142, companies: 5, total: 147 },
      { month: 'Tháng 7', students: 189, companies: 7, total: 196 },
      { month: 'Tháng 8', students: 245, companies: 9, total: 254 },
      { month: 'Tháng 9', students: 312, companies: 12, total: 324 },
      { month: 'Tháng 10', students: 401, companies: 15, total: 416 },
      { month: 'Tháng 11', students: 467, companies: 18, total: 485 }
    ]
  },
  
  topStudents: {
    avgScore: 88.2,
    totalCompleted: 156,
    avgProgress: 84,
    students: [
      {
        id: 'student-4',
        rank: 1,
        fullName: 'Phạm Thị D',
        studentCode: 'SV2021078',
        university: 'Đại học Quốc gia',
        major: 'Hệ thống Thông tin',
        avgScore: 92.5,
        completedLessons: 24,
        progress: 100,
        achievements: ['🏆 Perfect Score', '⚡ Fast Learner', '📚 Bookworm']
      },
      {
        id: 'user-2',
        rank: 2,
        fullName: 'Trần Thị B',
        studentCode: 'SV2022045',
        university: 'Đại học Công nghệ Thông tin',
        major: 'Công nghệ Phần mềm',
        avgScore: 85.3,
        completedLessons: 27,
        progress: 82,
        achievements: ['🎯 High Achiever', '💪 Consistent']
      },
      {
        id: 'user-1',
        rank: 3,
        fullName: 'Nguyễn Văn A',
        studentCode: 'SV2021001',
        university: 'Đại học Bách Khoa TP.HCM',
        major: 'Khoa học Máy tính',
        avgScore: 78.5,
        completedLessons: 18,
        progress: 68,
        achievements: ['🔥 Active Learner']
      },
      {
        id: 'student-5',
        rank: 4,
        fullName: 'Hoàng Văn E',
        studentCode: 'SV2022089',
        university: 'Đại học Bách Khoa Hà Nội',
        major: 'Khoa học Dữ liệu',
        avgScore: 75.0,
        completedLessons: 8,
        progress: 45,
        achievements: []
      },
      {
        id: 'user-4',
        rank: 5,
        fullName: 'Lê Văn C',
        studentCode: 'SV2023012',
        university: 'Đại học FPT',
        major: 'Kỹ thuật Phần mềm',
        avgScore: 62.0,
        completedLessons: 4,
        progress: 25,
        achievements: []
      }
    ]
  },
  
  popularPaths: {
    totalPaths: 6,
    totalEnrollments: 677,
    avgCompletionRate: 68,
    mostPopular: 'Backend Development with Node.js',
    chartData: [
      { name: 'Backend Dev', enrollments: 234 },
      { name: 'Frontend Dev', enrollments: 189 },
      { name: 'Mobile Dev', enrollments: 156 },
      { name: 'DevOps', enrollments: 98 }
    ],
    paths: [
      {
        id: 'path-1',
        title: 'Backend Development with Node.js',
        companyName: 'FPT Software',
        difficulty: 'INTERMEDIATE',
        duration: '6 tháng',
        enrollments: 234,
        lessons: 15,
        completionRate: 68
      },
      {
        id: 'path-2',
        title: 'Frontend Development with React',
        companyName: 'FPT Software',
        difficulty: 'BEGINNER',
        duration: '4 tháng',
        enrollments: 189,
        lessons: 12,
        completionRate: 72
      },
      {
        id: 'path-4',
        title: 'Mobile App Development with React Native',
        companyName: 'VNG Corporation',
        difficulty: 'INTERMEDIATE',
        duration: '5 tháng',
        enrollments: 156,
        lessons: 14,
        completionRate: 65
      },
      {
        id: 'path-5',
        title: 'DevOps & Cloud Infrastructure',
        companyName: 'Tiki Corporation',
        difficulty: 'ADVANCED',
        duration: '7 tháng',
        enrollments: 98,
        lessons: 16,
        completionRate: 58
      }
    ]
  },
  
  flaggedContent: {
    total: 12,
    pending: 5,
    resolved: 6,
    rejected: 1,
    highPriority: 2,
    flaggedItems: [
      {
        id: 'flag-1',
        type: 'BLOG',
        title: 'Kiếm tiền online dễ dàng',
        content: 'Chỉ cần 100k đầu tư, bạn sẽ kiếm được 10 triệu/tháng...',
        author: 'Nguyễn Văn X',
        createdDate: '2025-11-04T10:00:00Z',
        reportReason: 'Spam, lừa đảo, nội dung clickbait không liên quan đến hướng nghiệp',
        reportCount: 8,
        reporter: 'Trần Thị B',
        reportedDate: '2025-11-04T14:00:00Z',
        severity: 'HIGH',
        status: 'PENDING'
      },
      {
        id: 'flag-2',
        type: 'COMMENT',
        title: 'Bình luận vi phạm',
        content: 'Admin ngu, trang web rác...',
        author: 'User123',
        createdDate: '2025-11-04T15:30:00Z',
        reportReason: 'Ngôn từ không phù hợp, xúc phạm',
        reportCount: 5,
        reporter: 'Lê Văn C',
        reportedDate: '2025-11-04T16:00:00Z',
        severity: 'HIGH',
        status: 'PENDING'
      },
      {
        id: 'flag-3',
        type: 'BLOG',
        title: 'Thông tin sai về lương ngành IT',
        content: 'Lập trình viên mới ra trường lương 5000$/tháng...',
        author: 'Phạm Thị Y',
        createdDate: '2025-11-03T09:00:00Z',
        reportReason: 'Thông tin sai sự thật, gây hiểu lầm cho sinh viên',
        reportCount: 3,
        reporter: 'Hoàng Văn E',
        reportedDate: '2025-11-03T11:00:00Z',
        severity: 'MEDIUM',
        status: 'PENDING'
      },
      {
        id: 'flag-4',
        type: 'BLOG',
        title: 'Review công ty XYZ',
        content: 'Công ty này làm việc áp lực, OT không lương...',
        author: 'Anonymous',
        createdDate: '2025-11-02T14:00:00Z',
        reportReason: 'Nội dung tiêu cực, có thể ảnh hưởng uy tín doanh nghiệp',
        reportCount: 2,
        reporter: 'FPT Software',
        reportedDate: '2025-11-02T16:30:00Z',
        severity: 'MEDIUM',
        status: 'PENDING'
      },
      {
        id: 'flag-5',
        type: 'BLOG',
        title: 'Học lập trình như thế nào?',
        content: 'Mình mới bắt đầu học, mọi người tư vấn giúp...',
        author: 'Nguyễn Văn A',
        createdDate: '2025-11-01T10:00:00Z',
        reportReason: 'Nội dung không rõ ràng, chất lượng thấp',
        reportCount: 1,
        reporter: 'User456',
        reportedDate: '2025-11-01T11:00:00Z',
        severity: 'LOW',
        status: 'PENDING'
      },
      {
        id: 'flag-6',
        type: 'BLOG',
        title: 'Spam content đã xóa',
        content: '[Nội dung đã bị xóa]',
        author: 'Spammer',
        createdDate: '2025-10-30T08:00:00Z',
        reportReason: 'Spam quảng cáo',
        reportCount: 12,
        reporter: 'Multiple users',
        reportedDate: '2025-10-30T09:00:00Z',
        severity: 'HIGH',
        status: 'RESOLVED'
      }
    ]
  }
};

