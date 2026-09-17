# npm packages
FROM node:24-alpine AS builder

WORKDIR /app

# better-sqlite3 (used by @nuxt/content) needs to compile a native addon on Alpine/musl
RUN apk add --no-cache python3 make g++

COPY website/* /app
RUN npm install -g npm
RUN npm install
# npm blocks install/postinstall scripts of deps not explicitly allow-listed by default;
# better-sqlite3's native addon is never compiled without approving and rebuilding it.
RUN npm install-scripts approve --all && npm rebuild
ENV NUXT_PUBLIC_OPEN_FETCH_API_BASE_URL="/api/"
RUN npm run generate

# Serve stage
FROM nginx:alpine3.22-slim

# Copy built files from Vite's dist folder
COPY --from=builder /app/.output/public /usr/share/nginx/html
#COPY --from=builder /app/tranga-website/media /usr/share/nginx/html/media
COPY ./nginx /etc/nginx

EXPOSE 80
ENV API_URL=http://tranga-api:6531
CMD ["nginx", "-g", "daemon off;"]