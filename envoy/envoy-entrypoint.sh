#!/bin/sh

set -e

cat /tmp/envoy.yaml | envsubst \$BACKEND_HOST,\$BACKEND_PORT > /etc/envoy/envoy.yaml

/usr/local/bin/envoy -c /etc/envoy/envoy.yaml
