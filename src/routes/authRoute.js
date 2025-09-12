const express = require("express");
const router = express.Router();
const passport = require('../configs/passport.js');
const authcontroller = require('../controllers/authController')
const AuthMiddleware = require('../middlewares/AuthMiddleware');


router.post("/",authcontroller.login)
router.post("/refresh-token", authcontroller.refreshToken);
router.post("/logout", AuthMiddleware.verifyToken, authcontroller.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authcontroller.googleCallback
);


module.exports = router 