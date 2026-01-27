/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.lingotheory.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/dashboard',
    '/api/*',
    '/auth/callback',
    '/auth/reset',
    '/cover',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/callback', '/auth/reset'],
      },
    ],
    additionalSitemaps: [],
  },
  // تحديد الأولوية والتكرار لكل صفحة
  transform: (config, path) => {
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path === '/practice' || path === '/mock-test') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/auth') {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path === '/terms' || path === '/privacy') {
      priority = 0.5;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};

