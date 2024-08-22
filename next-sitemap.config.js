module.exports = {
  siteUrl: "https://beads-rouge.vercel.app//",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/login"],
  alternateRefs: [
    {
      href: "https://beads-rouge.vercel.app//",
      hreflang: "ko",
    },
    {
      href: "https://beads-rouge.vercel.app//en",
      hreflang: "en",
    },
  ],
};
