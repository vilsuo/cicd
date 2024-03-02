#!/bin/bash

echo "Build script"

npm run server:install
npm run client:install

# server serves client code
npm run server:tsc
npm run client:deploy

# run pending database migrations
NODE_ENV=production node server/build/src/util/umzug/index.js up
