# ==========================
# Stage 1: Build
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src 
COPY Shared ./Shared
COPY tsconfig.json ./

RUN npm run build

# ==========================
# Stage 2: Production image
# ==========================

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/@types ./src/@types
COPY --from=build /app/src/config ./src/config
COPY --from=build /app/src/utils ./src/utils
COPY --from=build /app/Shared ./Shared

EXPOSE 8000

RUN npm install pm2 -g

CMD [ "pm2-runtime","dist/server.js", "--name", "sponsorflow"]