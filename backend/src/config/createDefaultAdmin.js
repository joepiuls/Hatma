import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const createDefaultAdmin = async () => {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const existing = await User.findOne({ email });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 12);

    const admin = new User({
      name: process.env.DEFAULT_ADMIN_NAME,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log(`✅ Default admin created: ${email}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${email}`);
  }
};

export default createDefaultAdmin;
