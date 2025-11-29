const validator = require("deep-email-validator");

// In-memory store for rate limiting (production nên dùng Redis)
const emailAttempts = new Map();
const ipAttempts = new Map();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  
  for (const [key, data] of emailAttempts.entries()) {
    if (now - data.firstAttempt > tenMinutes) {
      emailAttempts.delete(key);
    }
  }
  
  for (const [key, data] of ipAttempts.entries()) {
    if (now - data.firstAttempt > tenMinutes) {
      ipAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Common spam/disposable email domains
const blockedDomains = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.org',
  'yopmail.com',
  'throwaway.email',
  'temp-mail.org',
  'emailtemp.org',
  'dispostable.com',
  'getnada.com'
];

// Suspicious patterns in email
const suspiciousPatterns = [
  /\d{8,}/, // 8+ consecutive digits
  /[a-z]{20,}/, // 20+ consecutive letters
  /(.)\1{4,}/, // Same character 5+ times
  /^[a-z]+\d+@/, // Simple pattern: letters + numbers
  /(test|spam|fake|temp|disposable)/i
];

module.exports = async function checkEmail(req, res, next) {
  try {
    const { email } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const emailLower = email.toLowerCase().trim();
    const now = Date.now();

    // Rate limiting per email
    const emailKey = emailLower;
    const emailData = emailAttempts.get(emailKey);
    
    if (emailData) {
      emailData.count++;
      emailData.lastAttempt = now;
      
      // Block if more than 3 attempts in 10 minutes
      if (emailData.count > 3) {
        return res.status(429).json({
          success: false,
          message: "Too many attempts with this email. Please try again later."
        });
      }
    } else {
      emailAttempts.set(emailKey, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
    }

    // Rate limiting per IP
    const ipData = ipAttempts.get(clientIp);
    
    if (ipData) {
      ipData.count++;
      ipData.lastAttempt = now;
      
      // Block if more than 10 attempts in 10 minutes
      if (ipData.count > 10) {
        return res.status(429).json({
          success: false,
          message: "Too many registration attempts from this IP. Please try again later."
        });
      }
    } else {
      ipAttempts.set(clientIp, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailLower)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const domain = emailLower.split('@')[1];

    // Check blocked domains
    if (blockedDomains.some(blocked => domain.includes(blocked))) {
      return res.status(400).json({
        success: false,
        message: "Disposable email addresses are not allowed"
      });
    }

    // Check suspicious patterns
    if (suspiciousPatterns.some(pattern => pattern.test(emailLower))) {
      return res.status(400).json({
        success: false,
        message: "Email appears to be invalid or suspicious"
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

    const isEducationalDomain = allowedDomains.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );

    if (!isEducationalDomain) {
      // More strict validation for non-educational domains
      try {
        const result = await validator.validate({
          email: emailLower,
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
      } catch (validationError) {
        console.warn("Email validation warning:", validationError);
        // For non-educational domains, be more strict
        return res.status(400).json({
          success: false,
          message: "Email validation failed"
        });
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
