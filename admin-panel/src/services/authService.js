import api from './api';

/**
 * Authentication Service
 */
const authService = {
  /**
   * Login
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  login: async (username, password) => {
    const response = await api.post('/auth', { username, password });
    return response.data;
  },

  /**
   * Logout
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors, clear local storage anyway
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise}
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  /**
   * Get current user from token
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};

export default authService;

