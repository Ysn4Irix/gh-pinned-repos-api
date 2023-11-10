FROM node:18-alpine

WORKDIR /app
COPY ./package.json .
RUN npm install --location=global pnpm
RUN pnpm install
COPY . .
RUN pnpm prune --prod
EXPOSE 5000
CMD ["pnpm", "run", "start"]