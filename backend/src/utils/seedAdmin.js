import User from '../models/User.js';

export const ensureDemoAdmin = async () => {
  const email = 'admin@raesboutique.com';
  await User.deleteMany({ email });

  await User.create({
    name: 'Raes Admin',
    email,
    password: 'Admin@123',
    role: 'admin'
  });

  console.log('Demo admin account recreated from scratch.');
};
