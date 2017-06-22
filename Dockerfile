FROM node:8.0.0

# Setup
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# Update
RUN apt-get update

RUN npm install

RUN apt-get install -y nginx
RUN apt-get install -y pdftk

# RUN cp .dev-env .env

EXPOSE 8008 8000

CMD ["npm", "start"]
