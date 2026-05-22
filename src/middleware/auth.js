import jwt from 'jsonwebtoken';
import Judge from '../models/Judge.js';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id).select('-password');
    } else {
      req.user = await Judge.findById(decoded.id).select('-password');
    }
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};
