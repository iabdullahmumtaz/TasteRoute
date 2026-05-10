FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:5002/api
ARG VITE_SOCKET_URL=http://localhost:5002
ENV VITE_API_URL=$VITE_API_URL VITE_SOCKET_URL=$VITE_SOCKET_URL
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server{listen 80;root /usr/share/nginx/html;index index.html;location /{try_files $uri /index.html;}}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
