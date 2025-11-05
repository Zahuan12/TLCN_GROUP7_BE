import api from './api';

/**
 * Company Service
 */
const companyService = {
  /**
   * Get all companies with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/admin/companies', { params });
    return response.data;
  },

  /**
   * Get company by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  /**
   * Approve company
   * @param {string} id
   * @returns {Promise}
   */
  approve: async (id) => {
    const response = await api.put(`/admin/companies/${id}/approve`);
    return response.data;
  },

  /**
   * Reject company
   * @param {string} id
   * @param {string} reason
   * @returns {Promise}
   */
  reject: async (id, reason) => {
    const response = await api.put(`/admin/companies/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Suspend company
   * @param {string} id
   * @param {string} reason
   * @param {number} duration - Days
   * @returns {Promise}
   */
  suspend: async (id, reason, duration = 30) => {
    const response = await api.put(`/admin/companies/${id}/suspend`, {
      reason,
      duration
    });
    return response.data;
  },

  /**
   * Get company career paths
   * @param {string} id
   * @returns {Promise}
   */
  getCareerPaths: async (id) => {
    const response = await api.get(`/admin/companies/${id}/career-paths`);
    return response.data;
  },

  /**
   * Get company tests
   * @param {string} id
   * @returns {Promise}
   */
  getTests: async (id) => {
    const response = await api.get(`/admin/companies/${id}/tests`);
    return response.data;
  },

  /**
   * Delete company
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/companies/${id}`);
    return response.data;
  }
};

export default companyService;

