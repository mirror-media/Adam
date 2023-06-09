#!/usr/bin/env bash
# set -eo pipefail

if [ "$PROXY_AMP" = "true" ]
then
  # run next.js together with proxy server
  PORT=$PROXIED_SERVER_PORT yarn start &
  yarn run start-amp-proxy-server &
else
  yarn start &
fi

# Exit immediately when one of the background processes terminate.
wait -n
