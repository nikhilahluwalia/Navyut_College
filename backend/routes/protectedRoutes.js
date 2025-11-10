import express from 'express';
import { authenticateToken, requireAdmin, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Example: Get current user profile (requires authentication)
 * Access: Any authenticated user
 */
router.get('/profile', authenticateToken, (req, res) => {
  // req.user contains the decoded JWT payload (userId, email, role)
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    user: req.user
  });
});

/**
 * Example: Admin-only route
 * Access: Admin only
 */
router.get('/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard data',
    data: {
      // Your admin dashboard data here
    }
  });
});

/**
 * Example: Route accessible by specific roles
 * Access: Manager and Career Counselor
 */
router.get('/staff/data', authenticateToken, requireRole(['manager', 'career_counciler']), (req, res) => {
  res.json({
    success: true,
    message: 'Staff data retrieved',
    data: {
      // Your staff data here
    }
  });
});

/**
 * Example: Public route (no authentication required)
 */
router.get('/public/info', (req, res) => {
  res.json({
    success: true,
    message: 'Public information',
    data: {
      // Public data
    }
  });
});

export default router;
