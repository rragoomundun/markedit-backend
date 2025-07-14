import httpStatus from 'http-status-codes';

import User from '../models/User.js';

import dbUtil from '../utils/db.util.js';

/**
 * @api {GET} /user Get User
 * @apiGroup User
 * @apiName UserGet
 *
 * @apiDescription Get connected user.
 *
 * @apiSuccess {Number} id User's id
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "name": "Raphael",
 *   "email": "raphael@ex.com"
 * }
 *
 * @apiPermission Private
 */
const getUser = async (req, res, next) => {
  res.status(httpStatus.OK).json(req.user);
};

/**
 * @api {PUT} /user/identity Update Identity
 * @apiGroup User
 * @apiName UserUpdateIdentity
 *
 * @apiDescription Update user's identity.
 *
 * @apiBody {String} name Updated name
 * @apiBody {String} email Updated email
 *
 * @apiParamExample {json} Body Example
 * {
 *   "name": "Raphael",
 *   "email": "raphael@ex.com"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateUserIdentity = async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.name = name;
  user.email = email;

  await user.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /user/password Update Password
 * @apiGroup User
 * @apiName UserUpdatePassword
 *
 * @apiDescription Update user's password.
 *
 * @apiBody {String} password Updated password
 * @apiBody {String} passwordConfirmation Updated password confirmation
 *
 * @apiParamExample {json} Body Example
 * {
 *   "password": "pfs83a01jH;B",
 *   "passwordConfirmation": "pfs83a01jH;B"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateUserPassword = async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.password = password;

  await user.save();

  res.status(httpStatus.OK).end();
};

export { getUser, updateUserIdentity, updateUserPassword };
