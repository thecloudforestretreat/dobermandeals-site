import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['assets', 'subscribe', 'testing', 'privacy', 'index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'og-dd.jpg', 'site.webmanifest']) {
  await cp(path, 'dist/' + path, { recursive: true });
}
