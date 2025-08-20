# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (from env)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
