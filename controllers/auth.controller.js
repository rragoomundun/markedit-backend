import httpStatus from 'http-status-codes';

import User from '../models/User.js';
import Token from '../models/Token.js';

import ErrorResponse from '../classes/ErrorResponse.js';

import dbUtil from '../utils/db.util.js';
import userUtil from '../utils/user.util.js';
import mailUtil from '../utils/mail.util.js';

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

export { register };
