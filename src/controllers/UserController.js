const User = require('../models/User');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'users.db', autoload: true });

exports.register = (req, res) => {
  let { username, email, password, admin } = req.body;
  if (admin !== undefined) {
    admin = "admin"
  }
  console.log("role ", admin)

  // Check if username or email already exists
  User.findByUsername(username, (err, user) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (user) {
      console.log("user exists ", user)

      res.status(400).send('Username already exists');
      return;
    }
    User.findByUsername(email, (err, user) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      if (user) {
        console.log("user exists ", user)
        res.status(400).send('Email already exists');
        return;
      }

      // Create new user
      User.create({ username, email, password, role: admin }, (err, newUser) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          console.log("user created")
          return;
        }
        res.redirect('/login');
      });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!user || user.password !== password) {
      res.status(401).send('Invalid username or password');
      return;
    }
    req.session.user = user;
    res.redirect('/');
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};


// Get all users from the database
exports.getAllUsers = async () => {
  return User.findAll((err, user) => {
    if (err) {
      console.log("err ", err)
    }
    else {
      console.log("inside users..", user)
      return user;
    }
  })

};




exports.deleteUser = async (userId) => {
  try {
    await User.delete(userId);
    await db.persistence.compactDatafile(); // Force compaction
    return "User deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete user.");
  }
};




