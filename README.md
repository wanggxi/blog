# Blog

A source-transplanted Next.js personal site from [`wan-kong/wankong.top`](https://github.com/wan-kong/wankong.top), with a Payload CMS, PostgreSQL, and Docker deployment.

## What is included

- Next.js public site with the source project's pages, components, styles, animations, fonts, assets, and MDX posts
- Payload admin at `/admin` for articles, projects, tags, media, site settings, and audit events
- Payload content API at `/api/content/v1/*` remains available for CMS-managed content; the transplanted frontend currently renders its original MDX content
- Safe MDX compilation with a component allowlist
- Cloudflare R2/S3-compatible media storage with local filesystem fallback
- Docker Compose deployment with the transplanted frontend served as a static Next.js export

## Frontend source

The public frontend lives in [`frontend/`](frontend/) and is copied from `wan-kong/wankong.top`. Its routes and visual implementation are intentionally preserved rather than re-created. The standalone `frontend/pnpm-workspace.yaml`, `frontend/Dockerfile`, and `frontend/nginx.conf` are deployment-only files needed to build and serve the static export.

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

The transplanted frontend runs at `http://localhost:4321` and Payload at `http://localhost:3000/admin`.

## Server deployment

Set real hostnames, passwords, Payload secret, and R2 credentials in `.env`, then run:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Only Caddy exposes public ports. PostgreSQL and the CMS service stay on the private Compose network. If R2 is not configured, uploaded media is retained in the `media-data` Docker volume. The first visit to the admin URL creates the initial owner account when the users collection is empty.

The current migration record is in [`docs/superpowers/plans/2026-09-02-wankong-frontend-transplant.md`](docs/superpowers/plans/2026-09-02-wankong-frontend-transplant.md). The earlier Astro design document is historical and does not describe the transplanted frontend.
