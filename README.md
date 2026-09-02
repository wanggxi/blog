# Blog

An Astro personal site with a Payload CMS, PostgreSQL-backed publishing, and S3-compatible media storage.

## What is included

- Astro public site with on-demand article and project pages
- Payload admin at `/admin` for articles, projects, tags, media, site settings, and audit events
- PostgreSQL-backed publishing through `/api/content/v1/*`; publishing does not require Git or a rebuild
- Safe MDX compilation with a component allowlist
- Cloudflare R2/S3-compatible media storage with local filesystem fallback
- Docker Compose deployment behind Caddy with automatic TLS

## Requirements

- Node.js 24 or newer
- pnpm 11.24.0
- Docker with Compose for the full local stack

Never commit real credentials. Copy `.env.example` to `.env` only on a development machine or server and replace every example secret.

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Astro runs at `http://localhost:4321` and Payload at `http://localhost:3000/admin`.

## Server deployment

Set real hostnames, passwords, Payload secret, and R2 credentials in `.env`, then run:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Only Caddy exposes public ports. PostgreSQL and the CMS service stay on the private Compose network. If R2 is not configured, uploaded media is retained in the `media-data` Docker volume. The first visit to the admin URL creates the initial owner account when the users collection is empty.

Architecture and rollout details remain in [`docs/superpowers/specs/2026-09-02-blog-platform-design.md`](docs/superpowers/specs/2026-09-02-blog-platform-design.md) and [`docs/superpowers/plans/2026-09-02-blog-platform-implementation.md`](docs/superpowers/plans/2026-09-02-blog-platform-implementation.md).
