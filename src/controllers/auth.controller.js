import {loginService} from '../service/auth.service.js';

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({message: 'Login successful', data: result});
  } catch (error) {
    res.status(error.statusCode || 500).json({message: error.message});
  }
};
