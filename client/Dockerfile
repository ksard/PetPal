# Use an official Node.js runtime as the parent image
FROM node:21

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove existing node_modules directory if it exists
RUN rm -rf node_modules

# Install dependencies
RUN npm install --force
RUN npm install vite --force

# Ensure esbuild is installed correctly
RUN npm rebuild esbuild --force
RUN node -e "require('esbuild')"

# Verify vite installation
RUN npm list vite
RUN npx vite --version

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Define the command to run the app
CMD ["npm", "run", "dev"]
