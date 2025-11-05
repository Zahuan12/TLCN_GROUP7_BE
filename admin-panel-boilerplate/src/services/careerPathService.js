import api from './api';

/**
 * Career Path Service
 */
const careerPathService = {
  /**
   * Get all career paths
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/admin/career-paths', { params });
    return response.data;
  },

  /**
   * Get career path by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await api.get(`/admin/career-paths/${id}`);
    return response.data;
  },

  /**
   * Get lessons in career path
   * @param {string} id
   * @returns {Promise}
   */
  getLessons: async (id) => {
    const response = await api.get(`/admin/career-paths/${id}/lessons`);
    return response.data;
  },

  /**
   * Get tests in career path
   * @param {string} id
   * @returns {Promise}
   */
  getTests: async (id) => {
    const response = await api.get(`/admin/career-paths/${id}/tests`);
    return response.data;
  },

  /**
   * Get students in career path
   * @param {string} id
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getStudents: async (id, params = {}) => {
    const response = await api.get(`/admin/career-paths/${id}/students`, { params });
    return response.data;
  },

  /**
   * Add students to career path
   * @param {string} id
   * @param {Array} studentIds
   * @returns {Promise}
   */
  addStudents: async (id, studentIds) => {
    const response = await api.post(`/admin/career-paths/${id}/students`, {
      studentIds
    });
    return response.data;
  },

  /**
   * Remove student from career path
   * @param {string} pathId
   * @param {string} studentId
   * @returns {Promise}
   */
  removeStudent: async (pathId, studentId) => {
    const response = await api.delete(
      `/admin/career-paths/${pathId}/students/${studentId}`
    );
    return response.data;
  },

  /**
   * Update career path
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/career-paths/${id}`, data);
    return response.data;
  },

  /**
   * Delete career path
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/career-paths/${id}`);
    return response.data;
  }
};

export default careerPathService;

