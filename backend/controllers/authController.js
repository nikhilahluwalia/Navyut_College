import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sqlConnection from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from '../utils/email.js';

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


//Forgot Password - Send reset email with token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

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

      // Always return success message for security (don't reveal if email exists)
      if (results.length === 0) {
        return res.status(200).json({
          success: true,
          message: "If an account exists with this email, you will receive a password reset link"
        });
      }

      const user = results[0];

      // Generate unique reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Delete any existing reset tokens for this user
      const deleteQuery = 'DELETE FROM password_reset_tokens WHERE user_id = ?';
      sqlConnection.query(deleteQuery, [user.id], (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting old tokens:', deleteErr);
        }

        // Insert new reset token
        const insertQuery = 'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
        sqlConnection.query(insertQuery, [user.id, hashedToken, expiresAt], async (insertErr) => {
          if (insertErr) {
            console.error('Error creating reset token:', insertErr);
            return res.status(500).json({ 
              success: false,
              message: "Failed to generate reset token" 
            });
          }

          // Send password reset email
          try {
            await sendPasswordResetEmail(user.email, resetToken, user.name);
            
            res.status(200).json({
              success: true,
              message: "Password reset link has been sent to your email"
            });
          } catch (emailError) {
            console.error('Email sending error:', emailError);
            return res.status(500).json({
              success: false,
              message: "Failed to send reset email. Please try again later."
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Reset Password - Verify token and update password
 
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const query = `
      SELECT rt.*, u.id as user_id, u.email, u.name 
      FROM password_reset_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token = ? 
      AND rt.expires_at > NOW() 
      AND rt.used = FALSE
    `;

    sqlConnection.query(query, [hashedToken], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: "Server error" 
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token"
        });
      }

      const resetRecord = results[0];

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
      sqlConnection.query(updatePasswordQuery, [hashedPassword, resetRecord.user_id], (updateErr) => {
        if (updateErr) {
          console.error('Password update error:', updateErr);
          return res.status(500).json({ 
            success: false,
            message: "Failed to update password" 
          });
        }

        // Mark token as used
        const markUsedQuery = 'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?';
        sqlConnection.query(markUsedQuery, [resetRecord.id], async (markErr) => {
          if (markErr) {
            console.error('Token marking error:', markErr);
          }

          // Send confirmation email (don't fail if this errors)
          try {
            await sendPasswordResetConfirmation(resetRecord.email, resetRecord.name);
          } catch (emailError) {
            console.error('Confirmation email error:', emailError);
          }

          res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
          });
        });
      });
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Verify Reset Token - Check if token is valid
 
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Check if token exists and is valid
    const query = `
      SELECT * FROM password_reset_tokens 
      WHERE token = ? 
      AND expires_at > NOW() 
      AND used = FALSE
    `;

    sqlConnection.query(query, [hashedToken], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: "Server error" 
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token"
        });
      }

      res.status(200).json({
        success: true,
        message: "Token is valid"
      });
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};