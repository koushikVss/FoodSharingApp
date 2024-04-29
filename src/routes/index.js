const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const ItemController = require('../controllers/ItemController');
const Auth = require("../Authentication/Auth")
const User = require("../models/User")
const Item = require("../models/Item")

// Home page
router.get('/', (req, res) => {


  // console.log("res session ",req.session.user,"   - ", req.session.user && req.session.user.role === 'admin' ? true : false )
  res.render('index', { loggedIn: req.session.user ? true : false, isAdmin: req.session.user && req.session.user.role === 'admin' ? true : false });
});

// About Us page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact Us page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// User routes
router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.get('/logout', Auth.logout);


// Add Item page
router.get('/items/add', (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  res.render('add-item');
});

// Browse Items page
router.get('/items', ItemController.browse);
router.post('/items/:id/select', ItemController.selectItem);
router.post('/items/add', ItemController.addItem);

// Admin Dashboard page
router.get('/admin/dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    res.redirect('/login');
    return;
  }

  try {
    const users = await User.find({});
    const items = await Item.find({ status: 'available', expirationDate: { $gt: new Date() } });
    res.render('admin-dashboard', { users, items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Users page
router.get('/admin/users', async (req, res) => {
  // Check if user is logged in and is admin
  if (!req.session.user || req.session.user.role !== 'admin') {
    res.redirect('/login');
    return;
  }
  User.findAll((err, user) => {
    if (err) {
      console.log("err ", err)
    }
    else {
      res.render('manage-users', { users: user });
      return
    }
  })
});

// Manage Items page
router.get('/admin/items', async (req, res) => {
  // Check if user is logged in and is admin
  if (!req.session.user || req.session.user.role !== 'admin') {
    res.redirect('/login');
    return;
  }

  Item.findAllAvailable((err, item) => {
    if (err) {
      console.log("err ", err)
    }
    else {
      res.render('manage-items', { items: item });
      return
    }
  })

});


// Route for deleting a user
router.post('/admin/users/:userId/delete', async (req, res) => {
  try {
    const userId = req.params.userId;
    const message = await UserController.deleteUser(userId);
    //   req.flash('success', message); // Assuming a flash message system
    res.redirect('/');
  } catch (error) {
    console.error(error);
    //   req.flash('error', 'Failed to delete user.'); // Assuming a flash message system
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting an item
router.post('/admin/items/:itemId/delete', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await ItemController.deleteItem(itemId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/about', (req, res) => {
  res.render('about');
});

// Contact Us page
router.get('/contact', (req, res) => {
  res.render('contact');
});


// Route for deleting an item
router.post('/items/:itemId/delete', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await ItemController.deleteItem(itemId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// User Dashboard page
router.get('/dashboard', async (req, res) => {
  try {
    // Check if user is logged in
    console.log("session user ", req.session.user)
    const items = await ItemController.getAllItems(req.session.user._id);
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }
    console.log("items ",items)
    res.render('dashboard', { username: req.session.user.username, items });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;