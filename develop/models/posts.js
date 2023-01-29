const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');


Posts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true,
    },
    content:{
      type:dataTypes.STRING,
      allowNull:false
    },
    date: {
      type: dataTypes.date,
      allowNull:false,
    },
    user_id:{
      type: DataType.INTEGER,
      references: {
        model:"user",
        key:'id'
      }
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

module.exports = Posts;
