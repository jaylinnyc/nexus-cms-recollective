# Use Node.js 18 as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if using yarn)
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy Strapi project files
COPY . .

# Install Strapi v4.25.15 specifically
RUN yarn add @strapi/strapi@4.25.15

# Build admin panel
RUN yarn build

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["yarn", "start"]