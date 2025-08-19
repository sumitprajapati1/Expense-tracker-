import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  // Get token from header
  const token = req.cookies.token || req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    
    // Verify user still exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};