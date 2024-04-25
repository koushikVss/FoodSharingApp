const Item = require('../models/Item');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'users.db', autoload: true });

exports.browse = (req, res) => {
  Item.findAllAvailable((err, items) => {
    console.log("items ",items)
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('browse', { items });
  });
};

exports.selectItem = (req, res) => {
  const itemId = req.params.id;

  Item.findById(itemId, (err, item) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!item) {
      res.status(404).send('Item not found');
      return;
    }
    if (item.status !== 'available' || item.expirationDate < new Date()) {
      res.status(400).send('Item is not available');
      return;
    }

    // Update item status to 'selected' and assign to pantry
    Item.selectItem(itemId, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/items');
    });
  });
};

exports.addItem = (req, res) => {
  const { name, description, expirationDate } = req.body;
  const userId = req.session.user._id;

  Item.create({ name, description, expirationDate, userId, status: 'available' }, (err, newItem) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/dashboard');
  });
};

// Get all items from the database
exports.getAllItems = async () => {
   return Item.findAllAvailable((err, item) => {
      if (err) {
        console.log("err ", err)
      }
      else {
        return item;
      }
    })
  
  };


  // Delete an item by ID

exports.deleteItem = async (itemId) => {
  try {
    await Item.delete(itemId);
    await db.persistence.compactDatafile(); // Force compaction
    return "Item deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete user.");
  }
};

