import { mockReportsData } from '../utils/mockData';

// Mock implementation - replace with real API calls later
const reportService = {
  /**
   * Get users growth report
   * @returns {Promise}
   */
  getUsersGrowth: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockReportsData.usersGrowth
    };
  },

  /**
   * Get top students report
   * @param {number} limit - Number of top students to return
   * @returns {Promise}
   */
  getTopStudents: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const students = mockReportsData.topStudents.students.slice(0, limit);
    
    return {
      success: true,
      data: {
        ...mockReportsData.topStudents,
        students
      }
    };
  },

  /**
   * Get popular career paths report
   * @returns {Promise}
   */
  getPopularPaths: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockReportsData.popularPaths
    };
  },

  /**
   * Get flagged content report
   * @param {string} status - Filter by status (PENDING, RESOLVED, REJECTED)
   * @returns {Promise}
   */
  getFlaggedContent: async (status = '') => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let items = [...mockReportsData.flaggedContent.flaggedItems];
    
    if (status) {
      items = items.filter(item => item.status === status);
    }
    
    return {
      success: true,
      data: {
        ...mockReportsData.flaggedContent,
        flaggedItems: items
      }
    };
  },

  /**
   * Handle flagged content action
   * @param {string} action - approve, remove, dismiss
   * @param {string} itemId
   * @returns {Promise}
   */
  handleFlaggedContent: async (action, itemId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const item = mockReportsData.flaggedContent.flaggedItems.find(i => i.id === itemId);
    if (item) {
      if (action === 'approve') {
        item.status = 'REJECTED'; // Report is rejected, content is approved
        mockReportsData.flaggedContent.pending--;
        mockReportsData.flaggedContent.rejected++;
      } else if (action === 'remove') {
        item.status = 'RESOLVED'; // Content removed
        mockReportsData.flaggedContent.pending--;
        mockReportsData.flaggedContent.resolved++;
      }
    }
    
    console.log(`Flagged content ${itemId} action: ${action}`);
    
    return {
      success: true,
      message: `Action ${action} completed successfully`
    };
  }
};

export default reportService;
