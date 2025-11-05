import api from './api';

/**
 * Location Service
 */
const locationService = {
  /**
   * Get all locations
   * @returns {Promise}
   */
  getAll: async () => {
    const response = await api.get('/admin/locations');
    return response.data;
  },

  /**
   * Create location
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await api.post('/admin/locations', data);
    return response.data;
  },

  /**
   * Update location
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/locations/${id}`, data);
    return response.data;
  },

  /**
   * Delete location
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/locations/${id}`);
    return response.data;
  }
};

export default locationService;

