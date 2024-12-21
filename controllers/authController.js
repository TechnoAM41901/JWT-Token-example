const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { jwtSecret, jwtExpire } = require('../config/config');

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (userModel.findByEmail(email)) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = await userModel.create({ name, email, password });

    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });

    res.status(201).json({ token });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await userModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });

    res.json({ token });
  },
  getProtected: (req, res) => {
    res.json({ msg: 'This is a protected route' });
  }
};
