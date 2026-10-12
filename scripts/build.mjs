import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['assets', 'subscribe', 'testing', 'privacy', 'index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'og-dd.jpg', 'site.webmanifest']) {
  await cp(path, 'dist/' + path, { recursive: true });
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
    const scripts = '<script src="/assets/js/site-config.js?v=20261012-config1" defer></script>\n<script src="/assets/js/head.js?v=20261012-config1" defer></script>\n';
    html = html.replace(/<script\b[^>]*\bsrc=["']\/assets\/js\/(?:site-config|head)\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, '');
    html = html.replace(/<\/head>/i, scripts + '</head>');
    await writeFile(file, html);
  }
}
await configureDocuments('dist');
