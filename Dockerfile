# tovV2/tov-backend/Dockerfile

### STAGE 1: build ###
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Instala deps (incluyendo devDependencies)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copia el esquema de Prisma y genera el cliente
COPY prisma ./prisma
RUN npx prisma generate

# 3) Copia el resto del código y compila
COPY . .
RUN npm run build

### STAGE 2: producción ###
FROM node:18-alpine AS runner
WORKDIR /app

# 4) Instala solo prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 5) Copia el build y el cliente de Prisma generado
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

# 6) Arranca la app
CMD ["node", "dist/main.js"]
