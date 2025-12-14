# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/

RUN npm ci

# Copy source
COPY client ./client
COPY server ./server

# Frontend & backend build
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV CLIENT_DIST_PATH=/app/client/dist

COPY server/package.json server/
COPY package.json package-lock.json ./

# Install only server dependencies
RUN npm ci --omit=dev --workspace=server

# Copy build artifacts
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 5001

CMD ["node", "server/dist/index.js"]
