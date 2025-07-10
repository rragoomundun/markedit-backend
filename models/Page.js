import { DataTypes } from 'sequelize';

import dbUtil from '../utils/db.util.js';

const Page = dbUtil.define(
  'Page',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
    },
    position: {
      type: DataTypes.INTEGER,
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
    tableName: 'pages'
  }
);

export default Page;
