ARG NODE_VERSION=24-slim

# Install dependencies only when needed
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/mirror-media-next/package.json packages/mirror-media-next/package.json
RUN pnpm install --frozen-lockfile

# Two separate install stages by design:
# - `deps`: full install (including devDependencies) used by `builder`
# - `prod-deps`: production-only install used by `runner`
# Do not merge them, or devDependencies would leak into the final image.
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/mirror-media-next/package.json packages/mirror-media-next/package.json
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Rebuild the source code only when needed
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/mirror-media-next/node_modules ./packages/mirror-media-next/node_modules
COPY . .

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_IS_PREVIEW_MODE
ARG NEXT_PUBLIC_ENV
ARG ANALYZE=false
# Set as environment variables so Next.js can use them during build
ENV NEXT_PUBLIC_IS_PREVIEW_MODE=${NEXT_PUBLIC_IS_PREVIEW_MODE}
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV ANALYZE=${ANALYZE}

WORKDIR /app/packages/mirror-media-next
RUN pnpm build
RUN if [ "$NEXT_PUBLIC_ENV" = "local" ] || [ "$NEXT_PUBLIC_ENV" = "dev" ] || [ "$NEXT_PUBLIC_ENV" = "staging" ]; then \
    pnpm storybook:build; \
    else \
    test ! -d public/_storybook && test ! -d public/storybook; \
    fi
RUN if [ "$ANALYZE" = "true" ] && [ -d .next/analyze ]; then \
    mkdir -p public/analyze; \
    cp .next/analyze/*.html public/analyze/; \
    fi

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner

RUN set -e; \
    apt-get update -y && apt-get -y install tini; \
    apt-get clean

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages/mirror-media-next/node_modules ./packages/mirror-media-next/node_modules
COPY --from=builder /app/packages/mirror-media-next/run.sh ./
COPY --from=builder /app/packages/mirror-media-next/amp-proxy-server.js ./packages/mirror-media-next/amp-proxy-server.js

COPY --from=builder /app/packages/mirror-media-next/public ./packages/mirror-media-next/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/packages/mirror-media-next/.next/standalone ./
COPY --from=builder /app/packages/mirror-media-next/.next/static ./packages/mirror-media-next/.next/static

RUN chmod +x run.sh

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/app/run.sh"]
