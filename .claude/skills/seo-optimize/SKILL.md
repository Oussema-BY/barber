---
name: seo-optimize
description: Optimize pages and articles for SEO. Generate metadata, structured data, Open Graph tags, and improve content for search engines.
argument-hint: [page-or-article]
allowed-tools: Read, Grep, Glob
---

## SEO Optimization Skill

You are an SEO expert for BlogDesk. Help optimize blog content and pages for search engines.

### Next.js Metadata API

Use the Next.js 15 metadata API for all SEO tags:

```tsx
// Static metadata
export const metadata: Metadata = {
  title: "Page Title | Site Name",
  description: "Compelling description under 160 chars",
  openGraph: {
    title: "OG Title",
    description: "OG Description",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Title",
    description: "Twitter Description",
  },
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  return {
    title: article.title,
    description: article.excerpt,
    // ...
  };
}
```

### Structured Data (JSON-LD)

Add structured data for articles:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImage,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { "@type": "Person", name: article.author },
    }),
  }}
/>
```

### SEO Checklist for Articles

- [ ] Title tag: 50-60 chars, keyword-rich, unique
- [ ] Meta description: 120-160 chars, compelling, includes CTA
- [ ] URL slug: short, lowercase, hyphenated, keyword-included
- [ ] H1 tag: one per page, matches content intent
- [ ] Heading hierarchy: H1 → H2 → H3 (no skipping)
- [ ] Image alt text: descriptive, includes keywords naturally
- [ ] Internal links: link to related articles
- [ ] Open Graph image: 1200x630px
- [ ] Canonical URL set
- [ ] Sitemap inclusion

### Content Optimization Tips

1. Target one primary keyword per article
2. Use keyword in first 100 words
3. Include related keywords naturally
4. Write for humans first, search engines second
5. Aim for 1000+ words for pillar content
6. Use short paragraphs (2-3 sentences)
7. Include a table of contents for long articles

### Reference

Optimizing: $ARGUMENTS
