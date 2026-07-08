#!/usr/bin/env bash
# set -eo pipefail

if [ "$PROXY_AMP" = "true" ]
then
  PROXIED_SERVER_PORT="${PROXIED_SERVER_PORT:-3001}"

  # run next.js together with proxy server
  HOSTNAME=0.0.0.0 PORT=$PROXIED_SERVER_PORT node packages/mirror-media-next/server.js &
  node packages/mirror-media-next/amp-proxy-server.js &
else
  HOSTNAME=0.0.0.0 node packages/mirror-media-next/server.js &
fi

# Exit immediately when one of the background processes terminate.
wait -n
