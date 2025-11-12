import express from 'express'; 
import { forgotPassword, login, register, resetPassword, verifyResetToken } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../middlewares/validation.js';


const router = express.Router();


router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);



export default router;
