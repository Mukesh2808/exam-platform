const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Please provide name, email, and password'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Please provide a valid email address'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Please provide email and password'
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
