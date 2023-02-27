FROM envoyproxy/envoy:v1.22.7

RUN apt-get update && \
    apt-get install gettext -y

COPY envoy.yaml /tmp/envoy.yaml
COPY envoy-entrypoint.sh /

RUN chmod 500 /envoy-entrypoint.sh

ENTRYPOINT ["/envoy-entrypoint.sh"]
