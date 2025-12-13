# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/

RUN npm ci --workspaces

# Copy source
COPY client ./client
COPY server ./server

# Frontend & backend build
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# Remove dev dependencies
RUN npm prune --omit=dev

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV CLIENT_DIST_PATH=/app/client/dist

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./client/dist

USER app

EXPOSE 5001

CMD ["node", "server/dist/index.js"]
