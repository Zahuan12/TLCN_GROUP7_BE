import { mockCareerPaths, mockLessons, mockPathStudents } from '../utils/mockData';

// Mock implementation - replace with real API calls later
const careerPathService = {
  /**
   * Get all career paths
   * @param {Object} params - Query parameters (companyId, status, difficulty, search)
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    let filtered = [...mockCareerPaths];
    
    // Filter by company
    if (params.companyId && params.companyId !== 'ALL') {
      filtered = filtered.filter(path => path.companyId === params.companyId);
    }
    
    // Filter by status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(path => path.status === params.status);
    }
    
    // Filter by difficulty
    if (params.difficulty && params.difficulty !== 'ALL') {
      filtered = filtered.filter(path => path.difficulty === params.difficulty);
    }
    
    // Search by title
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(path => 
        path.title.toLowerCase().includes(searchLower) ||
        path.description.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },

  /**
   * Get career path by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const path = mockCareerPaths.find(p => p.id === id);
    if (!path) {
      throw new Error('Career path not found');
    }
    
    return {
      success: true,
      data: path
    };
  },

  /**
   * Get lessons in career path
   * @param {string} id
   * @returns {Promise}
   */
  getLessons: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lessons = mockLessons[id] || [];
    
    return {
      success: true,
      data: lessons
    };
  },

  /**
   * Get students in career path
   * @param {string} id
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getStudents: async (id, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const students = mockPathStudents[id] || [];
    
    return {
      success: true,
      data: students,
      total: students.length
    };
  },

  /**
   * Add students to career path
   * @param {string} id
   * @param {Array} studentIds
   * @returns {Promise}
   */
  addStudents: async (id, studentIds) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Adding ${studentIds.length} students to path ${id}`);
    
    return {
      success: true,
      message: `Added ${studentIds.length} students successfully`
    };
  },

  /**
   * Approve career path
   * @param {string} id
   * @returns {Promise}
   */
  approve: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const path = mockCareerPaths.find(p => p.id === id);
    if (path) {
      path.status = 'APPROVED';
      path.approvedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      message: 'Career path approved successfully'
    };
  },

  /**
   * Reject career path
   * @param {string} id
   * @param {string} reason
   * @returns {Promise}
   */
  reject: async (id, reason) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const path = mockCareerPaths.find(p => p.id === id);
    if (path) {
      path.status = 'REJECTED';
      path.rejectedReason = reason;
    }
    
    return {
      success: true,
      message: 'Career path rejected'
    };
  },

  /**
   * Update career path
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Updating path ${id}:`, data);
    
    return {
      success: true,
      message: 'Career path updated successfully'
    };
  },

  /**
   * Delete career path
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockCareerPaths.findIndex(p => p.id === id);
    if (index !== -1) {
      mockCareerPaths.splice(index, 1);
    }
    
    return {
      success: true,
      message: 'Career path deleted successfully'
    };
  }
};

export default careerPathService;

