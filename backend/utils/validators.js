// Reusable validation functions

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

export const isValidPhoneNumber = (phoneNumber) => {
  // Indian phone number format (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''));
};

export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 255;
};

export const isValidRole = (role) => {
  const validRoles = ['student']; // Only allow 'student' role for regular users
  return validRoles.includes(role);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().toLowerCase();
};
