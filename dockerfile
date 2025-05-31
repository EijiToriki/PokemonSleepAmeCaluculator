FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install gh-pages --save-dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
