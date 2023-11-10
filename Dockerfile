FROM node:20-alpine

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN npm install --location=global pnpm
RUN pnpm install
COPY . .
RUN pnpm prune --prod
EXPOSE 5000
CMD ["pnpm", "run", "start"]