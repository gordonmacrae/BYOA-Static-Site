const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: true,
    mangle: false
});

// Create base directories
fs.ensureDirSync('public/dist');
fs.ensureDirSync('public/blog');

// Read base template
const baseTemplate = fs.readFileSync('src/templates/base.html', 'utf-8');

// Build pages from markdown
async function buildPages() {
    const pagesDir = 'src/content/pages';
    const files = await fs.readdir(pagesDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
            const { attributes, body } = frontMatter(content);
            const html = marked(body);
            
            const pageHtml = baseTemplate
                .replace('{{title}}', attributes.title || 'My Site')
                .replace('{{content}}', html);
            
            const outputPath = `public/dist/${file.replace('.md', '.html')}`;
            await fs.writeFile(outputPath, pageHtml);
        }
    }
}

// Build blog posts
async function buildBlog() {
    const blogDir = 'src/content/blog';
    const files = await fs.readdir(blogDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
            const { attributes, body } = frontMatter(content);
            const html = marked(body);
            
            const pageHtml = baseTemplate
                .replace('{{title}}', attributes.title || 'Blog Post')
                .replace('{{content}}', html);
            
            const outputPath = `public/blog/${file.replace('.md', '.html')}`;
            await fs.writeFile(outputPath, pageHtml);
        }
    }
}

// Copy static assets
async function copyStatic() {
    await fs.copy('src/styles', 'public/styles');
    await fs.copy('src/scripts', 'public/scripts');
    await fs.copy('src/assets', 'public/assets');
}

// Run build
async function build() {
    await Promise.all([
        buildPages(),
        buildBlog(),
        copyStatic()
    ]);
}

build().catch(console.error); 