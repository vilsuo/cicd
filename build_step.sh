#!/bin/bash

echo "Build script"

npm run server:install -- --omit=dev
npm run client:install -- --omit=dev

npm run client:deploy
