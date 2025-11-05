import api from './api';

/**
 * User Service
 */
const userService = {
  /**
   * Get all users with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Toggle user active status
   * @param {string} id
   * @param {boolean} isActive
   * @param {string} reason
   * @returns {Promise}
   */
  toggleActive: async (id, isActive, reason = '') => {
    const response = await api.put(`/admin/users/${id}/toggle-active`, {
      isActive,
      reason
    });
    return response.data;
  },

  /**
   * Verify user
   * @param {string} id
   * @returns {Promise}
   */
  verify: async (id) => {
    const response = await api.put(`/admin/users/${id}/verify`, {
      verifyStatus: 'VERIFIED'
    });
    return response.data;
  },

  /**
   * Delete user
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};

export default userService;

