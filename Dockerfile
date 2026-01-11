# =========================
# Etapa 1: Builder
# =========================
FROM node:20-bullseye AS builder

WORKDIR /app

# Dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Código fuente
COPY . .

# Prisma
RUN npx prisma generate

# Build Next
RUN npm run build


# =========================
# Etapa 2: Runner
# =========================
FROM node:20-bullseye AS runner

WORKDIR /app

# Dependencias y config
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# App runtime
COPY --from=builder /app/.next ./.next
#COPY --from=builder /app/public ./public

# ⚠️ ESTO FALTABA (CRÍTICO)
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
