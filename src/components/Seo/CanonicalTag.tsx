import Head from "next/head";
import { useRouter } from "next/router";

const CanonicalTag = () => {
  const router = useRouter();
  const canonicalUrl = `https://beads-git-main-simjaes-projects.vercel.app${router.asPath}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default CanonicalTag;
