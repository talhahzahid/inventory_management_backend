import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const Role = sequelize.define (
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM ('admin', 'manager', 'employee'),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'roles',
  }
);

export default Role;
