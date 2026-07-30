import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Sale = sequelize.define(
  "Sale",
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
    sold_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "sales",
  },
);

export default Sale;
