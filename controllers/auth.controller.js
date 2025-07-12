import httpStatus from 'http-status-codes';

import User from '../models/User.js';
import Token from '../models/Token.js';

import ErrorResponse from '../classes/ErrorResponse.js';

import dbUtil from '../utils/db.util.js';
import userUtil from '../utils/user.util.js';
import mailUtil from '../utils/mail.util.js';
import cryptUtil from '../utils/crypt.util.js';

/**
 * @api {POST} /auth/register Register
 * @apiGroup Auth
 * @apiName AuthRegister
 *
 * @apiDescription Register a new user.
 *
 * @apiBody {String} name User's name
 * @apiBody {String} email User's email
 * @apiBody {String{8..}} password User's password
 * @apiBody {String{8..}} passwordConfirmation The password confirmation
 *
 * @apiParamExample {json} Body Example
 * {
 *   "name": "Raphael",
 *   "email": "raphael@ex.com",
 *   "password": "pfs83a01jH;B",
 *   "passwordConfirmation": "pfs83a01jH;B"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (500)) ACCOUNT_CREATION Cannot create account
 *
 * @apiPermission Public
 */
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  let result;

  try {
    result = await dbUtil.transaction(async (transaction) => {
      const user = await User.create({ name, email, password }, { transaction });
      const token = await Token.create(
        { type: 'register-confirm', value: 'empty', expire: Date.now(), user_id: user.id },
        { transaction }
      );
      const tokenValue = await token.generateToken(transaction);

      return { user, token: tokenValue };
    });
  } catch {
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  // Send confirmation e-mail
  try {
    const mailOptions = {
      mail: 'welcome',
      userId: result.user.id,
      templateOptions: {
        confirmationLink: `${process.env.APP_URL}/auth/register/confirm/${result.token}`
      }
    };
    await mailUtil.send(mailOptions);
  } catch {
    await userUtil.deleteUser(result.user.id);
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  res.status(httpStatus.CREATED).end();
};

/**
 * @api {POST} /auth/register/confirm/:confirmationToken Confirm User Registration
 * @apiGroup Auth
 * @apiName AuthRegisterConfirm
 * 
 * @apiDescription Confirm a user by validating its confirmation token.
 * 
 * @apiParam {String} confirmationToken User's confirmation token

 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }
 * 
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Public
 */
const registerConfirm = async (req, res, next) => {
  const { confirmationToken } = req.params;
  const token = await Token.findOne({ where: { value: cryptUtil.getDigestHash(confirmationToken) } });

  if (!token) {
    return next(new ErrorResponse('Invalid token', httpStatus.BAD_REQUEST, 'INVALID_TOKEN'));
  }

  const userId = token.user_id;

  await token.destroy();

  sendTokenResponse(userId, httpStatus.OK, res);
};

/**
 * @api {POST} /auth/login Login
 * @apiGroup Auth
 * @apiName AuthLogin
 * 
 * @apiDescription Login a user.
 * 
 * @apiBody {String} email User's email
 * @apiBody {String} password User's password
 * 
 * @apiParamExample {json} Body Example
 * {
 *   "email": "raphael@ex.com",
 *   "password": "pfs83a01jH;B"
 * }
 * 
 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }

 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) INVALID The data entered is invalid
 * @apiError (Error (401)) UNCONFIRMED The account is unconfirmed
 *
 * @apiPermission Public
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new ErrorResponse('Data entered invalid', httpStatus.UNAUTHORIZED, 'INVALID'));
  }

  const token = await Token.findOne({ where: { user_id: user.id, type: 'register-confirm' } });

  if (token) {
    return next(new ErrorResponse('Account unconfirmed', httpStatus.UNAUTHORIZED, 'UNCONFIRMED'));
  }

  sendTokenResponse(user.id, httpStatus.OK, res);
};

/**
 * @api {POST} /auth/password/forgot Forgot Password
 * @apiGroup Auth
 * @apiName AuthForgotPassword
 *
 * @apiDescription Generate reset password token and send reset email
 *
 * @apiBody {String} email User's email
 *
 * @apiParamExample {json} Body Example
 * {
 *   "email": "raphael@ex.com"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNCONFIRMED The account is unconfirmed
 * @apiError (Error (409)) ALREADY_RECOVERING A recovery procedure is already in progress
 * @apiError (Error (500)) EMAIL_SENDING_FAILED Cannot send recovery email
 *
 * @apiPermission Public
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  const token = await Token.findOne({ where: { user_id: user.id } });

  if (token) {
    if (token.type === 'register-confirm') {
      return next(new ErrorResponse('Acount unconfirmed', httpStatus.UNAUTHORIZED, 'UNCONFIRMED'));
    } else if (token.type === 'password-reset') {
      return next(
        new ErrorResponse(
          'A password recovery procedure is already in progress',
          httpStatus.CONFLICT,
          'ALREADY_RECOVERING'
        )
      );
    }
  }

  const passwordResetToken = await Token.create({
    type: 'password-reset',
    value: 'empty',
    expire: Date.now(),
    user_id: user.id
  });
  const resetPasswordTokenValue = await passwordResetToken.generateToken();

  try {
    const mailOptions = {
      mail: 'passwordForgotten',
      userId: user.id,
      templateOptions: {
        resetLink: `${process.env.APP_URL}/auth/password/reset/${resetPasswordTokenValue}`
      }
    };

    await mailUtil.send(mailOptions);

    res.status(httpStatus.OK).end();
  } catch {
    await passwordResetToken.destroy();
    return next(new ErrorResponse('Cannot send email', httpStatus.INTERNAL_SERVER_ERROR, 'EMAIL_SENDING_FAILED'));
  }
};

/**
 * @api {POST} /auth/password/reset/:resetPasswordToken Reset Password
 * @apiGroup Auth
 * @apiName AuthResetPassword
 *
 * @apiDescription Reset user password
 *
 * @apiParam {String} resetPasswordToken User's confirmation token
 * @apiBody {String{12..}} password User's new password
 * @apiBody {String{12...}} passwordConfirmation The password confirmation
 *
 * @apiParamExample {json} Body Example
 * {
 *   "password": "J9u21k%cde1t",
 *   "passwordConfirmation": "J9u21k%cde1t"
 * }
 *
 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Public
 */
const resetPassword = async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  const token = await Token.findOne({ where: { value: cryptUtil.getDigestHash(resetPasswordToken) } });

  if (!token) {
    return next(new ErrorResponse('Invalid token', httpStatus.BAD_REQUEST, 'INVALID_TOKEN'));
  }

  const user = await User.findOne({ where: { id: token.user_id } });

  user.password = password;

  await user.save();
  await token.destroy();

  sendTokenResponse(user.id, httpStatus.OK, res);
};

// Create token from model, create cookie, and send response
const sendTokenResponse = async (userId, statusCode, res) => {
  const user = await User.findOne({ where: { id: userId } });
  const token = user.getSignedJWTToken(userId);

  const options = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE),
    sameSite: 'None',
    secure: true
  };

  res.status(statusCode).cookie('token', token, options).json({ token });
};

export { register, registerConfirm, login, forgotPassword, resetPassword };
