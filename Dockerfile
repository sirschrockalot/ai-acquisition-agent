# Dockerfile for AI Acquisition Agent
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Verify files are copied
RUN ls -la

# Install ALL dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies (keep only production)
RUN npm prune --production

# Create necessary directories
RUN mkdir -p uploads/photos temp/extractions

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
