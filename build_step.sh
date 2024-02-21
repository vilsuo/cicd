#!/bin/bash

echo "Build script"

npm run server:install -- --omit=dev
npm run client:install

# server serves client code
npm run client:deploy

# run database migrations
NODE_ENV=production node server/src/util/umzug/index.js up
