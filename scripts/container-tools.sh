#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

compose() {
  docker --context "${CONTAINER_CONTEXT:-colima}" compose --env-file .docker.env "$@"
}

case "${1:-help}" in
  metadata)
    compose --profile metadata up -d --build metadata
    compose exec -T metadata npm install --package-lock-only --ignore-scripts --no-audit --no-fund
    compose cp metadata:/app/package-lock.json ./package-lock.json
    ;;
  tooling)
    compose --profile tools up -d --build tooling
    ;;
  watch)
    compose up --build --watch compiler api logging-worker
    ;;
  fixtures)
    compose exec -T tooling npm run fixtures:generate
    compose cp tooling:/app/src/modules/auth/persistence/demo-accounts.fixture.ts ./src/modules/auth/persistence/demo-accounts.fixture.ts
    ;;
  configure)
    if [ -e .env ]; then
      printf '%s\n' 'Existing host .env will not be overwritten.' >&2
      exit 1
    fi
    compose exec tooling npm run configure
    compose cp tooling:/app/.env ./.env
    chmod 600 .env
    ;;
  format)
    compose exec -T tooling npm run format
    for directory in src test scripts; do
      compose cp "tooling:/app/$directory/." "./$directory/"
    done
    for file in package.json tsconfig.json tsconfig.build.json tsconfig.test.json eslint.config.mjs compose.yaml; do
      compose cp "tooling:/app/$file" "./$file"
    done
    ;;
  check)
    compose exec -T tooling npm run check
    ;;
  test)
    compose exec -T tooling npm test
    ;;
  *)
    printf '%s\n' 'Usage: sh scripts/container-tools.sh metadata|tooling|watch|fixtures|configure|format|check|test'
    printf '%s\n' 'Run software steps only after the documented preflight and explicit approval.'
    ;;
esac
