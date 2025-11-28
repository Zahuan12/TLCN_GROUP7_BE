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

    // Simple regex validation for educational domains
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Allow common educational domains
    const allowedDomains = [
      'gmail.com',
      'yahoo.com', 
      'outlook.com',
      'hotmail.com',
      'student.hcmute.edu.vn',
      'hcmute.edu.vn',
      'edu.vn'
    ];

    const domain = email.split('@')[1].toLowerCase();
    const isEducationalDomain = allowedDomains.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );

    if (!isEducationalDomain) {
      // Still try deep validation for other domains
      try {
        const result = await validator.validate({
          email,
          validateSMTP: false,
          validateDNS: false,
          validateRegex: true
        });

        if (!result.valid) {
          return res.status(400).json({
            success: false,
            message: `Invalid email: ${result.reason || "unknown reason"}`
          });
        }
      } catch (validationError) {
        console.warn("Email validation warning:", validationError);
        // Continue anyway for non-critical validation errors
      }
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
