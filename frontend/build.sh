#!/bin/bash

PROTO_DEST=./proto

mkdir -p ${PROTO_DEST}

# TypeScript code generation
yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=${PROTO_DEST} \
    -I ../proto \
    ../proto/*.proto
