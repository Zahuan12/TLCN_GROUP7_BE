/**
 * Validation utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUsername = (username) => {
  // Username: 3-20 characters, alphanumeric and underscore
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validatePassword = (password) => {
  // Password: At least 6 characters
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  // Vietnamese phone number
  const re = /^(0|\+84)[0-9]{9}$/;
  return re.test(phone);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Form validation helper
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const rule = rules[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.requiredMessage || `${field} là bắt buộc`;
      return;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Email không hợp lệ';
    }

    if (rule.username && value && !validateUsername(value)) {
      errors[field] = 'Username phải từ 3-20 ký tự, chỉ chứa chữ, số và gạch dưới';
    }

    if (rule.password && value && !validatePassword(value)) {
      errors[field] = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (rule.phone && value && !validatePhone(value)) {
      errors[field] = 'Số điện thoại không hợp lệ';
    }

    if (rule.url && value && !validateURL(value)) {
      errors[field] = 'URL không hợp lệ';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `Phải có ít nhất ${rule.minLength} ký tự`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `Không được quá ${rule.maxLength} ký tự`;
    }

    if (rule.custom && value) {
      const customError = rule.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

