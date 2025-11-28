const { Op } = require('sequelize');
const db = require('../models');

class SearchService {
  /**
   * Tìm kiếm users (students) theo username hoặc fullName
   */
  async searchUsers(query, limit = 10) {
    if (!query || query.trim().length === 0) return [];

    console.log('🔍 Searching users (students) with query:', query);

    const students = await db.Student.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          where: {
            [Op.or]: [
              { username: { [Op.like]: `%${query}%` } },
              { fullName: { [Op.like]: `%${query}%` } },
              { email: { [Op.like]: `%${query}%` } }
            ],
            isActive: true,
            role: 'STUDENT'
            // Tạm bỏ verifyStatus để test
          },
          attributes: ['id', 'username', 'fullName', 'email', 'avatar', 'verifyStatus', 'role'],
          required: true
        }
      ],
      limit,
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found users (students):', students.length);
    
    // Transform to match frontend expectation
    const transformedUsers = students.map(student => ({
      id: student.user.id, // Use user ID, not student ID
      username: student.user.username,
      fullName: student.user.fullName,
      email: student.user.email,
      avatar: student.user.avatar,
      role: student.user.role,
      verifyStatus: student.user.verifyStatus,
      // Extra info from student
      major: student.major,
      school: student.school
    }));

    if (transformedUsers.length > 0) {
      console.log('First transformed result:', {
        id: transformedUsers[0].id,
        fullName: transformedUsers[0].fullName,
        role: transformedUsers[0].role,
        verifyStatus: transformedUsers[0].verifyStatus
      });
    }

    return transformedUsers;
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

    console.log('✅ Found companies:', companies.length);
    
    // Transform to include user ID for linking
    const transformedCompanies = companies.map(company => ({
      id: company.id,
      companyName: company.companyName,
      industry: company.industry,
      avatar: company.user?.avatar,
      website: company.website,
      // Add user ID for linking to user profile
      userId: company.user?.id
    }));

    return transformedCompanies;
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
   * Tìm kiếm tất cả (students, companies, courses)
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
