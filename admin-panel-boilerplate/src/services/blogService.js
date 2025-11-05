import api from './api';

/**
 * Blog Service
 */
const blogService = {
  /**
   * Get all blogs with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/admin/blogs', { params });
    return response.data;
  },

  /**
   * Get blog by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await api.get(`/admin/blogs/${id}`);
    return response.data;
  },

  /**
   * Get blog comments
   * @param {string} id
   * @returns {Promise}
   */
  getComments: async (id) => {
    const response = await api.get(`/admin/blogs/${id}/comments`);
    return response.data;
  },

  /**
   * Approve blog
   * @param {string} id
   * @returns {Promise}
   */
  approve: async (id) => {
    const response = await api.put(`/admin/blogs/${id}/approve`);
    return response.data;
  },

  /**
   * Reject blog
   * @param {string} id
   * @param {string} reason
   * @param {boolean} warnUser
   * @returns {Promise}
   */
  reject: async (id, reason, warnUser = true) => {
    const response = await api.put(`/admin/blogs/${id}/reject`, {
      reason,
      warnUser
    });
    return response.data;
  },

  /**
   * Delete blog
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  /**
   * Delete comment
   * @param {string} id
   * @returns {Promise}
   */
  deleteComment: async (id) => {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  }
};

export default blogService;

