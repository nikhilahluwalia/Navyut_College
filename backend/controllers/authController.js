import bcrypt from 'bcrypt';
import sqlConnection from '../config/db.js';

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

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: "Login successful",
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
      const userRole = role || 'student'; // Default role is student

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

          res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: insertResults.insertId
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
