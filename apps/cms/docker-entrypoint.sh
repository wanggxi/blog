#!/bin/sh
set -eu

pnpm --filter @blog/cms payload migrate
exec pnpm --filter @blog/cms start
