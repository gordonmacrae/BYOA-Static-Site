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

// Clean dist directory
fs.removeSync('dist');
fs.ensureDirSync('dist');

// Copy static files and .nojekyll
fs.copySync('src/static', 'dist/static');
fs.writeFileSync('dist/.nojekyll', '');

// Process index.md first
const indexContent = fs.readFileSync('src/content/pages/index.md', 'utf-8');
const indexTitle = indexContent.split('\n')[0].replace('# ', '');
const indexHtml = convertMarkdownToHtml(indexContent, indexTitle);
fs.writeFileSync('dist/index.html', indexHtml);
console.log('Built: dist/index.html');

// Process 404.md
const notFoundContent = fs.readFileSync('src/content/pages/404.md', 'utf-8');
const notFoundTitle = notFoundContent.split('\n')[0].replace('# ', '');
const notFoundHtml = convertMarkdownToHtml(notFoundContent, notFoundTitle);
fs.writeFileSync('dist/404.html', notFoundHtml);
console.log('Built: dist/404.html');

// Function to process other markdown files
function processMarkdownFile(filePath) {
  // Skip index.md and 404.md as they're handled separately
  if (filePath.endsWith('index.md') || filePath.endsWith('404.md')) {
    return;
  }

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

// Process remaining content
processDirectory('src/content');

console.log('Build completed successfully!'); 