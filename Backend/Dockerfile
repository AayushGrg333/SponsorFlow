# ==========================
# Stage 1: Build
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY Shared ./Shared

RUN npm run build

# ==========================
# Stage 2: Production
# ==========================
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

# Use absolute path to avoid Render ambiguity
COPY --from=build /app/dist /app/dist
COPY --from=build /app/Shared /app/Shared  

RUN npm install pm2 -g

EXPOSE 8000

# PM2 runs the server using absolute path
CMD ["pm2-runtime", "/app/dist/src/server.js", "--name", "sponsorflow"]
