#!/usr/bin/env bash

OUT_DIR="."
TS_OUT_DIR="."
IN_DIR="../proto"
PROTOC="node_modules/.bin/grpc_tools_node_protoc"
PROTOC_GEN_GRPC_WEB_PATH="node_modules/.bin/protoc-gen-grpc-web"

# generate grpc-web files & types
$PROTOC \
    -I=$IN_DIR \
    --plugin=protoc-gen-grpc-web=${PROTOC_GEN_GRPC_WEB_PATH} \
    --js_out=import_style=commonjs:$OUT_DIR \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$OUT_DIR \
    $IN_DIR/generated/*.proto
