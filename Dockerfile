# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, ensuring native modules are built for the container's architecture
RUN npm install --build-from-source

# Add node_modules/.bin to PATH for locally installed binaries
ENV PATH="./node_modules/.bin:$PATH"

# Copy the rest of your application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your server uses (e.g., 8080)
EXPOSE 8080

# Command to run your application
CMD ["npm", "run", "docker"]
