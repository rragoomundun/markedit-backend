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

const updatePasswordValidator = validation([
  body('password')
    .notEmpty()
    .withMessage('EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_MIN_LENGTH_8')
    .isStrongPassword()
    .withMessage('PASSWORD_NOT_STRONG'),
  body('passwordConfirmation')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('PASSWORD_CONFIRMATION_NO_MATCH');
      }

      return true;
    })
]);

export { updateIdentityValidator, updatePasswordValidator };
