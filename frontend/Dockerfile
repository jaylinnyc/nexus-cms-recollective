# Stage 1: Build the Vue app
FROM node:18 AS build
WORKDIR /app

# Set yarn config first
RUN yarn config set network-timeout 300000 -g && \
    yarn config set registry https://registry.npmmirror.com

# Copy package files
COPY package.json ./

# Install with retries
RUN for i in {1..5}; do \
      yarn install && break || \
      if [ $i -eq 5 ]; then exit 1; else sleep 30; fi; \
    done

COPY . .
RUN yarn build


# Stage 2: Serve with Nginx
FROM nginx:alpine

# override default nginx config so SPA refresh works
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the entrypoint script and a configuration template file
# The template (config.template.js) should include placeholders (e.g., ${API_URL})
COPY entrypoint.sh /entrypoint.sh
COPY config.template.js /usr/share/nginx/html/config.template.js

# Make sure the entrypoint script is executable
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Use the entrypoint script to generate a config file from the template at runtime
ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
