import api from './api';
import { mockCompanies } from '../utils/mockData';

/**
 * Company Service - with mock implementation
 */
export const companyService = {
  /**
   * Get all companies with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...mockCompanies];

    // Filter by status
    if (params.status) {
      filtered = filtered.filter((c) => c.status === params.status);
    }

    // Filter by industry
    if (params.industry) {
      filtered = filtered.filter((c) => c.industry === params.industry);
    }

    // Search
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.companyName.toLowerCase().includes(search) ||
          c.description?.toLowerCase().includes(search)
      );
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      success: true,
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page,
      limit
    };
  },

  /**
   * Get company by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const company = mockCompanies.find((c) => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { success: true, data: company };
  },

  /**
   * Approve company
   * @param {string} id
   * @returns {Promise}
   */
  approve: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, this would make API call
    return {
      success: true,
      message: 'Company approved successfully'
    };
  },

  /**
   * Reject company
   * @param {string} id
   * @param {string} reason
   * @returns {Promise}
   */
  reject: async (id, reason) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, this would make API call
    return {
      success: true,
      message: 'Company rejected successfully'
    };
  },

  /**
   * Update company status
   * @param {string} id
   * @param {string} status - APPROVED, PENDING, REJECTED, SUSPENDED
   * @returns {Promise}
   */
  updateStatus: async (id, status) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Company status updated successfully'
    };
  },

  /**
   * Suspend company
   * @param {string} id
   * @param {string} reason
   * @param {number} duration - Days
   * @returns {Promise}
   */
  suspend: async (id, reason, duration = 30) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Company suspended successfully'
    };
  },

  /**
   * Get company career paths
   * @param {string} id
   * @returns {Promise}
   */
  getCareerPaths: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: [] };
  },

  /**
   * Get company tests
   * @param {string} id
   * @returns {Promise}
   */
  getTests: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: [] };
  },

  /**
   * Delete company
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Company deleted successfully'
    };
  }
};

export default companyService;

