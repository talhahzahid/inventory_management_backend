import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const Supplier = sequelize.define (
  'Supplier',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Supplier name is required',
        },
      },
    },
    phone: {
      type: DataTypes.STRING (20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number is required',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM ('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    timestamps: true,
    tableName: 'suppliers',
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'name'],
      },
    ],
  }
);

export default Supplier;
