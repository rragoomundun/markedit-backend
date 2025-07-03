import User from './models/User.model.js';
import Token from './models/Token.model.js';
import Folder from './models/Folder.model.js';
import Page from './models/Page.model.js';

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

  Page.hasOne(User, {
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
