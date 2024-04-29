const Item = require('../models/Item');

exports.browse = async (req, res) => {
  try {
    const items = await Item.find({ status: 'available', expirationDate: { $gt: new Date() } });
    res.render('browse', { items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.selectItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).send('Item not found');
    }

    if (item.status !== 'available' || item.expirationDate < new Date()) {
      return res.status(400).send('Item is not available');
    }

    // Update item status to 'selected' and assign to pantry
    item.status = 'selected';
    await item.save();

    res.redirect('/items');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addItem = async (req, res) => {
  const { name, description, expirationDate } = req.body;
  const userId = req.session.user._id;

  try {
    const newItem = await Item.create({ name, description, expirationDate, userId, status: 'available' });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllItems = async (id) => {
  let params = {}
  if (id !== undefined) {
    params.userId = id
  }
  try {
    const items = await Item.find(params);
    return items;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch items.");
  }
};

exports.deleteItem = async (itemId) => {
  try {
    await Item.findByIdAndDelete(itemId);
    return "Item deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete item.");
  }
};
