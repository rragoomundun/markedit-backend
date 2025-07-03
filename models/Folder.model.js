import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Folder = dbUtil.define(
  'Folder',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE
    }
  },
  {
    timestamps: false,
    tableName: 'folders'
  }
);

export default Folder;
