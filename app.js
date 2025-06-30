const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mock data
const users = [
  { id: 1, name: 'Ali' },
  { id: 2, name: 'Rehan' },
  { id: 3, name: 'Hamza' }
];

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the User API');
});

// Users route
app.get('/users', (req, res) => {
  res.json(users);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
