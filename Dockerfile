ARG NODE_IMAGE
FROM ${NODE_IMAGE} AS base
WORKDIR /app
RUN mkdir -p /app/dist /app/logs && chown -R node:node /app
USER node
ENV NPM_CONFIG_CACHE=/tmp/npm-cache \
    NPM_CONFIG_IGNORE_SCRIPTS=true

FROM base AS toolchain
COPY --chown=node:node package.json ./
COPY --chown=node:node scripts/idle.mjs ./scripts/idle.mjs
CMD ["node", "scripts/idle.mjs"]

FROM toolchain AS development
ENV NODE_ENV=development
COPY --chown=node:node package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY --chown=node:node . .
CMD ["node", "scripts/idle.mjs"]

FROM development AS verified
RUN npm run build

FROM base AS production-dependencies
ENV NODE_ENV=production
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=verified --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
CMD ["node", "--enable-source-maps", "dist/main.js"]
