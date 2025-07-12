import express from 'express';

import { register, registerConfirm, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

import { registerValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword)
  .post('/password/reset/:resetPasswordToken', resetPasswordValidator, resetPassword);

export default router;
