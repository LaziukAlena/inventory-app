import bcrypt from 'bcrypt';

export const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

