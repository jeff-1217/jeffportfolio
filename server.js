const express = require('express');
const path = require('path');
const chatHandler = require('./api/chat');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// API Route
app.post('/api/chat', (req, res) => chatHandler(req, res));

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio running at http://localhost:${PORT}\n`);
});
