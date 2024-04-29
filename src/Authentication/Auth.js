const User = require('../models/User');

exports.register = async (req, res) => {
  let { username, email, password, admin } = req.body;
  
  if (admin !== undefined) {
    admin = "admin";
  }
  
  try {
    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).send('Username already exists');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send('Email already exists');
    }

    // Create new user
    const newUser = new User({ username, email, password, role: admin });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
