FROM node:8.0.0

# Setup
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# Update
RUN apt-get update

RUN apt-get install -y pdftk

# We have package called dotenv for building. Runtime envs are in docker-compose.
RUN echo "NODE_ENV=production" >> .env

RUN npm install pm2 -g

RUN npm i;

EXPOSE 8008 8000

CMD ["pm2-docker", "app.js"]
