# Use the official Bun image based on Alpine for a lightweight container
FROM oven/bun:1.1.4-alpine AS base
WORKDIR /app

# Copy root workspace configurations and package files first to cache dependencies
COPY package.json bun.lock tsconfig.base.json biome.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/admin/package.json ./apps/admin/
COPY apps/web/package.json ./apps/web/

# Install dependencies using Bun with frozen lockfile
RUN bun install --frozen-lockfile

# Copy the source code of all packages and applications
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY apps/admin ./apps/admin
COPY apps/web ./apps/web

# Set environment to production to trigger proper build config
ENV NODE_ENV=production

# Build the shared package and the React apps (which outputs build files to dist/)
RUN bun run build

# --- Stage 1: API Runtime ---
FROM oven/bun:1.1.4-alpine AS api
WORKDIR /app
# Copy the built workspace from the builder stage
COPY --from=base /app /app
# Expose port 3000 for the Hono backend API
EXPOSE 3000
# Run database migrations to set up the SQLite database and start the server
CMD ["sh", "-c", "bun run --filter @article-platform/api db:migrate && bun run --filter @article-platform/api start"]

# --- Stage 2: Nginx Gateway (Production Runtime) ---
FROM nginx:1.25-alpine AS gateway
# Copy nginx config to the container
COPY nginx.conf /etc/nginx/nginx.conf
# Copy the built static assets from the builder stage
COPY --from=base /app/apps/admin/dist /usr/share/nginx/html/admin
COPY --from=base /app/apps/web/dist /usr/share/nginx/html/web
# Expose port 80 for public access
EXPOSE 80

