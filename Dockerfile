#----------------------------------------
# Build stage
#----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

# Copy metadata for all workspaces
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/

# Install full dependencies for build
RUN npm ci

# Copy source
COPY client ./client
COPY server ./server

# Frontend & backend build
RUN npm run build --workspace=client
RUN npm run build --workspace=server


#----------------------------------------
# Runtime stage
#----------------------------------------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV CLIENT_DIST_PATH=/app/client/dist

# Create non-root user (RUNTIME ONLY)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy metadata
COPY package.json package-lock.json ./
COPY server/package.json server/

# Ensure curl is available for HEALTHCHECK (early for better cache reuse)
RUN apk add --no-cache curl

# Install only server runtime dependencies
RUN npm ci --omit=dev --workspace=server
# Copy build artifacts
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Fix ownership
RUN chown -R appuser:appgroup /app
# Drop privileges
USER appuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsSL http://localhost:5001/api/hello || exit 1

CMD ["node", "server/dist/index.js"]
