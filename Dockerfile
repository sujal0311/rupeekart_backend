# Use the official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json for dependency install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set environment variable (can be overridden at runtime)
ENV PORT=8080

# Expose the port your app runs on
EXPOSE 8080

# Start the app using npm script
CMD ["npm", "start"]
