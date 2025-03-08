const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the dist directory
app.use('/static', express.static('dist/static'));

// Handle all routes by serving the corresponding HTML file
app.get('*', (req, res) => {
  const urlPath = req.path;
  
  // Special handling for root path
  if (urlPath === '/') {
    res.sendFile(path.resolve('dist/pages/index.html'), (err) => {
      if (err) {
        res.status(404).send('Page not found');
      }
    });
    return;
  }

  // Remove leading slash
  const cleanPath = urlPath.substring(1);
  
  // Try to serve from pages directory first
  const pagesPath = path.resolve(`dist/pages/${cleanPath}.html`);
  res.sendFile(pagesPath, (err) => {
    if (err) {
      // If not found in pages, try root dist directory
      const rootPath = path.resolve(`dist/${cleanPath}.html`);
      res.sendFile(rootPath, (fallbackErr) => {
        if (fallbackErr) {
          res.status(404).send('Page not found');
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 