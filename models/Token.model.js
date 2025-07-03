import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Token = dbUtil.define(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('register-confirm', 'password-reset'),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'tokens'
  }
);

export default Token;
