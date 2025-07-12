import { body } from 'express-validator';

import User from '../models/User.js';

import validation from './validation.js';

const registerValidator = validation([
  body('name').notEmpty().withMessage('EMPTY'),
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('NOT_EMAIL')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });

      if (user) {
        throw new Error('EMAIL_IN_USE');
      }

      return true;
    }),
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

const forgotPasswordValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .custom(async (email) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('NO_ACCOUNT_FOR_EMAIL');
      }
    })
]);

const resetPasswordValidator = validation([
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

export { registerValidator, forgotPasswordValidator, resetPasswordValidator };
