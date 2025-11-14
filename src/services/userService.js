const db = require('../models');
// const MailService = require("./mailService");
const kafkaModule = require("../kafka");
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(data) {
    const { email, username, fullName, role, password, provider = 'LOCAL', providerId } = data;

    // Kiểm tra email trùng
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) throw new Error('Email đã tồn tại');

    // Tạo user
    const user = await db.User.create({ email, username, fullName, role });

    // Nếu provider = LOCAL, hash password
    let hashedPassword = null;
    if (provider === 'LOCAL' && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

      // ✅ Thêm bản ghi student với studentId là user.id (vì nó là primary key)
    if (role === 'STUDENT') {
      await db.Student.create({
        studentId: user.id, // studentId là primary key, dùng user.id
        major: null,
        school: null
      });
    }
    if (role === 'COMPANY') {
      await db.Company.create({
        companyId: user.id, // companyId là primary key, dùng user.id
        companyName: "unknown",
        industry: null,
        website: null,
        description: null
      });
    }

    await db.AuthProvider.create({
      userId: user.id,
      provider,
      providerId: provider === 'GOOGLE' ? providerId : null,
      password: hashedPassword
    });
    await kafkaModule.producers.mailProducer.sendMailEvent({
      to: user.email,
      subject: "Welcome!",
      text: `Chào mừng ${user.username}!`,
    });


    return user;
  }

  async getUsers() {
    return db.User.findAll({
      include: [{ model: db.AuthProvider, attributes: ['provider', 'providerId'] }],
      attributes: { exclude: ['deletedAt'] }
    });
  }

  async getUserById(id) {
    const user = await db.User.findByPk(id, {
      include: [{ model: db.AuthProvider, attributes: ['provider', 'providerId'] }]
    });
    if (!user) throw new Error('Không tìm thấy user');
    return user;
  }

  async updateUser(id, data) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('Không tìm thấy user');

    const { email, username, fullName, role, isActive } = data;
    await user.update({ email, username, fullName, role, isActive });

    return user;
  }


  async deleteUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('Không tìm thấy user');

    await user.destroy(); // soft delete
    return true;
  }

  async updateUserRole(id, role) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('Không tìm thấy user');

    // Validate role
    const validRoles = ['STUDENT', 'COMPANY', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw new Error('Vai trò không hợp lệ');
    }

    await user.update({ role });
    return user;
  }
}

module.exports = new UserService();
