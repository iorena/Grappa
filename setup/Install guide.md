Guide to install grappa

as a root:
- `apt-get update`
- `mkdir -p /var/www/grappa.cs.helsinki.fi`

create user to run the service on 
- `sudo adduser grappauser`
- `sudo adduser grappauser sudo`

digital ocean wants this `sudo chmod -R g+rwx /var/www/grappa.cs.helsinki.fi`

other digital ocean settings:
- `locale-gen "fi_FI.UTF-8"`
- `dpkg-reconfigure locales`
- `LANG=fi_FI.UTF-8`

remember to setup split if you need it for digital ocean's server..

change user `sudo su grappauser`

you can't download stuff while in root folder `cd ..`

# installation of software
Nginx
`sudo apt-get install -y nginx`

Docker
- Install docker according to their guide, subject to change

Docker-compose
- Install docker-compose according to their guide, subject to change

# Setup docker containers
- `cd /var/www/grappa.cs.helsinki.fi`

Setup the docker-compose file.
- `nano docker-compose.yml`
## Example file

```
version: "2"
services:
  postgresqlcontainer:
    image: postgres:9.6.3
    ports:
      - "5432:5432"
    volumes:
      - ./postgres/database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: <database username>
      POSTGRES_PASSWORD: <database password>
      POSTGRES_DB: <database name>
  backend:
    image: jakousa/grappa-backend
    ports:
      - "8000:8000"
      - "8008:8008"
    environment:
      DB_URL: postgres://<database username>:<database password>@postgresqlcontainer:5421/<database name>
      NODE_ENV: production
      PORT: 8000
      WEBSOCKET_PORT: 8008
      APP_URL: http://grappa.cs.helsinki.fi
      TOKEN_SECRET: <token secret>
      EMAIL_USER: <email username>
      EMAIL_PASSWORD: <email password>
      EMAIL_HOST: <email hostname>
  frontend:
    image: jakousa/grappa-frontend
    ports:
      - "8080:8080"
```
# Configure nginx
Create file called "grappa.cs.helsinki.fi" in /etc/nginx/sites-available and copy the contents of grappa-backend/setup/grappa.cs.helsinki.fi from github.

Link sites-available and sites-enabled 
- `sudo ln -s /etc/nginx/sites-available/grappa.cs.helsinki.fi /etc/nginx/sites-enabled/grappa.cs.helsinki.fi`

Remove default to encourage nginx to run grappa.cs.helsinki.fi 
- `sudo rm /etc/nginx/sites-enabled/default`

Restart nginx 
- `sudo service nginx restart`

# Start the service

Start up the containers 
- `docker-compose up`

## Setup the database

Postgres container image sets up an empty database. Create tables MANUALLY here. Automatic is WIP. 
