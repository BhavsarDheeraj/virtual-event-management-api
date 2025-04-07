const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // TODO: Validate input

  // TODO: Check if user already exists
  const userAlreadyExists = await User.exists({ email });

  if (userAlreadyExists) {
    return res.status(400).json({
      message: `User with email ${email} already exists`,
    });
  }

  // TODO: Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  if (!hashedPassword) {
    return res.status(500).json({
      message: 'Something went wrong!',
    });
  }


  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  try {
    await newUser.save();
    return res.status(201).json({
      message: 'User registered successfully! Please login to continue.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }

};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // TODO: Validate input

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  console.log('JWT_SECRET', JWT_SECRET);

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

module.exports = {
  registerUser,
  loginUser,
};