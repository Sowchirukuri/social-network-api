const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/api/user-routes');
const thoughtRoutes = require('./routes/api/thought-routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/social-network', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Use API routes
app.use('/api/users', userRoutes); 
app.use('/api/thoughts', thoughtRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
