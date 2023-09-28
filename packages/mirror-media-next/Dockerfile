ARG NODE_VERSION=16-slim

# Install dependencies only when needed
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile --production

# Rebuild the source code only when needed
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner

RUN set -e; \
    apt-get update -y && apt-get -y install tini; \
    apt-get clean

WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/run.sh ./
COPY --from=builder /app/amp-proxy-server.js ./

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chmod +x run.sh

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/app/run.sh"]