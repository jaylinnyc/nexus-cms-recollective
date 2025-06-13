FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install --verbose
COPY . .
COPY start.sh .
RUN chmod +x start.sh
CMD ["./start.sh"]