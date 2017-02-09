#!/usr/bin/env bash
if [[ -z "${NOT_LOCAL}" ]]; then
  echo 'On localhost, continue';
else
  git clone https://github.com/sthlmgames/snake-client.git
  cd snake-client
  npm install
  sed -ie 's/http:\/\/localhost:3000//g' src/components/utils/utils.js
  npm run build
  cd ../
  mkdir -p public
  cp -r snake-client/public/ ../public
fi