#!/usr/bin/env bash
# set -eo pipefail

HOSTNAME=0.0.0.0 node packages/mirror-media-next/server.js &

# Exit immediately when one of the background processes terminate.
wait -n
