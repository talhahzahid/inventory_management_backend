import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const SaleItem = sequelize.define(
  "SaleItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sales",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Quantity must be at least 1",
        },
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "sale_items",
  },
);

export default SaleItem;
