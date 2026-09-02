# Astro Blog Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Astro personal site with a Payload CMS, PostgreSQL-backed instant publishing, dual rich-text/MDX editing, R2 media, and portable server/Vercel/Cloudflare deployment boundaries.

**Architecture:** A pnpm monorepo contains an Astro on-demand-rendered public site, a Payload CMS/Content API, and shared schema/MDX packages. Payload owns PostgreSQL and object storage; Astro reads only the versioned HTTPS Content API and renders a safe typed tree, so the public site can move independently between Node, Vercel, and Cloudflare.

**Tech Stack:** Node.js 24, pnpm 11, TypeScript, Astro 7, Payload 3, Next.js (Payload runtime), PostgreSQL 17, Zod, unified/mdast, Lexical, CodeMirror, Vitest, Playwright, Docker Compose, Caddy, Cloudflare R2/S3 API.

**Spec:** `docs/superpowers/specs/2026-09-02-blog-platform-design.md`

## Global Constraints

- `sourceMdx` is the only authoritative article body; editor state and `renderTree` are derived.
- Publishing reads/writes PostgreSQL and must not require a Git commit or site rebuild.
- Public routes execute no JavaScript or arbitrary JSX stored in the database.
- MDX allows Markdown plus registered components and rejects imports, exports, expressions, event handlers, scripts, iframes, and unsafe URL schemes.
- Initial authentication is one owner account with password and TOTP; public registration is disabled.
- Production media uses R2 through an S3-compatible interface; local/test media uses MinIO or an in-memory adapter.
- Real credentials never enter Git, CI artifacts, logs, or client bundles.
- Reference-site content, assets, identity, and code must not enter the implementation.
- Normal publication must be visible publicly within 5 seconds.

---

### Task 1: Monorepo and repeatable quality gates

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `.env.example`
- Create: `README.md`

**Interfaces:**
- Produces: root commands `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm test`, and `pnpm lint` used by every later task.

- [ ] **Step 1: Create the workspace manifests**

```json
{
  "name": "@wanggxi/blog",
  "private": true,
  "packageManager": "pnpm@11.24.0",
  "engines": { "node": ">=24" },
  "devDependencies": {
    "@biomejs/biome": "2.2.0",
    "typescript": "5.9.2"
  },
  "scripts": {
    "dev": "pnpm --parallel --filter @blog/web --filter @blog/cms dev",
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  }
}
```

- [ ] **Step 2: Install the empty workspace and verify the root contract**

Run: `pnpm install && pnpm exec tsc --version`

Expected: lockfile generated and TypeScript command exits successfully.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore .npmrc .env.example README.md pnpm-lock.yaml
git commit -m "chore: initialize blog workspace"
```

### Task 2: Shared content contracts

**Files:**
- Create: `packages/content-schema/package.json`
- Create: `packages/content-schema/tsconfig.json`
- Create: `packages/content-schema/src/article.ts`
- Create: `packages/content-schema/src/project.ts`
- Create: `packages/content-schema/src/render-tree.ts`
- Create: `packages/content-schema/src/index.ts`
- Test: `packages/content-schema/src/article.test.ts`

**Interfaces:**
- Produces: `articleSchema`, `projectSchema`, `publishedArticleSchema`, `RenderNode`, and `PublishedArticle` from `@blog/content-schema`.

- [ ] **Step 1: Write a failing article-schema test**

```ts
import { describe, expect, it } from "vitest"
import { articleSchema } from "./article"

