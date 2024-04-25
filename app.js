const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./src/routes/index');

const app = express();

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

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
