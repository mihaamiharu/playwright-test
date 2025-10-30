# Start from the correct Playwright version
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set a separate working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci
