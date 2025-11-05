import { mockBlogs, mockComments } from '../utils/mockData';

// Mock implementation - replace with real API calls later
const blogService = {
  /**
   * Get all blogs with filters
   * @param {Object} params - Query parameters (status, category, authorRole, search)
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockBlogs];
    
    // Filter by status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(blog => blog.status === params.status);
    }
    
    // Filter by category
    if (params.category && params.category !== 'ALL') {
      filtered = filtered.filter(blog => blog.category === params.category);
    }
    
    // Filter by author role
    if (params.authorRole && params.authorRole !== 'ALL') {
      filtered = filtered.filter(blog => blog.author.role === params.authorRole);
    }
    
    // Search by title or content
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },

  /**
   * Get blog by ID
   * @param {string} id
   * @returns {Promise}
   */
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const blog = mockBlogs.find(b => b.id === id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    return {
      success: true,
      data: blog
    };
  },

  /**
   * Get blog comments
   * @param {string} id
   * @returns {Promise}
   */
  getComments: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const comments = mockComments[id] || [];
    
    return {
      success: true,
      data: comments
    };
  },

  /**
   * Approve blog
   * @param {string} id
   * @returns {Promise}
   */
  approve: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const blog = mockBlogs.find(b => b.id === id);
    if (blog) {
      blog.status = 'APPROVED';
      blog.approvedDate = new Date().toISOString();
    }
    
    return {
      success: true,
      message: 'Blog approved successfully'
    };
  },

  /**
   * Reject blog
   * @param {string} id
   * @param {string} reason
   * @param {boolean} warnUser
   * @returns {Promise}
   */
  reject: async (id, reason, warnUser = true) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const blog = mockBlogs.find(b => b.id === id);
    if (blog) {
      blog.status = 'REJECTED';
      blog.rejectedReason = reason;
      blog.rejectedDate = new Date().toISOString();
    }
    
    console.log(`Blog ${id} rejected. Reason: ${reason}. Warn user: ${warnUser}`);
    
    return {
      success: true,
      message: warnUser ? 'Blog rejected and user warned' : 'Blog rejected'
    };
  },

  /**
   * Delete blog
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockBlogs.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBlogs.splice(index, 1);
    }
    
    return {
      success: true,
      message: 'Blog deleted successfully'
    };
  },

  /**
   * Delete comment
   * @param {string} commentId
   * @returns {Promise}
   */
  deleteComment: async (commentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and remove comment from mockComments
    for (const blogId in mockComments) {
      const index = mockComments[blogId].findIndex(c => c.id === commentId);
      if (index !== -1) {
        mockComments[blogId].splice(index, 1);
        break;
      }
    }
    
    return {
      success: true,
      message: 'Comment deleted successfully'
    };
  }
};

export default blogService;

