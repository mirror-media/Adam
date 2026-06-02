#!/usr/bin/env bash
# set -eo pipefail

if [ "$PROXY_AMP" = "true" ]
then
  # run next.js together with proxy server
  PORT=$PROXIED_SERVER_PORT node packages/mirror-media-next/server.js &
  node packages/mirror-media-next/amp-proxy-server.js &
else
  node packages/mirror-media-next/server.js &
fi

# Exit immediately when one of the background processes terminate.
wait -n
