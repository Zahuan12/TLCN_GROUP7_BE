const express = require("express");
const router = express.Router();
const passport = require('../configs/passport.js');
const authcontroller = require('../controllers/authController')
const AuthMiddleware = require('../middlewares/AuthMiddleware');


router.post("/",authcontroller.login)
router.post("/refresh-token", authcontroller.refreshToken);
router.post("/logout", AuthMiddleware.verifyToken, authcontroller.logout);
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],  // Thêm scope cho Google Drive nếu cần
  accessType: "offline",  // Cần có accessType "offline" để nhận refresh token
  prompt: "consent"  // Đảm bảo luôn hỏi người dùng cấp quyền (để nhận refresh token)
}));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authcontroller.googleCallback
);
router.post('/verify-username', authcontroller.verifyUsername);
router.post('/verify-otp', authcontroller.verifyOTP);
router.post('/reset-password', authcontroller.changePassword);


module.exports = router 