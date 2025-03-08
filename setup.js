const fs = require('fs-extra');
const path = require('path');

// Create directories
const dirs = [
  'src/content',
  'src/content/blog',
  'src/content/pages',
  'src/templates',
  'src/static/css',
  'src/static/js',
  'src/static/images',
  'dist'
];

dirs.forEach(dir => {
  fs.ensureDirSync(dir);
});

// Create initial files
const files = {
  'src/content/pages/index.md': '# Welcome to My Website\n\nThis is the landing page of my website.',
  'src/content/pages/about.md': '# About\n\nThis is the about page.',
  'src/content/pages/faq.md': '# Frequently Asked Questions\n\nCommon questions and answers.',
  'src/templates/base.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <a href="/faq">FAQ</a>
    </nav>
    <main>
        {{content}}
    </main>
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
  'src/static/css/style.css': `/* Basic styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

nav {
    margin-bottom: 2rem;
}

nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #333;
}

nav a:hover {
    text-decoration: underline;
}

footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}`
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(file, content);
});

console.log('Project structure created successfully!'); 