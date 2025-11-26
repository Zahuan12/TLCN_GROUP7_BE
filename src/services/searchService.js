const { Op } = require('sequelize');
const db = require('../models');

class SearchService {
  /**
   * Tìm kiếm users theo username hoặc fullName
   */
  async searchUsers(query, limit = 10) {
    if (!query || query.trim().length === 0) return [];

    const users = await db.User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { username: { [Op.like]: `%${query}%` } },
              { fullName: { [Op.like]: `%${query}%` } },
              { email: { [Op.like]: `%${query}%` } }
            ]
          },
          { isActive: true },
          { verifyStatus: 'VERIFIED' }
        ]
      },
      attributes: ['id', 'username', 'fullName', 'email', 'avatar', 'role'],
      limit,
      order: [['fullName', 'ASC']]
    });

    return users;
  }

  /**
   * Tìm kiếm companies theo companyName
   */
  async searchCompanies(query, limit = 10) {
    if (!query || query.trim().length === 0) return [];

    const companies = await db.Company.findAll({
      where: {
        [Op.or]: [
          { companyName: { [Op.like]: `%${query}%` } },
          { industry: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'avatar'],
          where: { isActive: true }
        }
      ],
      limit,
      order: [['companyName', 'ASC']]
    });

    return companies;
  }

  /**
   * Tìm kiếm courses (CareerPath) theo title hoặc description
   */
  async searchCourses(query, limit = 10) {
    if (!query || query.trim().length === 0) return [];

    const courses = await db.CareerPath.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { title: { [Op.like]: `%${query}%` } },
              { description: { [Op.like]: `%${query}%` } }
            ]
          },
          { status: 'PUBLISHED' } // Chỉ tìm courses đã publish
        ]
      },
      include: [
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'companyName', 'industry'],
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'fullName']
            }
          ]
        },
        {
          model: db.Lesson,
          attributes: ['id'],
          required: false
        }
      ],
      limit,
      order: [['createdAt', 'DESC']]
    });

    // Add lesson count
    const coursesWithCount = courses.map(course => {
      const courseData = course.toJSON();
      courseData.lessonCount = courseData.Lessons?.length || 0;
      delete courseData.Lessons;
      return courseData;
    });

    return coursesWithCount;
  }

  /**
   * Tìm kiếm tất cả (users, companies, courses)
   */
  async searchAll(query, limit = 5) {
    if (!query || query.trim().length === 0) {
      return {
        users: [],
        companies: [],
        courses: []
      };
    }

    const [users, companies, courses] = await Promise.all([
      this.searchUsers(query, limit),
      this.searchCompanies(query, limit),
      this.searchCourses(query, limit)
    ]);

    return {
      users,
      companies,
      courses,
      total: users.length + companies.length + courses.length
    };
  }
}

module.exports = new SearchService();
