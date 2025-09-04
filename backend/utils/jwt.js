import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || 'jwtsecret';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};


