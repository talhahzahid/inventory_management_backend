import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import Role from "../models/roles.model.js";
import { jwtConfig } from "../config/jwt.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import Company from "../models/company.model.js";

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
      },
      {
        model: Company,
        as: "company",
        attributes: ["name", "logo"],
      },
    ],
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("Account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
      role_id: user.role_id,
      role: user.role?.name,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company_id: user.company_id,
      company_name: user.company?.name,
      logo: user?.company?.logo,
      role_id: user.role_id,
      role: user.role?.name,
    },
  };
};

export const changePasswordService = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    const error = new Error(
      "New password cannot be the same as the current password",
    );
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password changed successfully",
  };
};
