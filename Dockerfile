# Etapa 1: Builder
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install --legacy-peer-deps

# Copiamos todo el proyecto
COPY . .

# Compilamos Next.js
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos package.json para producción
COPY --from=builder /app/package*.json ./

# Copiamos la carpeta .next y public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copiamos el next.config.ts (para Next.js 13+ TS)
COPY --from=builder /app/next.config.ts ./

# Instalamos solo dependencias de producción
RUN npm install --production --legacy-peer-deps

# Exponemos el puerto que Next.js usa
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
