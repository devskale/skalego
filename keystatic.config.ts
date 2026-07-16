import { config, collection, fields } from '@keystatic/core';
import { AUTHOR_KEYS, AUTHORS } from './src/lib/authors';

// Keystatic config — mirrors the blog content collection (src/content.config.ts)
// so posts can be edited visually at /keystatic without touching Markdown/Git.
//
// Modes:
//   - local:  edits write to files when running `astro dev` (localhost:4321/keystatic)
//   - github: edits commit to the repo via GitHub OAuth (needs an SSR adapter in prod)
const isProd = import.meta.env.PROD;

export default config({
  storage: isProd ? { kind: 'github', repo: 'devskale/skalego' } : { kind: 'local' },
  ui: { brand: { name: 'skale.dev' } },
  collections: {
    posts: collection({
      label: 'Blogposts',
      slugField: 'title',
      path: 'src/content/blog/*/',
      entryLayout: 'content',
      format: { contentField: 'content' },
      columns: ['title', 'date', 'author'],
      schema: {
        title: fields.slug({
          name: { label: 'Titel', validation: { length: { min: 1 } } },
        }),
        description: fields.text({
          label: 'Teaser / Kurzbeschreibung',
          description: 'Erscheint auf der Blog-Übersicht und als Meta-Beschreibung (SEO).',
          multiline: true,
        }),
        date: fields.date({ label: 'Datum', validation: { isRequired: true } }),
        author: fields.select({
          label: 'Autor',
          options: AUTHOR_KEYS.map((key) => ({ label: AUTHORS[key].name, value: key })),
          defaultValue: 'johann',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags / Kategorien',
          itemLabel: (props) => props.value,
        }),
        image: fields.image({
          label: 'Hero-Bild',
          description: 'Titelbild des Posts (oben und in der Übersicht). Optional.',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
          validation: { isRequired: false },
        }),
        draft: fields.checkbox({
          label: 'Entwurf (versteckt)',
          description: 'Wenn angehakt, wird der Post nicht veröffentlicht.',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: 'Inhalt',
          description: 'Haupttext des Blogposts.',
          options: {
            image: { directory: 'public/images/blog', publicPath: '/images/blog/' },
          },
        }),
        skills: fields.array(
          fields.object({
            slug: fields.text({ label: 'Slug', validation: { length: { min: 1 } } }),
            desc: fields.text({ label: 'Beschreibung', multiline: true }),
            install: fields.text({
              label: 'Install',
              description: 'pi-skill | pi-skillset:a,b | command:<cmd>',
            }),
            hidden: fields.checkbox({
              label: 'Hidden',
              description: 'Hide from /skills list (still installable via /s/<slug>)',
              defaultValue: false,
            }),
          }),
          {
            label: 'Recommended skills (drives /skills + /s/<slug>)',
            itemLabel: (props) => props.fields.slug.value,
          }
        ),
      },
    }),
  },
});
