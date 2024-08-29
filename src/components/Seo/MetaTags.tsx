import Head from "next/head";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  adKeywords?: string; // 광고 관련 키워드 추가
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  author,
  image,
  url,
  adKeywords,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {adKeywords && <meta name="adsense-keywords" content={adKeywords} />}{" "}
      {/* 광고 키워드 */}
      {author && <meta name="author" content={author} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
};

export default MetaTags;
