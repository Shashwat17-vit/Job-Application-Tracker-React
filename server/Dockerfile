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
COPY server/ ./server/

# Generate Prisma client
RUN cd server && npx prisma generate

EXPOSE 5000

# Run dev server with hot reload
CMD ["npm", "run", "dev:server"]
