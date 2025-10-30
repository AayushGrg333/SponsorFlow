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

COPY --from=build /app/dist ./dist
COPY --from=build /app/Shared ./Shared  

RUN npm install pm2 -g

EXPOSE 8000

CMD ["pm2-runtime", "dist/src/server.js", "--name", "sponsorflow"]
