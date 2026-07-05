# PropLogAI Blog

Static Astro blog for PropLogAI education content.

## Stack

- Astro 4
- MDX
- Tailwind CSS
- Static deployment on Vercel

## Content source of truth

Airtable is the editorial planning and review source of truth. The production blog is published from Markdown or MDX files in `src/content/blog`.

Recommended Airtable flow:

1. Select a topic from the `SEO Blog Content Plan` table.
2. Draft the article and metadata in Airtable.
3. Keep the Airtable status aligned with the workflow: `Idea` → `Brief Needed` → `Drafting` → `Editing` → `Published`.
4. After manual approval, create a Markdown file in `src/content/blog`.
5. Keep `draft: true` until the post is approved for publication.
6. Open a GitHub pull request for review.
7. Publish by setting `draft: false` or removing the draft flag, then merge to `main`.

## Blog post frontmatter

Use `src/content/blog/_template.md` as the starting point for new posts.

Required fields:

- `title`
- `description`
- `date`

Recommended fields:

- `author`
- `tags`
- `coverImage`
- `draft`
- `seoTitle`
- `metaTitle`
- `primaryKeyword`
- `secondaryKeywords`
- `searchIntent`
- `funnelStage`
- `pillarPage`
- `internalLinks`
- `externalCitations`
- `cta`
- `disclaimer`

Notes:

- `internalLinks` and `externalCitations` are retained for editorial tracking and SEO review, but they are not rendered as public article sections.
- Do not add public article body sections titled `Article Guide`, `Educational sources`, `Related PropLog AI resources`, or `Sources and further reading`.
- The article layout automatically renders up to three related blog cards below the CTA.
- Every new article should use a unique `coverImage`. Do not reuse an existing cover unless intentionally updating or republishing that same article.

## Publishing safety rules

- Never publish directly from an unreviewed draft.
- Use `draft: true` for any article that is still in editorial review.
- Do not include trading signals, personal financial advice, investment recommendations, or guaranteed outcomes.
- Prop firm rules change. Articles that discuss firm rules should remind readers to verify terms with the specific firm.
- Outbound citation links should be treated as nofollow in publishing notes or final HTML.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
