# WanKong Frontend Transplant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the deployed Astro example frontend with the source-identical Next.js frontend from `wan-kong/wankong.top`.

**Architecture:** Keep the existing Payload CMS and PostgreSQL services intact. Add the `wankong.top` Next.js application as the public `web` service, preserving its `src`, `public`, MDX posts, components, styling, and routes; only deployment metadata and service wiring may change.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, pnpm, Docker Compose, Payload CMS, PostgreSQL.

**Spec:** User-approved in-chat requirement on 2026-09-02: direct source transplant of `https://github.com/wan-kong/wankong.top`, visually and behaviorally identical, with minimal deployment-only changes.

## Global Constraints

- Preserve the original `wankong.top` frontend source and content without visual redesign.
- Do not delete or rewrite the existing Payload CMS service.
- Keep the current server's existing Nginx/80 site untouched.
- Public frontend remains reachable on port `4321` until a domain is supplied.
- Validate with the original project's build/lint checks and live HTTP checks.

---

### Task 1: Copy the source-identical frontend

**Files:**
- Create: `frontend/` copied from `/data/projects/current-project/sessions/wankong.top`
- Exclude: `.git/`, `node_modules/`, `.next/`
- Preserve: `src/`, `public/`, `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `components.json`, `biome.json`, and deployment-relevant config. Exclude upstream agent instructions, CI metadata, and development-only scripts.

**Interfaces:**
- Produces a standalone Next.js application runnable with `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm start`.

- [x] **Step 1: Copy the tracked source tree**

  Copy all tracked files from `wankong.top` into `frontend/` while omitting repository metadata and generated dependencies/build output.

- [x] **Step 2: Verify source parity**

  Compare the copied tree against `wankong.top` with `diff -qr`, allowing only the explicitly omitted generated directories.

### Task 2: Add an isolated frontend image

**Files:**
- Create: `frontend/Dockerfile`
- Modify: `compose.yaml`

**Interfaces:**
- `frontend/Dockerfile` builds the copied Next app and starts it on `0.0.0.0:4321`.
- Compose `web` builds from `./frontend` and publishes host port `4321`.

- [x] **Step 1: Add the standalone Docker build**

  Use Node 24, Corepack pnpm 11.24.0, `pnpm install --frozen-lockfile`, `pnpm build`, then run `pnpm start` with `HOSTNAME=0.0.0.0` and `PORT=4321`.

- [x] **Step 2: Point the web service at the new build context**

  Change only the Compose `web.build` context and healthcheck assumptions required by the Next app. Keep CMS/Postgres dependencies and restart policy.

### Task 3: Verify locally before deployment

**Files:**
- Test: `frontend` package scripts and existing source tests

- [x] **Step 1: Install and build**

  Run `pnpm install --frozen-lockfile` and `pnpm build` in `frontend/`; expect a successful Next production build.

- [x] **Step 2: Run the original checks**

  Run `pnpm lint`; run the repository's existing tests if present; failures must be investigated rather than hidden.

- [x] **Step 3: Start the frontend and smoke-test routes**

  Start `pnpm start` on port `4321`, then request `/`, `/blog`, `/projects`, and `/about`, expecting HTTP 200/redirect responses matching the original app.

### Task 4: Deploy and validate on the target server

**Files:**
- Server: `/opt/wanggxi-blog/frontend/`
- Server: `/opt/wanggxi-blog/frontend/Dockerfile`
- Server: `/opt/wanggxi-blog/compose.yaml`
- Server: existing `.env` and `compose.override.yaml`

- [x] **Step 1: Sync the frontend and deployment files**

  Copy the validated frontend tree and Compose/Docker changes to the server without touching Nginx configuration or existing database volumes.

- [x] **Step 2: Rebuild and restart only the web service**

  Run `docker compose build web` followed by `docker compose up -d web`; keep CMS and PostgreSQL running.

- [x] **Step 3: Validate live behavior**

  Check `docker compose ps`, fetch the public frontend at `http://154.31.157.98:4321/`, and verify the main routes and page title/content. Confirm CMS `/health` remains 200.

- [x] **Step 4: Record deployment caveat**

  Report that HTTPS/domain routing is not enabled because the server's port 80 is occupied and no frontend domain was provided.
