# ---------- STAGE 1: Build frontend + backend ----------
FROM node:20 AS builder
WORKDIR /app

# Kopieer package.json & package-lock.json
COPY package*.json ./

# Installeer dependencies inclusief dev
RUN npm install

# Kopieer frontend en backend code
COPY client/ ./client
COPY server/ ./server
COPY shared/ ./shared

# Bouw frontend
RUN cd client && npm run build

# Bouw backend (TypeScript)
RUN npm run build:server

# ---------- STAGE 2: Run ----------
FROM node:20 AS runner
WORKDIR /app

# Kopieer alleen package.json & production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Kopieer build output
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/shared ./shared

# Stel poort in waarop server luistert
EXPOSE 3000

# Start de backend server
CMD ["node", "server/index.js"]
