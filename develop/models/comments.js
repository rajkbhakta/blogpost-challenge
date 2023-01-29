const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Comments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'posts',
        key:'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key:'id'
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull:false,
  
    },
    date:{
      type: DataTypes.date,
    }
  },
  {
   
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = Comments;
