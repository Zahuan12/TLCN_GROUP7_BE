# Use Node.js 18 LTS Alpine for smaller image size
FROM node:18-alpine

# Install system dependencies for native modules and Sharp
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    pkgconfig \
    libc6-compat

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Create uploads and logs directories
RUN mkdir -p uploads logs

# Copy application source code
COPY index.js ./
COPY src/ ./src/
COPY tools/ ./tools/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Change ownership of app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 5000

# Add health check to monitor container health
HEALTHCHECK --interval=30s --timeout=15s --start-period=20s --retries=3 \
    CMD node -e "const http=require('http');http.get('http://localhost:5000/health',(res)=>{process.exit(res.statusCode===200?0:1)}).on('error',()=>process.exit(1)).setTimeout(10000,()=>process.exit(1));"

# Start the application
CMD ["node", "index.js"]