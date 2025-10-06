const authService = require('../services/authService');
const AuthService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      return ApiResponse.success(res, 'Đăng nhập thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("Không có refresh token");

      const result = await AuthService.refreshToken(refreshToken);
      return ApiResponse.success(res, "Refresh token thành công", result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user.id; // req.user có được từ middleware verify access token
      await AuthService.logout(userId);
      return ApiResponse.success(res, "Đăng xuất thành công");
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

   async googleCallback(req, res) {
  try {
    const googleData = req.user;
    const result = await AuthService.loginWithGoogle(googleData);

    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not set in environment variables");
    }

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success` +
      `?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
    
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google login callback error:", error.message);
    return res.redirect(`${process.env.FRONTEND_URL || ''}/login?error=oauth_failed`);
  }
}

async verifyUsername(req, res) {
  try {
    const { username } = req.body;
    const result = await authService.verifyUsername(username);
    return ApiResponse.success(res, 'Đã gửi mã xác thực', result);
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
}
async verifyOTP(req, res) {
    try {
      const { username, otp } = req.body;

      // Gọi xuống service kiểm tra OTP
      const result = await authService.verifyOTP(username, otp );

      return ApiResponse.success(res, 'Xác thực mã OTP thành công.', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  
}

module.exports = new AuthController();
