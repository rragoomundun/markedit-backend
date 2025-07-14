import express from 'express';

import { getUser } from '../controllers/user.controller.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router.get('/', authenticateMiddleware, getUser);

export default router;
