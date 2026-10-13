import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
if (process.env.CF_PAGES_BRANCH === 'main') {
  const manifest = JSON.parse(await readFile('content/published-hub-manifest.json', 'utf8').catch(error => {
    if (error.code === 'ENOENT') return '[]';
    throw error;
  }));
  if (manifest.some(page => page.published && page.editorial_release !== 'approved')) {
    throw new Error('Hub content requires editorial release approval before a production build.');
  }
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['assets', 'subscribe', 'testing', 'privacy', 'index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'og-dd.jpg', 'site.webmanifest']) {
  await cp(path, 'dist/' + path, { recursive: true });
}
const hubManifestPath = 'content/published-hub-manifest.json';
let hubPages = [];
try {
  const manifest = JSON.parse(await readFile(hubManifestPath, 'utf8'));
  if (!Array.isArray(manifest)) throw new Error('Hub manifest must be an array.');
  hubPages = manifest.filter(page => page.published === true);
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const hubPaths = new Set();
for (const page of hubPages) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(page.page_path) || hubPaths.has(page.page_path)) throw new Error('Invalid or duplicate hub page path.');
  hubPaths.add(page.page_path);
  if (!['en', 'es'].includes(page.language) || (page.page_path.startsWith('/es/')) !== (page.language === 'es')) throw new Error('Hub language and path do not agree.');
  for (const key of ['pair_id', 'topic_cluster', 'template_type']) {
    if (typeof page[key] !== 'string' || !/^[A-Za-z0-9_.-]{1,80}$/.test(page[key])) throw new Error('Missing/invalid hub analytics context: ' + key);
  }
  const source = page.page_path === '/' ? 'index.html' : page.page_path.slice(1) + 'index.html';
  let html = await readFile(source, 'utf8');
  if (!new RegExp('<html\\b[^>]*\\blang=["\']' + page.language + '["\']', 'i').test(html)) throw new Error('Source HTML language does not match the hub manifest: ' + source);
  html = html.replace(/<html\b([^>]*)>/i, (_, attrs) => '<html' + attrs.replace(/\s+data-(?:pair-id|topic-cluster|template-type)=["'][^"']*["']/gi, '') +
    ' data-pair-id="' + page.pair_id + '" data-topic-cluster="' + page.topic_cluster + '" data-template-type="' + page.template_type + '">');
  const destination = 'dist/' + source;
  await mkdir(destination.slice(0, destination.lastIndexOf('/')), { recursive: true });
  await writeFile(destination, html);
}
// Every full HTML document gets the same public config before the analytics
// bootstrap. Includes/fragments are not HTML documents and are left alone.
async function configureDocuments(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = directory + '/' + entry.name;
    if (entry.isDirectory()) { await configureDocuments(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    if (!/<head[\s>]/i.test(html)) continue;
    const scripts = '<script src="/assets/js/site-config.js?v=20261012-batch13" defer></script>\n<script src="/assets/js/head.js?v=20261012-batch13" defer></script>\n';
    html = html.replace(/<script\b[^>]*\bsrc=["']\/assets\/js\/(?:site-config|head)\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, '');
    html = html.replace(/<\/head>/i, scripts + '</head>');
    await writeFile(file, html);
  }
}
await configureDocuments('dist');
if (hubPages.length) {
  const check = spawnSync('python3', ['scripts/check-hub-links.py', 'dist', hubManifestPath], { stdio: 'inherit' });
  if (check.error) throw check.error;
  if (check.status !== 0) throw new Error('Hub release blocked: contextual link minimums failed.');
}
// Preview deployments keep crawlable links for QA but cannot enter search results.
if (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main') {
  async function protectPreview(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = directory + '/' + entry.name;
      if (entry.isDirectory()) { await protectPreview(file); continue; }
      if (!entry.name.endsWith('.html')) continue;
      let html = await readFile(file, 'utf8');
      if (!/<head[\s>]/i.test(html)) continue;
      html = html.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi, '');
      html = html.replace(/<\/head>/i, '<meta name="robots" content="noindex, nofollow"></head>');
      html = html.replaceAll('https://dobermandeals.com', 'https://staging.dobermandeals.com');
      await writeFile(file, html);
    }
  }
  await protectPreview('dist');
  await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
  await writeFile('dist/sitemap.xml', (await readFile('dist/sitemap.xml', 'utf8')).replaceAll('https://dobermandeals.com', 'https://staging.dobermandeals.com'));
  await rm('dist/testing', { recursive: true, force: true });
}
