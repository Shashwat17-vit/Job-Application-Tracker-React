FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace setup
COPY package.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install all workspace dependencies
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY client/ ./client/

EXPOSE 5173

# --host is needed so the dev server is accessible from outside the container
CMD ["npm", "run", "dev:client", "--", "--host"]
