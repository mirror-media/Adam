ARG NODE_VERSION=16-slim

FROM node:${NODE_VERSION} AS build

WORKDIR /build

RUN echo "NEXT_PUBLIC_ENV: $NEXT_PUBLIC_ENV"

COPY package.json yarn.lock /build/

RUN yarn install

COPY . /build/

RUN yarn build


FROM node:${NODE_VERSION}

RUN set -e; \
    apt-get update -y && apt-get -y install tini; \
    apt-get clean

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock /app/
RUN yarn install

COPY --from=build /build/public ./public
COPY --from=build /build/run.sh /app/
COPY --from=build /build/amp-proxy-server.js /app/
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static


RUN chmod +x run.sh
## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/app/run.sh"]
