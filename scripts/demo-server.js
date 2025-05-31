const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const base = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  // Normalize the path and ensure it doesn’t escape the base directory
  const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(base, normalizedPath);
  if (requestPath === '/' || requestPath === '') {
    filePath = path.join(base, 'example', 'index.html');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`Error serving ${filePath}:`, err.code);
      res.writeHead(404);
      res.end(err.code === 'ENOENT'
        ? 'File not found'
        : 'Error processing request');
      return;
    }
    const ext = path.extname(filePath).slice(1);
    const types = {
      html: 'text/html',
      js: 'text/javascript',
      css: 'text/css',
      json: 'application/json',
      svg: 'image/svg+xml',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif'
    };
    const contentType = types[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Demo server running at http://localhost:${port}`);
});
