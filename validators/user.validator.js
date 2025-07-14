import { body } from 'express-validator';

import User from '../models/User.js';

import validation from './validation.js';

const updateIdentityValidator = validation([
  body('name').notEmpty().withMessage('EMPTY'),
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('NOT_EMAIL')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });

      if (user && user.id !== req.user.id) {
        throw new Error('EMAIL_IN_USE');
      }

      return true;
    })
]);

export { updateIdentityValidator };
