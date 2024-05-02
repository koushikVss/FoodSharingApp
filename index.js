const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./src/routes/index');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
// const atlasUri = 'mongodb://localhost:27017/FoodSharingApp';
// const atlasUri = 'mongodb+srv://food:food@food.kz4lco6.mongodb.net/?retryWrites=true&w=majority&appName=Food'
const atlasUri = 'mongodb+srv://ahano:41kempXpIvMD4aEu@foodshareapp.7feuwwn.mongodb.net/?retryWrites=true&w=majority&appName=FoodShareApp'
// const atlasUri = process.env.MONGODB_ATLAS_URI; // Replace with your actual Atlas connection string

const mongoConnect = async () => {
  try {
    await mongoose.connect(atlasUri);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit the application with an error code
  }
};
mongoConnect();


// Configure sessions
app.use(session({
  secret: 'your-secret-key', // You should change this to a random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // Set session expiry time to 1 hour (in milliseconds)
  }
}));

app.use((req, res, next) => {
  // Check if user is logged in
  res.locals.loggedIn = req.session.user ? true : false;

  // Check if user is admin
  res.locals.isAdmin = req.session.user && req.session.user.role === 'admin' ? true : false;

  next();
});


app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
