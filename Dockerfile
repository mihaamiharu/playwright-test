# Start from the official Playwright image
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json .
COPY package-lock.json .

# Install all Node.js dependencies
RUN npm ci

# Copy the rest of your project code into the image
COPY . .