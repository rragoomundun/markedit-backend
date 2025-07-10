import { Op } from 'sequelize';

import User from '../models/User.js';

const deleteUser = async (userId) => {
  await User.destroy({ where: { id: userId } });
};

const deleteUsers = async (userIds) => {
  await User.destroy({ where: { id: { [Op.in]: userIds } } });
};

export default { deleteUser, deleteUsers };
