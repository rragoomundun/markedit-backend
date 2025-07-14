import express from 'express';

import { getUser, updateUserIdentity } from '../controllers/user.controller.js';

import { updateIdentityValidator } from '../validators/user.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getUser)
  .put('/identity', authenticateMiddleware, updateIdentityValidator, updateUserIdentity);

export default router;
