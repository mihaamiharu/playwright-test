# Start from the correct Playwright version
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Use the same directory GitHub Actions uses by default
WORKDIR /github/workspace

# Copy and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Copy the rest of the code
COPY . .