"use client";

import Head from "next/head";

export default function MetaTags({ title, description, keywords, canonical, ogImage }) {
  const siteName = "DrHelp.in";
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drhelp.in';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical || currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={siteName} />
    </Head>
  );
}

