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

export { getUser };
