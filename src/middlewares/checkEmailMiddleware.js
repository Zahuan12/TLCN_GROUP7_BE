const validator = require("deep-email-validator");

module.exports = async function checkEmail(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await validator.validate({
      email,
      validateSMTP: false,
      validateDNS: true,
      validateRegex: true
    });

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: `Invalid email: ${result.reason || "unknown reason"}`
      });
    }

    next();
  } catch (err) {
    console.error("Email validation error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
