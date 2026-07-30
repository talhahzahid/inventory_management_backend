import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Purchase = sequelize.define(
  "Purchase",
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
        model: "company",
        key: "id",
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "suppliers",
        key: "id",
      },
    },
    purchased_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("completed", "cancelled"),
      allowNull: false,
      defaultValue: "completed",
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "purchases",
  },
);

export default Purchase;
