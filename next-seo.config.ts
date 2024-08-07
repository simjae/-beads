const config = {
  title: "픽셀 아트 캔버스 - 온라인에서 픽셀 아트를 만들어보세요",
  description:
    "온라인에서 픽셀 아트를 만들어 보세요  예술가와 창작자를 위한 사용하기 쉬운 픽셀 아트 에디터입니다.",
  canonical: "https://www.pixelartcanvas.com/",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.pixelartcanvas.com/",
    title: "픽셀 아트 캔버스 - 온라인에서 픽셀 아트를 만들어보세요",
    description:
      "온라인에서 픽셀 아트를 만들어 보세요  예술가와 창작자를 위한 사용하기 쉬운 픽셀 아트 에디터입니다.",
    site_name: "픽셀 아트 캔버스",
    // images: [
    //   {
    //     url: "https://www.pixelartcanvas.com/og-image.jpg",
    //     width: 800,
    //     height: 600,
    //     alt: "픽셀 아트 캔버스 미리보기",
    //   },
    // ],
  },
  twitter: {
    handle: "@PixelArtCanvas",
    site: "@PixelArtCanvas",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "픽셀 아트, 온라인 픽셀 아트, 픽셀 아트 에디터, 픽셀 아트 만들기, 픽셀 아트 창작, 비즈발",
    },
    {
      name: "author",
      content: "픽셀 아트",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],
};

export default config;
