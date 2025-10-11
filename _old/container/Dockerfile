FROM oven/bun:1.2.20-alpine

WORKDIR /app

# Install dependencies needed for compilation and networking (NO NPM!)
RUN apk add --no-cache git curl ca-certificates openssl musl-dev

# Update ca-certificates for SSL
RUN update-ca-certificates

# Set network environment
ENV NODE_ENV=production
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=0

# Copy compilation script
COPY compile-service.js .

EXPOSE 8080

CMD ["bun", "run", "compile-service.js"]