import express from 'express';

import { getUser, updateUserIdentity, updateUserPassword, deleteUserAccount } from '../controllers/user.controller.js';

import { updateIdentityValidator, updatePasswordValidator } from '../validators/user.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getUser)
  .put('/identity', authenticateMiddleware, updateIdentityValidator, updateUserIdentity)
  .put('/password', authenticateMiddleware, updatePasswordValidator, updateUserPassword)
  .delete('/', authenticateMiddleware, deleteUserAccount);

export default router;
