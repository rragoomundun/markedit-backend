import express from 'express';

import { register, registerConfirm, forgotPassword } from '../controllers/auth.controller.js';

import { registerValidator, forgotPasswordValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword);

export default router;
