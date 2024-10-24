// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const pool = require('./config/db'); // Import the pool directly
// const contactRouter = require('./routes/contact');
// const router = express.Router();
// const userController = require('./controllers/userController');
// const bodyParser = require('body-parser');
// const app = express();
// // Middleware
// app.use(cors());
// app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         "script-src": ["'self'", "'unsafe-inline'"],
//         "style-src": ["'self'", "'unsafe-inline'"],
//       },
//     },
//   }));
// app.use(morgan('combined'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
// //MIME type handling
// app.use((req, res, next) => {
//   if (req.url.endsWith('.js')) {
//     res.type('application/javascript; charset=UTF-8');
//   }
//   next();
// });
// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, '..', 'public')));
// app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
// console.log('Static middleware set up for:', path.join(__dirname, '..', 'public'));

// app.use('/api', require('./routes/users'));
// app.use((req, res, next) => {
//   console.log(`Request for: ${req.url}, Type: ${req.get('Accept')}`);
//   next();
// });
// // Define a route for the root URL
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// // Function to test database connection
// const testDatabaseConnection = async () => {
//     try {
//         const connection = await pool.getConnection();
//         console.log('Database connected successfully');
//         connection.release(); // Release the connection back to the pool
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         throw error;
//     }
// };

// // Start the server after testing the database connection
// const PORT = process.env.PORT || 3000;
// testDatabaseConnection()
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     })
//     .catch(() => {
//         console.error('Failed to connect to the database. Exiting...');
//         process.exit(1); // Exit the process if the database connection fails
//     });
//     // Add this route handler
// app.post('/contact', async (req, res) => {
//     try {
//       // Process the form data here
//       console.log(req.body);  // Log the form data
//       const { name, email, 'inquiry-type': inquiryType, message } = req.body;
    
//     // Insert into database
//     const [result] = await pool.query(
//         'INSERT INTO contact (name, email, inquiry_type, message) VALUES (?, ?, ?, ?)',
//         [name, email, inquiryType, message]
//       );

//     if (result.affectedRows === 1) {
//       res.status(200).json({ message: 'Form submitted successfully' });
//     } else {
//       throw new Error('Database insert failed');
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(500).json({ message: 'Error submitting form' });
//   }
// });
// router.post('/register', userController.register);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const pool = require('./config/db'); // Import the pool directly
const contactRouter = require('./routes/contact');
const userController = require('./controllers/userController');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// MIME type handling
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript; charset=UTF-8');
  }
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
console.log('Static middleware set up for:', path.join(__dirname, '..', 'public'));

app.use('/api', require('./routes/users'));

app.use((req, res, next) => {
  console.log(`Request for: ${req.url}, Type: ${req.get('Accept')}`);
  next();
});

// Contact form submission route
app.post('/contact', async (req, res) => {
    try {
      // Process the form data here
      console.log(req.body);  // Log the form data
      const { name, email, 'inquiry-type': inquiryType, message } = req.body;
    
      // Insert into database
      const [result] = await pool.query(
          'INSERT INTO contact (name, email, inquiry_type, message) VALUES (?, ?, ?, ?)',
          [name, email, inquiryType, message]
      );

      if (result.affectedRows === 1) {
        res.status(200).json({ message: 'Form submitted successfully' });
      } else {
        throw new Error('Database insert failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ message: 'Error submitting form' });
    }
});

// User registration route
app.post('/register', userController.register);

// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});
//login path
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});
app.get('/patient-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'patient-dashboard.html'));
});

app.get('/provider-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'provider-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin-dashboard.html'));
});


// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Function to test database connection
const testDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

// Start the server after testing the database connection
const PORT = process.env.PORT || 3000;
testDatabaseConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(() => {
        console.error('Failed to connect to the database. Exiting...');
        process.exit(1); // Exit the process if the database connection fails
    });

module.exports = app;