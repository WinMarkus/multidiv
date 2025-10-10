const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// API endpoint for multiplication
app.get('/api/multiply', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }
  
  res.json({ result: a * b });
});

// API endpoint for division
app.get('/api/divide', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }
  
  if (b === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  
  res.json({ result: a / b });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
