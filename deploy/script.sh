#!/usr/bin/env bash
set -e
npm test
npm run lint
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo Deploying $CURRENT_BRANCH
git push heroku $CURRENT_BRANCH:master