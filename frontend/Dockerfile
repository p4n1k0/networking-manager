# ===== STAGE 1: Build =====
FROM node:22-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos essenciais primeiro (para cache eficiente)
COPY package*.json ./
RUN npm ci

# Copia o restante do código e faz o build
COPY . .
RUN npm run build

# ===== STAGE 2: Runtime =====
FROM node:22-alpine AS runner

WORKDIR /app

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Copia apenas o necessário do build anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta e roda o servidor
EXPOSE 3000
CMD ["npm", "start"]
