import api from './api';

/**
 * Statistics Service
 */
const statisticsService = {
  /**
   * Get overview statistics
   * @returns {Promise}
   */
  getOverview: async () => {
    const response = await api.get('/admin/statistics/overview');
    return response.data;
  },

  /**
   * Get users growth data
   * @param {number} months
   * @returns {Promise}
   */
  getUsersGrowth: async (months = 12) => {
    const response = await api.get('/admin/statistics/users-growth', {
      params: { months }
    });
    return response.data;
  },

  /**
   * Get recent activities
   * @param {number} limit
   * @returns {Promise}
   */
  getActivities: async (limit = 20) => {
    const response = await api.get('/admin/statistics/activities', {
      params: { limit }
    });
    return response.data;
  }
};

export default statisticsService;

