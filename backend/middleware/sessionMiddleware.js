const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 15 * 60 * 1000 // 15 minutes
  }
});
