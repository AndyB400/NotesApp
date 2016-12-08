// load environment variables
require('dotenv').config();

// grab our dependencies
const express      = require('express'),
  app              = express(),
  port             = process.env.PORT || 3333,
  expressLayouts   = require('express-ejs-layouts'),
  fs               = require('fs'),
  bodyParser       = require('body-parser'),
  session          = require('express-session'),
  cookieParser     = require('cookie-parser'),
  flash            = require('connect-flash'),
  expressValidator = require('express-validator');

// configure our application ===================
// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET, 
  cookie: { maxAge: 60000 },
  resave: false,    // forces the session to be saved back to the store
  saveUninitialized: false  // dont save unmodified
}));
app.use(flash());

// tell express where to look for static assets
app.use(express.static(__dirname + '\\public'));

// set ejs as our templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// set the routes =============================
app.use(require('./app/routes'));

// Handle 404
app.use((req, res) => {
   res.status(404);
   res.render('pages/404notfound');
});

//Handle 500
app.use((error, req, res, next) => {
   res.status(500);
   res.render('pages/500error', { 
        message: `An error occured in the notes application. ${error}`
      });
});

// start our server ===========================
app.listen(port, () => {
  console.log(`Notes App listening on http://localhost:${port}`);
});

