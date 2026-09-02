FROM node:24-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY apps/cms/package.json apps/cms/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/content-schema/package.json packages/content-schema/package.json
COPY packages/mdx-pipeline/package.json packages/mdx-pipeline/package.json
RUN pnpm install --frozen-lockfile
COPY . .

FROM base AS web-build
RUN pnpm --filter @blog/web build

FROM node:24-bookworm-slim AS web
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
WORKDIR /app
COPY --from=web-build /workspace/apps/web/dist ./dist
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]

FROM base AS cms-build
ARG BUILD_DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ARG BUILD_PAYLOAD_SECRET=build-only-secret-not-used-at-runtime
ENV DATABASE_URL=$BUILD_DATABASE_URL
ENV PAYLOAD_SECRET=$BUILD_PAYLOAD_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @blog/cms build

FROM node:24-bookworm-slim AS cms
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
COPY --from=cms-build /workspace /workspace
EXPOSE 3000
CMD ["sh", "apps/cms/docker-entrypoint.sh"]
