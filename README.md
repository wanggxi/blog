# Blog

An Astro personal site with a Payload CMS, PostgreSQL-backed publishing, and S3-compatible media storage.

## Status

The application is under active construction. The approved architecture is documented in [`docs/superpowers/specs/2026-09-02-blog-platform-design.md`](docs/superpowers/specs/2026-09-02-blog-platform-design.md), and the execution plan is in [`docs/superpowers/plans/2026-09-02-blog-platform-implementation.md`](docs/superpowers/plans/2026-09-02-blog-platform-implementation.md).

## Requirements

- Node.js 24 or newer
- pnpm 11.24.0
- Docker with Compose for the full local stack

Never commit real credentials. Copy `.env.example` to `.env` only on a development machine or server and replace every example secret.
