import User from '../models/user.js';
import mongoose from 'mongoose';

export const signupUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if this is the first user (will be admin)
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const newUser = new User({
      username,
      password,
      role,
    });
    await newUser.save();
    res.status(201).json({
      message:
        role === 'admin'
          ? 'Admin account created successfully!'
          : 'User saved!',
      role: role,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ ErrorMessage: 'User is not found!' });

    const isMatch = user.password === password;
    if (!isMatch)
      return res.status(404).json({ ErrorMessage: 'wrong username/password' });

    // Return user with role information
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: 'Error Logging In !' });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    // Debug log to see what we're receiving
    console.log('isAdmin middleware - req.query:', req.query);
    console.log('isAdmin middleware - req.body:', req.body);

    // Get userId from body (POST/PATCH) or query params (GET)
    const userId =
      (req.query && req.query.userId) || (req.body && req.body.userId);

    if (!userId) {
      console.log('No userId found in request');
      return res.status(400).json({ ErrorMessage: 'User ID is required' });
    }

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid userId format:', userId);
      return res.status(400).json({ ErrorMessage: 'Invalid User ID format' });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found for userId:', userId);
      return res.status(404).json({ ErrorMessage: 'User not found' });
    }

    if (user.role !== 'admin') {
      console.log('User is not admin:', user.username, 'role:', user.role);
      return res
        .status(403)
        .json({ ErrorMessage: 'Access denied. Admin only.' });
    }

    console.log('Admin access granted for user:', user.username);
    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    res.status(500).json({ ErrorMessage: 'Authorization error' });
  }
};
