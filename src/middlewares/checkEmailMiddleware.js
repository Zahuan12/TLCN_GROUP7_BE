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

    // Kiểm tra format email cơ bản trước
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Thử validation với DNS, nếu fail thì chỉ dùng regex
    try {
      const result = await validator.validate({
        email,
        validateSMTP: false,
        validateDNS: true,
        validateRegex: true
      });

      if (!result.valid && result.reason !== 'mx') {
        return res.status(400).json({
          success: false,
          message: `Invalid email: ${result.reason || "unknown reason"}`
        });
      }
    } catch (dnsError) {
      // Nếu DNS validation fail, chỉ cần email format đúng là được
      console.log('DNS validation failed, using basic regex only:', dnsError.message);
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
