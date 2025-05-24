const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.getUserByEmail(email);

    if (!user) {
      return res.status(401).send('User not found');
    }

    const passwordIsValid = password === user.password;

    if (!passwordIsValid) {
      return res.status(401).send('Incorrect email or password');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    return res.json({ message: 'Successful login', token: token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Internal server error');
  }
};

module.exports = {
  login
}; 