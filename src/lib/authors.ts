// Central author definitions — single source of truth for blog bylines + JSON-LD.

export type AuthorKey = 'johann';

export interface Author {
  key: AuthorKey;
  name: string;
  role: string;
}

export const AUTHORS: Record<AuthorKey, Author> = {
  johann: { key: 'johann', name: 'DI Johann Waldherr', role: 'AI Engineer' },
};

export const AUTHOR_KEYS = Object.keys(AUTHORS) as AuthorKey[];

/** Map a frontmatter author key to the full display name. */
export function authorName(key?: string): string | undefined {
  if (!key) return undefined;
  return AUTHORS[key as AuthorKey]?.name;
}
