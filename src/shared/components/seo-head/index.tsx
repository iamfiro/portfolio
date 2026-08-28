import { Helmet } from "react-helmet";

interface Props {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown>;
}

const SITE_URL = "https://devfiro.com";
const DEFAULT_TITLE = "Sungju Cho - Creative Developer";
const DEFAULT_DESCRIPTION = "Creative Developer building delightful digital experiences.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  article,
  jsonLd,
}: Props) {
  const fullTitle = title ? `${title} | Sungju Cho` : DEFAULT_TITLE;
  const canonical = `${SITE_URL}${path}`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sungju Cho",
    url: SITE_URL,
    jobTitle: "Creative Developer",
    sameAs: [
      "https://github.com/iamfiro",
      "https://www.linkedin.com/in/sungju-cho/",
      "https://www.instagram.com/chxs_u/",
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Sungju Cho Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific meta */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.tags?.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd ?? defaultJsonLd).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}
