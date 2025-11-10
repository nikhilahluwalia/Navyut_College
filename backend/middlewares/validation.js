import { isValidEmail, isValidPassword, isValidPhoneNumber, isValidName, isValidRole, sanitizeInput } from '../utils/validators.js';

// Validation middleware for user registration
export const validateRegister = (req, res, next) => {
  const { email, name, phoneNumber, password, role } = req.body;

  // Check required fields
  if (!email || !name || !phoneNumber || !password) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required",
      missingFields: {
        email: !email,
        name: !name,
        phoneNumber: !phoneNumber,
        password: !password
      }
    });
  }

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedName = sanitizeInput(name);
  const sanitizedPhoneNumber = sanitizeInput(phoneNumber);

  // Validate email
  if (!isValidEmail(sanitizedEmail)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid email format" 
    });
  }

  // Validate name
  if (!isValidName(sanitizedName)) {
    return res.status(400).json({ 
      success: false,
      message: "Name must be between 2 and 255 characters" 
    });
  }

  // Validate phone number
  if (!isValidPhoneNumber(sanitizedPhoneNumber)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid phone number format. Must be a valid 10-digit Indian number" 
    });
  }

  // Validate password
  if (!isValidPassword(password, 6)) {
    return res.status(400).json({ 
      success: false,
      message: "Password must be at least 6 characters long" 
    });
  }

  // Validate role (if provided)
  if (role && !isValidRole(role)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid role. Must be one of: admin, manager, career_counciler, student" 
    });
  }

  // Update req.body with sanitized values
  req.body.email = sanitizedEmail;
  req.body.name = sanitizedName;
  req.body.phoneNumber = sanitizedPhoneNumber;

  next();
};

// Validation middleware for user login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Email and password are required" 
    });
  }

  // Sanitize email
  const sanitizedEmail = sanitizeInput(email);

  // Validate email format
  if (!isValidEmail(sanitizedEmail)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid email format" 
    });
  }

  // Update req.body with sanitized email
  req.body.email = sanitizedEmail;

  next();
};
