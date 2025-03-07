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
fs.ensureDirSync('public');
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
            
            // For index.md, place it at the root
            if (file === 'index.md') {
                await fs.writeFile('public/index.html', pageHtml);
            } else {
                // For other pages, create a directory for each page
                const pageName = file.replace('.md', '');
                fs.ensureDirSync(`public/${pageName}`);
                await fs.writeFile(`public/${pageName}/index.html`, pageHtml);
            }
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
            
            const postName = file.replace('.md', '');
            fs.ensureDirSync(`public/blog/${postName}`);
            await fs.writeFile(`public/blog/${postName}/index.html`, pageHtml);
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