const db = require('../models');
const bcrypt = require('bcryptjs');
const JwtUtils = require('../utils/jwt');

class AuthService {
  async login(username, password) {
    // 1️⃣ Tìm user theo username và provider LOCAL
    const user = await db.User.findOne({
      where: { username },
      include: [{ model: db.AuthProvider, where: { provider: 'LOCAL' } }]
    });

    if (!user) throw new Error('Người dùng không tồn tại');

    const localProvider = user.AuthProviders[0];
    if (!localProvider.password) throw new Error('Tài khoản không có mật khẩu');

    // 2️⃣ Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, localProvider.password);
    if (!isMatch) throw new Error('Sai mật khẩu');

    // 3️⃣ Tạo access token & refresh token
    const accessToken = JwtUtils.signAccess({ id: user.id, role: user.role });
    const refreshToken = JwtUtils.signRefresh({ id: user.id });

    // 4️⃣ Lưu refresh token vào DB (bảng RefreshToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await db.RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt
    });

    // 5️⃣ Trả về user an toàn (ẩn password)
    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };

    return { accessToken, refreshToken, user: safeUser };
  }

  async refreshToken(oldToken) {
    const decoded = JwtUtils.verifyRefresh(oldToken);

    // Kiểm tra token có trong DB không
    const storedToken = await db.RefreshToken.findOne({
      where: { userId: decoded.id, token: oldToken }
    });

    if (!storedToken) throw new Error('Refresh token không hợp lệ');

    // Tạo access token mới
    const newAccessToken = JwtUtils.signAccess({ id: decoded.id, role: decoded.role });

    return { accessToken: newAccessToken };
  }

  async logout(userId) {
    // Xoá tất cả refresh token của user → buộc đăng nhập lại
    await db.RefreshToken.destroy({ where: { userId } });
  }
   async loginWithGoogle(googleData) {
  let user = await db.User.findOne({ where: { email: googleData.email } });

  if (!user) {
    user = await db.User.create({
      email: googleData.email,
      fullName: googleData.fullName,
      role: 'STUDENT', // default hoặc để FE chọn role sau
    });
  }

  // Kiểm tra hoặc tạo AuthProvider
  let provider = await db.AuthProvider.findOne({
    where: { provider: 'GOOGLE', providerId: googleData.providerId }
  });

  if (!provider) {
    await db.AuthProvider.create({
      provider: 'GOOGLE',
      providerId: googleData.providerId,
      userId: user.id
    });
  }

  // 🔑 Kiểm tra refreshToken hiện tại trong DB (nếu có)
  let existingRefresh = await db.RefreshToken.findOne({
    where: { userId: user.id },
    order: [['createdAt', 'DESC']]
  });

  let refreshToken;
  if (existingRefresh) {
    try {
      // Nếu token cũ vẫn còn hạn → tái sử dụng
      JwtUtils.verifyRefresh(existingRefresh.token);
      refreshToken = existingRefresh.token;
    } catch (err) {
      // Token cũ hết hạn → tạo mới + update DB
      refreshToken = JwtUtils.signRefresh({ id: user.id });
      await existingRefresh.update({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }
  } else {
    // Chưa có refresh token nào → tạo mới
    refreshToken = JwtUtils.signRefresh({ id: user.id });
    await db.RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  // Luôn tạo access token mới (ngắn hạn)
  const accessToken = JwtUtils.signAccess({ id: user.id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  };
}
}

module.exports = new AuthService();
