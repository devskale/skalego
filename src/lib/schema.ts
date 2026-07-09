// JSON-LD structured data helpers for the blog.
// https://schema.org / https://developers.google.com/search/docs/appearance/structured-data/article

import type { CollectionEntry } from 'astro:content';
import { authorName } from './authors';
import { organization } from '@data/site.js';

const SITE_URL = 'https://skale.dev';

/** Absolute URL for a blog post. */
export function getPostUrl(post: CollectionEntry<'blog'>): string {
  return `${SITE_URL}/blog/${post.id}`;
}

/** Absolute URL for the post's hero image (if any). */
export function getPostImageUrl(post: CollectionEntry<'blog'>): string | undefined {
  if (!post.data.image) return undefined;
  return post.data.image.startsWith('http')
    ? post.data.image
    : `${SITE_URL}${post.data.image}`;
}

/** BlogPosting structured data — embed via `<script type="application/ld+json" set:html={...} />`. */
export function getBlogPostingSchema(post: CollectionEntry<'blog'>) {
  const imageUrl = getPostImageUrl(post);
  const imageSchema = imageUrl
    ? { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    image: imageSchema,
    datePublished: post.data.date.toISOString(),
    dateModified: post.data.date.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName(post.data.author) ?? organization.name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: organization.name,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: organization.logo, width: 512, height: 512 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': getPostUrl(post) },
    keywords: post.data.tags?.join(', '),
  };
}
