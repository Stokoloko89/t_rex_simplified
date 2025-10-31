FROM node:18-alpine AS builder

# Set up app root
WORKDIR /monorepo

# Install pnpm
RUN npm install -g pnpm

# Copy entire monorepo structure
COPY . .

# Install dependencies at monorepo root
RUN pnpm install --no-frozen-lockfile

# Build the buying-flow application from within monorepo
WORKDIR /monorepo/microfrontends/buying-flow
RUN pnpm run build

FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /monorepo/microfrontends/buying-flow/dist /usr/share/nginx/html

# Copy nginx configuration
COPY microfrontends/buying-flow/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