describe("articleSchema", () => {
  it("rejects a published article without publishedAt", () => {
    const result = articleSchema.safeParse({
      id: crypto.randomUUID(), slug: "hello", title: "Hello",
      summary: "Summary", sourceMdx: "Hello", status: "published",
      version: 1, formatVersion: 1, tags: [],
    })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to prove the package is missing**

Run: `pnpm --filter @blog/content-schema test`

Expected: FAIL because `articleSchema` does not exist.

- [ ] **Step 3: Implement the Zod contracts and discriminated render tree**

```ts
export type RenderNode =
  | { type: "paragraph"; children: RenderNode[] }
  | { type: "text"; value: string; bold?: boolean; italic?: boolean }
  | { type: "heading"; depth: 1 | 2 | 3 | 4 | 5 | 6; id: string; children: RenderNode[] }
  | { type: "code"; language?: string; value: string }
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "component"; name: string; props: Record<string, string>; children: RenderNode[] }
```

- [ ] **Step 4: Run tests and type checking**

Run: `pnpm --filter @blog/content-schema test && pnpm --filter @blog/content-schema typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/content-schema pnpm-lock.yaml
git commit -m "feat: define shared content contracts"
```

### Task 3: Safe MDX pipeline

**Files:**
- Create: `packages/mdx-pipeline/package.json`
- Create: `packages/mdx-pipeline/tsconfig.json`
- Create: `packages/mdx-pipeline/src/components.ts`
- Create: `packages/mdx-pipeline/src/compile.ts`
- Create: `packages/mdx-pipeline/src/errors.ts`
- Create: `packages/mdx-pipeline/src/index.ts`
- Test: `packages/mdx-pipeline/src/compile.test.ts`

**Interfaces:**
- Consumes: `RenderNode` from `@blog/content-schema`.
- Produces: `compileMdx(source: string): Promise<{ renderTree: RenderNode[]; plainText: string }>` and `MdxValidationError` with `line`, `column`, and `code`.

- [ ] **Step 1: Write failing whitelist and happy-path tests**

```ts
it("rejects imports", async () => {
  await expect(compileMdx('import X from "./x"\n\n# Hello')).rejects.toMatchObject({
    code: "MDX_IMPORT_FORBIDDEN",
    line: 1,
  })
})

it("compiles a registered Notice", async () => {
  const result = await compileMdx('<Notice type="warning">Careful</Notice>')
  expect(result.renderTree[0]).toMatchObject({ type: "component", name: "Notice" })
})
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm --filter @blog/mdx-pipeline test`

Expected: FAIL because `compileMdx` does not exist.

- [ ] **Step 3: Implement parsing without evaluation**

Use `unified`, `remark-parse`, `remark-mdx`, and `remark-gfm` to parse syntax only. Walk the mdast, reject `mdxjsEsm`, `mdxFlowExpression`, `mdxTextExpression`, unsafe HTML/URLs, and components absent from `componentRegistry`; convert allowed nodes to `RenderNode[]`.

- [ ] **Step 4: Run tests, typecheck, and mutation fixtures**

Run: `pnpm --filter @blog/mdx-pipeline test && pnpm --filter @blog/mdx-pipeline typecheck`

Expected: PASS for Markdown/registered components and FAIL with stable errors for all forbidden fixtures.

- [ ] **Step 5: Commit**

```bash
git add packages/mdx-pipeline pnpm-lock.yaml
git commit -m "feat: add safe MDX compilation pipeline"
```

### Task 4: Payload CMS foundation and core collections

**Files:**
- Create: `apps/cms/package.json`
- Create: `apps/cms/next.config.mjs`
- Create: `apps/cms/tsconfig.json`
- Create: `apps/cms/src/payload.config.ts`
- Create: `apps/cms/src/collections/Users.ts`
- Create: `apps/cms/src/collections/Articles.ts`
- Create: `apps/cms/src/collections/Projects.ts`
- Create: `apps/cms/src/collections/Tags.ts`
- Create: `apps/cms/src/collections/Media.ts`
- Create: `apps/cms/src/collections/AuditEvents.ts`
- Create: `apps/cms/src/app/(payload)/layout.tsx`
- Create: `apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `apps/cms/src/app/(payload)/api/[...slug]/route.ts`
- Test: `apps/cms/src/collections/Articles.test.ts`

**Interfaces:**
- Consumes: `compileMdx` and the shared schemas.
- Produces: Payload REST API and collection slugs `users`, `articles`, `projects`, `tags`, `media`, `audit-events`.

- [ ] **Step 1: Scaffold the official Payload 3 blank structure inside `apps/cms`**

Pin `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, and `@payloadcms/richtext-lexical` to `3.88.0`; configure PostgreSQL from `DATABASE_URL` and fail startup when `PAYLOAD_SECRET` is absent.

- [ ] **Step 2: Write failing access and article-state tests**

```ts
expect(Articles.access?.create?.({ req: anonymousReq } as never)).toBe(false)
expect(validatePublication({ status: "published", publishedAt: null })).toEqual({
  path: "publishedAt", message: "Published articles require a publication date",
})
```

- [ ] **Step 3: Implement collections and database migrations**

Enable drafts/versions on articles, soft-delete fields on article/media/project, unique slug indexes, owner-only mutation access, and read access that exposes only the published projection to anonymous callers.

- [ ] **Step 4: Run CMS tests and generate Payload types**

Run: `pnpm --filter @blog/cms generate:types && pnpm --filter @blog/cms test && pnpm --filter @blog/cms typecheck`

Expected: PASS and `apps/cms/src/payload-types.ts` generated.

- [ ] **Step 5: Commit**

```bash
git add apps/cms pnpm-lock.yaml
git commit -m "feat: add Payload content model"
```

### Task 5: Publication service and versioned Content API

**Files:**
- Create: `apps/cms/src/services/publication.ts`
- Create: `apps/cms/src/services/cache-invalidation.ts`
- Create: `apps/cms/src/endpoints/content.ts`
- Create: `apps/cms/src/endpoints/preview.ts`
- Test: `apps/cms/src/services/publication.test.ts`

**Interfaces:**
- Produces: `publishArticle(payload, articleId, expectedVersion)`, `GET /api/content/v1/articles/:slug`, list/project/settings endpoints, and signed preview tokens.

- [ ] **Step 1: Write a failing atomic-publication test**

```ts
await expect(publishArticle(ctx, article.id, 2)).rejects.toMatchObject({ code: "VERSION_CONFLICT" })
expect(await loadPublishedVersion(article.id)).toEqual(previousPublishedVersion)
```

- [ ] **Step 2: Implement publication transaction and API projections**

Compile before the transaction; within one transaction create the immutable version, update the published pointer/status, and append an audit event. Enqueue cache invalidation only after commit and make retries idempotent by publication version id.

- [ ] **Step 3: Run integration tests against PostgreSQL**

Run: `pnpm --filter @blog/cms test:integration`

Expected: PASS for success, compiler failure, version conflict, duplicate retry, withdrawal, rollback, and scheduled publication fixtures.

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/services apps/cms/src/endpoints
git commit -m "feat: publish content atomically"
```

### Task 6: Astro public site vertical slice

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/astro.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/src/styles/global.css`
- Create: `apps/web/src/layouts/SiteLayout.astro`
- Create: `apps/web/src/lib/content-client.ts`
- Create: `apps/web/src/components/RenderTree.astro`
- Create: `apps/web/src/pages/index.astro`
- Create: `apps/web/src/pages/blog/index.astro`
- Create: `apps/web/src/pages/blog/[slug].astro`
- Create: `apps/web/src/pages/projects.astro`
- Create: `apps/web/src/pages/about.astro`
- Create: `apps/web/src/pages/rss.xml.ts`
- Create: `apps/web/src/pages/sitemap.xml.ts`
- Create: `apps/web/src/pages/404.astro`
- Test: `apps/web/src/lib/content-client.test.ts`

**Interfaces:**
- Consumes: Content API v1 and `RenderNode`.
- Produces: original public routes with server rendering for content-dependent pages and prerendering only for content-independent pages.

- [ ] **Step 1: Write failing client validation and renderer tests**

```ts
server.use(http.get("*/api/content/v1/articles/hello", () => HttpResponse.json({ broken: true })))
await expect(getArticle("hello")).rejects.toMatchObject({ code: "INVALID_CONTENT_RESPONSE" })
```

- [ ] **Step 2: Implement the Node-adapter Astro app and typed Content API client**

Use `@astrojs/node` standalone mode. Set `prerender = false` on homepage, blog, article, projects, RSS, and Sitemap routes; set `prerender = true` for about and error pages. Render only the shared typed tree.

- [ ] **Step 3: Build the original responsive visual system**

Implement neutral light/dark tokens, strong typography, border-based separation, visible focus states, reduced-motion support, and no copied content/assets. Use local neutral sample states only when the API contains no published content.

Article pages render a synchronized table of contents, previous/next navigation, sharing metadata, canonical URL, and Open Graph fields. The API-backed homepage/list pages render current site settings and provide tag, year, and keyword filtering without introducing a separate search service.

- [ ] **Step 4: Run unit tests, accessibility smoke tests, and production build**

Run: `pnpm --filter @blog/web test && pnpm --filter @blog/web typecheck && pnpm --filter @blog/web build`

Expected: PASS and standalone server output generated.

- [ ] **Step 5: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat: build Astro public site"
```

### Task 7: Dual rich-text/MDX editor

**Files:**
- Create: `apps/cms/src/components/ArticleEditor/index.tsx`
- Create: `apps/cms/src/components/ArticleEditor/MdxEditor.tsx`
- Create: `apps/cms/src/components/ArticleEditor/RichEditor.tsx`
- Create: `apps/cms/src/components/ArticleEditor/RawMdxNode.tsx`
- Create: `packages/mdx-pipeline/src/editor/deserialize.ts`
- Create: `packages/mdx-pipeline/src/editor/serialize.ts`
- Test: `packages/mdx-pipeline/src/editor/roundtrip.test.ts`

**Interfaces:**
- Produces: deterministic `deserializeMdx(sourceMdx)` and `serializeEditorState(state)`, plus a Payload custom field that saves only `sourceMdx` and `version`.

- [ ] **Step 1: Add round-trip fixtures for every supported node/component**

```ts
for (const fixture of fixtures) {
  const result = serializeEditorState(deserializeMdx(fixture.source))
  expect(normalizeMdx(result)).toBe(normalizeMdx(fixture.source))
}
```

- [ ] **Step 2: Implement converters and raw-block preservation**

Unsupported but parseable draft nodes become read-only raw blocks. Forbidden nodes carry diagnostics and block publication. Source edits are parsed before switching to rich mode.

- [ ] **Step 3: Implement CodeMirror/Lexical tabs with optimistic version saves**

Autosave sends `{ sourceMdx, version }`; HTTP 409 opens a conflict view and never overwrites. The browser recovery copy is namespaced by article id and server version and is removed after a confirmed save.

- [ ] **Step 4: Run round-trip and browser editor tests**

Run: `pnpm --filter @blog/mdx-pipeline test && pnpm --filter @blog/cms test:editor`

Expected: PASS for switching, diagnostics, autosave recovery, and conflicts.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/components/ArticleEditor packages/mdx-pipeline/src/editor
git commit -m "feat: add dual-mode article editor"
```

### Task 8: Media storage and image processing

**Files:**
- Create: `apps/cms/src/media/storage.ts`
- Create: `apps/cms/src/media/s3-storage.ts`
- Create: `apps/cms/src/media/memory-storage.ts`
- Create: `apps/cms/src/media/process-image.ts`
- Create: `apps/cms/src/jobs/delete-media.ts`
- Test: `apps/cms/src/media/process-image.test.ts`

**Interfaces:**
- Produces: `MediaStorage` with `put`, `get`, `delete`, and `exists`; immutable hashed object keys and AVIF/WebP/thumbnail variants.

- [ ] **Step 1: Write failing spoofed-file, deduplication, and cleanup tests**

```ts
await expect(processUpload({ name: "attack.png", bytes: htmlBytes })).rejects.toMatchObject({
  code: "MEDIA_TYPE_MISMATCH",
})
```

- [ ] **Step 2: Implement validated Sharp processing and S3 storage**

Detect bytes independently of the filename, reject SVG, enforce configured byte/pixel limits, hash originals, generate variants before inserting the media row, and remove new objects when the database write fails.

- [ ] **Step 3: Implement reference-aware 30-day trash**

Prevent permanent deletion while a published render tree/project/settings document references the media id. Make deletion jobs idempotent.

- [ ] **Step 4: Run media tests**

Run: `pnpm --filter @blog/cms test:media`

Expected: PASS with in-memory storage and MinIO integration profile.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/media apps/cms/src/jobs/delete-media.ts
git commit -m "feat: add secure media pipeline"
```

### Task 9: Owner security, audit, and recovery

**Files:**
- Create: `apps/cms/src/auth/totp.ts`
- Create: `apps/cms/src/auth/bootstrap-owner.ts`
- Create: `apps/cms/src/auth/rate-limit.ts`
- Create: `apps/cms/src/hooks/audit.ts`
- Test: `apps/cms/src/auth/totp.test.ts`

**Interfaces:**
- Produces: one-time owner bootstrap CLI, TOTP enrollment/challenge/recovery, mutation auditing, and login rate limiting.

- [ ] **Step 1: Write failing TOTP replay and recovery-code tests**

```ts
expect(await verifyTotp(owner, code)).toEqual({ ok: true })
expect(await verifyTotp(owner, code)).toEqual({ ok: false, reason: "replayed" })
expect(await useRecoveryCode(owner, recoveryCode)).toEqual({ ok: true })
expect(await useRecoveryCode(owner, recoveryCode)).toEqual({ ok: false })
```

- [ ] **Step 2: Implement encrypted TOTP state and single-use hashed recovery codes**

Use Web Crypto-compatible primitives, never log secrets, bind enrollment to a recent password confirmation, and require TOTP before creating an authenticated admin session.

- [ ] **Step 3: Add append-only audit hooks and owner bootstrap**

The bootstrap command refuses to run when an owner exists and reads the password interactively. Audit records cannot be changed or deleted through Payload Admin.

- [ ] **Step 4: Run auth/security tests**

Run: `pnpm --filter @blog/cms test:auth`

Expected: PASS for registration disabled, CSRF/origin rejection, rate limit, TOTP, recovery, and audit immutability.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/auth apps/cms/src/hooks
git commit -m "feat: secure owner administration"
```

### Task 10: Containers, backups, CI, and deployment documentation

**Files:**
- Create: `apps/web/Dockerfile`
- Create: `apps/cms/Dockerfile`
- Create: `compose.yaml`
- Create: `infra/caddy/Caddyfile`
- Create: `scripts/backup-postgres.sh`
- Create: `scripts/restore-postgres.sh`
- Create: `scripts/healthcheck.sh`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-server.yml`
- Create: `docs/deployment/server.md`
- Create: `docs/deployment/vercel.md`
- Create: `docs/deployment/cloudflare.md`
- Test: `tests/deployment/compose.bats`

**Interfaces:**
- Produces: reproducible local/server stack, encrypted R2 backups, health checks, CI, and secret-referencing deployment workflow.

- [ ] **Step 1: Write failing Compose configuration assertions**

Verify `web`, `cms`, `worker`, `postgres`, `caddy`, and `backup` services exist; database ports are not published; and no environment value matching a real secret is committed.

- [ ] **Step 2: Implement production and development Compose profiles**

Development adds MinIO. Production uses R2 variables, internal networks, health dependencies, read-only filesystems where supported, named PostgreSQL storage, and Caddy TLS hostnames from environment variables.

- [ ] **Step 3: Implement backup/restore with explicit retention**

Use `pg_dump --format=custom`, client-side authenticated encryption, S3 upload, and 7 daily/4 weekly/6 monthly retention. Restore refuses a non-empty target unless `--confirm-non-empty` is supplied.

- [ ] **Step 4: Implement CI and optional SSH deployment**

CI runs install, format/lint, typecheck, tests, builds, migration check, and secret scan. Deployment references GitHub Secrets and performs backup, migration, rolling container replacement, and health verification.

- [ ] **Step 5: Validate the stack and documentation**

Run: `docker compose config && pnpm lint && pnpm typecheck && pnpm test && pnpm build`

Expected: all commands pass without production credentials; integration services use the development profile.

- [ ] **Step 6: Commit**

```bash
git add apps/*/Dockerfile compose.yaml infra scripts .github docs/deployment tests/deployment .env.example README.md
git commit -m "ops: add portable deployment stack"
```

### Task 11: End-to-end acceptance and release candidate

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/publish.spec.ts`
- Create: `tests/e2e/editor.spec.ts`
- Create: `tests/e2e/media.spec.ts`
- Create: `tests/e2e/recovery.spec.ts`
- Create: `docs/testing.md`

**Interfaces:**
- Consumes: the complete Compose development stack.
- Produces: executable evidence for the spec acceptance criteria.

- [ ] **Step 1: Write E2E scenarios before final fixes**

Cover owner login/TOTP, rich-to-MDX round trip, invalid MDX publication rejection, image upload, signed preview, publication visibility under 5 seconds, failed-publication old-version continuity, rollback, and trash recovery.

- [ ] **Step 2: Run E2E and capture failures**

Run: `pnpm exec playwright test`

Expected: tests initially expose any missing integration behavior rather than being skipped.

- [ ] **Step 3: Fix only observed acceptance failures and rerun all gates**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm exec playwright test`

Expected: all checks PASS with zero skipped acceptance tests.

- [ ] **Step 4: Verify repository hygiene**

Run: `git grep -nE '(BEGIN (RSA|OPENSSH) PRIVATE KEY|postgres(ql)?://[^[:space:]]+:[^[:space:]]+@|AWS_SECRET_ACCESS_KEY=.+)' -- . ':!.env.example'`

Expected: no output.

- [ ] **Step 5: Commit and push the release candidate**

```bash
git add tests/e2e playwright.config.ts docs/testing.md
git commit -m "test: verify blog platform acceptance flows"
git push origin main
```
