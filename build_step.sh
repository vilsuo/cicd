#!/bin/bash

echo "Build script"

npm run server:install
npm run client:install

npm run client:deploy
