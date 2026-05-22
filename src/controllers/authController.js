import jwt from 'jsonwebtoken';
import Judge from '../models/Judge.js';
import Admin from '../models/Admin.js';

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: 'All fields required' });

    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      user = await Judge.findOne({ email, isActive: true });
    }

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id, role),
      user: { id: user._id, name: user.name, email: user.email, role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user, role: req.userRole });
};
