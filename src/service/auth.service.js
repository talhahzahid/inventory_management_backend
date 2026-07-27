import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';
import Role from '../models/roles.model.js';
import {jwtConfig} from '../config/jwt.js';
import {comparePassword} from '../utils/hashPassword.js';

export const loginService = async ({email, password}) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    where: {email},
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== 'active') {
    const error = new Error('Account is inactive');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
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
    {expiresIn: jwtConfig.expiresIn}
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company_id: user.company_id,
      role_id: user.role_id,
      role: user.role?.name,
    },
  };
};
