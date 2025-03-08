const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

// Get the base URL from package.json or environment
const pkg = require('./package.json');
const baseUrl = process.env.NODE_ENV === 'production' ? '/BYOA-Static-Site' : '';

// Configure marked for security
marked.setOptions({
  headerIds: false,
  mangle: false
});

// Read template
const template = fs.readFileSync('src/templates/base.html', 'utf-8');

// Function to convert markdown to HTML
function convertMarkdownToHtml(markdown, title) {
  const html = marked.parse(markdown);
  return template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{content\}\}/g, html)
    .replace(/\{\{baseUrl\}\}/g, baseUrl);
}

// Function to process a markdown file
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const title = content.split('\n')[0].replace('# ', '');
  const html = convertMarkdownToHtml(content, title);
  
  // Create output path
  const relativePath = path.relative('src/content', filePath);
  const outputPath = path.join('dist', relativePath.replace('.md', '.html'));
  
  // Ensure output directory exists
  fs.ensureDirSync(path.dirname(outputPath));
  
  // Write HTML file
  fs.writeFileSync(outputPath, html);
  console.log(`Built: ${outputPath}`);
}

// Clean dist directory
fs.removeSync('dist');
fs.ensureDirSync('dist');

// Copy static files
fs.copySync('src/static', 'dist/static');

// Process all markdown files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.md')) {
      processMarkdownFile(filePath);
    }
  });
}

// Start processing from content directory
processDirectory('src/content');

console.log('Build completed successfully!'); 