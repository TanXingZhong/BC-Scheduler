# Backend Dockerfile
FROM node:22.12.0

# Set working directory
WORKDIR /app

# Set the time zone to Singapore
ENV TZ=Asia/Singapore
ENV NODE_ENV=development
ENV ACCESS_TOKEN_SECRET=b62884505304b047c8523a4a41b41d7ee4a302cfbeb0ec937d81b6af172151b680f1c44726df591aa6716720b39c0eaef1284012c9471fbc0fb31423e477c252
ENV REFRESH_TOKEN_SECRET=e72516d614eb5edf86c0178fda62861aa9dd7a4aa8f80bbb0be59a20b5f372eb31f3dc8cc2ad4028ade6b8c5d8d40aa5123fe85e8c5bdc828905396bb85828f0
ENV DB_HOST=172.17.0.4
ENV DB_USER=root
ENV DB_PASS=example
ENV DB_DATABASE=my_database

# Install necessary build tools
RUN apt-get update && apt-get install -y python3 make g++

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8080

# Start backend
CMD ["npm", "start"]
