FROM node:lts AS frontend
WORKDIR /frontend
COPY ["/frontend/package.json", "/frontend/package-lock.json*", "./"]
RUN npm install
COPY frontend .
RUN npm run build

FROM node:14.15.0
WORKDIR /app
COPY ["backend/package.json", "backend/package-lock.json*", "./"]
RUN npm install
COPY --from=frontend /frontend/public ./public
COPY backend .
CMD ["npm", "start"]