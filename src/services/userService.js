const db = require('../models');
const MailService = require("./mailService");
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

    await db.AuthProvider.create({
      userId: user.id,
      provider,
      providerId: provider === 'GOOGLE' ? providerId : null,
      password: hashedPassword
    });
    await MailService.sendWelcomeEmail(user);

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
}

module.exports = new UserService();
