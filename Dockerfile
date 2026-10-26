FROM oven/bun:1.2.23
WORKDIR /app
COPY server.ts ./server.ts
COPY public ./public
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "server.ts"]
