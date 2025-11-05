import { 
  mockStudents, 
  mockStudentEnrolledPaths, 
  mockStudentTestResults,
  mockStudentLessonProgress 
} from '../utils/mockData';

// Mock implementation - replace with real API calls later
const studentService = {
  /**
   * Get all students with filters
   * @param {Object} params - Query parameters (careerPath, status, university, search)
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockStudents];
    
    // Filter by career path (check if student enrolled in that path)
    if (params.careerPath && params.careerPath !== 'ALL') {
      filtered = filtered.filter(student => {
        const enrolledPaths = mockStudentEnrolledPaths[student.userId] || [];
        return enrolledPaths.some(path => path.id === params.careerPath);
      });
    }
    
    // Filter by learning status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(student => student.learningStatus === params.status);
    }
    
    // Filter by university
    if (params.university && params.university !== 'ALL') {
      filtered = filtered.filter(student => student.university.includes(params.university));
    }
    
    // Search by name, code, or email
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(student => 
        student.fullName.toLowerCase().includes(searchLower) ||
        student.studentCode.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },

  /**
   * Get student by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const student = mockStudents.find(s => s.id === id || s.userId === id);
    if (!student) {
      throw new Error('Student not found');
    }
    
    return {
      success: true,
      data: student
    };
  },

  /**
   * Get student enrolled paths
   * @param {string} userId
   * @returns {Promise}
   */
  getEnrolledPaths: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const paths = mockStudentEnrolledPaths[userId] || [];
    
    return {
      success: true,
      data: paths
    };
  },

  /**
   * Get student test results
   * @param {string} userId
   * @returns {Promise}
   */
  getTestResults: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const results = mockStudentTestResults[userId] || [];
    
    return {
      success: true,
      data: results
    };
  },

  /**
   * Get student progress in a specific career path
   * @param {string} userId
   * @param {string} pathId
   * @returns {Promise}
   */
  getPathProgress: async (userId, pathId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const key = `${userId}_${pathId}`;
    const lessons = mockStudentLessonProgress[key] || [];
    
    // If no specific progress, generate from mockLessons
    if (lessons.length === 0) {
      // Return empty or generate generic data
      return {
        success: true,
        data: {
          lessons: [],
          careerPath: mockStudentEnrolledPaths[userId]?.find(p => p.id === pathId)
        }
      };
    }
    
    return {
      success: true,
      data: {
        lessons,
        careerPath: mockStudentEnrolledPaths[userId]?.find(p => p.id === pathId)
      }
    };
  },

  /**
   * Update student
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const student = mockStudents.find(s => s.id === id || s.userId === id);
    if (student) {
      Object.assign(student, data);
    }
    
    console.log(`Updating student ${id}:`, data);
    
    return {
      success: true,
      message: 'Student updated successfully'
    };
  },

  /**
   * Suspend student
   * @param {string} id
   * @param {string} reason
   * @returns {Promise}
   */
  suspend: async (id, reason) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const student = mockStudents.find(s => s.id === id || s.userId === id);
    if (student) {
      student.learningStatus = 'INACTIVE';
      student.suspendedReason = reason;
    }
    
    console.log(`Suspending student ${id}. Reason: ${reason}`);
    
    return {
      success: true,
      message: 'Student suspended successfully'
    };
  },

  /**
   * Delete student
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockStudents.findIndex(s => s.id === id || s.userId === id);
    if (index !== -1) {
      mockStudents.splice(index, 1);
    }
    
    return {
      success: true,
      message: 'Student deleted successfully'
    };
  }
};

export default studentService;

