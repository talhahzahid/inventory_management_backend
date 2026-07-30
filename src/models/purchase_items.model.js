import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const PurchaseItem = sequelize.define(
  "PurchaseItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "purchases",
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
    unit_cost: {
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
    tableName: "purchase_items",
  },
);

export default PurchaseItem;
