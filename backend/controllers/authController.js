import bcrypt from 'bcrypt';
import sqlConnection from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import e from 'express';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    sqlConnection.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: "Server error" 
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      const user = results[0];

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ 
          success: false,
          message: "Account is disabled" 
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: userWithoutPassword
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, name, phoneNumber, password, role } = req.body;
    // Validation and sanitization are already done by middleware

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR phone_number = ?';
    sqlConnection.query(checkUserQuery, [email, phoneNumber], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: "Server error" 
        });
      }

      if (results.length > 0) {
        const existingUser = results[0];
        if (existingUser.email === email) {
          return res.status(409).json({ 
            success: false,
            message: "Email already registered" 
          });
        }
        if (existingUser.phone_number === phoneNumber) {
          return res.status(409).json({ 
            success: false,
            message: "Phone number already registered" 
          });
        }
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into database
      const insertQuery = 'INSERT INTO users (name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)';
      const userRole = req.user && req.user.role === 'admin' ? role : 'student'; // Only allow admin to assign roles other than student

      sqlConnection.query(
        insertQuery,
        [name, email, phoneNumber, hashedPassword, userRole],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Insert error:', insertErr);
            return res.status(500).json({ 
              success: false,
              message: "Failed to register user" 
            });
          }

          // Generate JWT token for the newly registered user
          const token = generateToken({
            userId: insertResults.insertId,
            email: email,
            role: userRole
          });

          res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
              id: insertResults.insertId,
              name,
              email,
              phoneNumber,
              role: userRole
            }
          });
        }
      );
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    sqlConnection.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: "Server error" 
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User with this email does not exist"
        });
      }
      // Here you would typically generate a password reset token and send an email
      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email (simulated)"
      });
    }   
  )
}catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};