import Head from "next/head";

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://beads-rouge.vercel.app",
    name: "비즈발",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://beads-rouge.vercel.app/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export default StructuredData;
