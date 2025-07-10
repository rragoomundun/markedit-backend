import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';
import cryptUtil from '../utils/crypt.util.js';

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

Token.prototype.generateToken = async function (transaction) {
  const token = cryptUtil.getToken();

  this.value = cryptUtil.getDigestHash(token);
  this.expire = new Date(Date.now() + 1000 * 60 * 60); // Expires in 1 hour

  if (transaction) {
    await this.save({ transaction });
  } else {
    await this.save();
  }

  return token;
};

export default Token;
