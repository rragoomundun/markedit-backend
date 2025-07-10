import User from './models/User.js';
import Token from './models/Token.js';
import Folder from './models/Folder.js';
import Page from './models/Page.js';

const setupDatabase = () => {
  User.hasMany(Token, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  Token.belongsTo(User, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });

  User.hasMany(Folder, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  Folder.belongsTo(User, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });

  Folder.hasOne(Folder, {
    foreignKey: {
      name: 'parent_id'
    }
  });
  Folder.belongsTo(Folder, {
    foreignKey: {
      name: 'parent_id'
    }
  });

  User.hasOne(Page, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });
  Page.belongsTo(User, {
    foreignKey: {
      name: 'user_id',
      allowNull: false
    }
  });

  Page.hasOne(Folder, {
    foreignKey: {
      name: 'folder_id'
    }
  });
  Folder.belongsTo(Page, {
    foreignKey: 'folder_id'
  });
};

export default setupDatabase;
