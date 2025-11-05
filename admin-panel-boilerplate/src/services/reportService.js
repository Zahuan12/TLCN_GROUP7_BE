import api from './api';

/**
 * Report Service
 */
const reportService = {
  /**
   * Get users growth report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getUsersGrowth: async (params = {}) => {
    const response = await api.get('/admin/reports/users-growth', { params });
    return response.data;
  },

  /**
   * Get top students report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getTopStudents: async (params = {}) => {
    const response = await api.get('/admin/reports/top-students', { params });
    return response.data;
  },

  /**
   * Get popular career paths report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getPopularPaths: async (params = {}) => {
    const response = await api.get('/admin/reports/popular-career-paths', { params });
    return response.data;
  },

  /**
   * Get flagged content report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getFlaggedContent: async (params = {}) => {
    const response = await api.get('/admin/reports/flagged-content', { params });
    return response.data;
  }
};

export default reportService;

