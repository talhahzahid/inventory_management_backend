import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

const Product = sequelize.define (
  'Product',
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'id',
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'SKU is required',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name is required',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchase_price: {
      type: DataTypes.DECIMAL (10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Purchase price cannot be negative',
        },
      },
    },
    selling_price: {
      type: DataTypes.DECIMAL (10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Selling price cannot be negative',
        },
      },
    },
    status: {
      type: DataTypes.ENUM ('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    timestamps: true,
    tableName: 'products',
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'sku'],
      },
    ],
  }
);

export default Product;
