import express from 'express';

import { getUser, updateUserIdentity, updateUserPassword } from '../controllers/user.controller.js';

import { updateIdentityValidator, updatePasswordValidator } from '../validators/user.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getUser)
  .put('/identity', authenticateMiddleware, updateIdentityValidator, updateUserIdentity)
  .put('/password', authenticateMiddleware, updatePasswordValidator, updateUserPassword);

export default router;
