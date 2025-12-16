import User from '../models/user.js';

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
    // Get userId from body (POST/PATCH) or query params (GET)
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ ErrorMessage: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ ErrorMessage: 'User not found' });

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ ErrorMessage: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ ErrorMessage: 'Authorization error' });
  }
};
