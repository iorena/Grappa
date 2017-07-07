# Guide for developers to setup environment

Install git `apt-get install -y git`

Clone backend `git clone https://github.com/UniversityOfHelsinkiCS/grappa-backend.git`

Clone frontend `git clone https://github.com/UniversityOfHelsinkiCS/grappa-frontend.git`

## Install software
Install NVM to help with node version management
- `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash`

Reload it into current terminal session 
- `. ~/.bashrc`

Install Node 6.9.4
- `nvm install 6.9.4`

Install pdftk for manipulation of PDFs
- `sudo apt-get install -y pdftk`

OPTIONAL: install PostgreSQL, (you can just use SQLite instead)
- `sudo apt-get install -y postgresql postgresql-contrib`

## Setup the postgres database
- `sudo -i -u postgres`
- `createuser -P grappadbuser`
- `createdb grappadb`

You may want to recover a dump of a the database here. Automatic setup or offered dumps are WIP. 

- `exit`

## Starting

Final setup for backend:
- `cd grappa-backend`
- `cp .dev-env .env`
- `npm i`

Create sqlite database
- `npm run db init`

Start:
- `npm start`

Final setup for frontend:
- `cd ../grappa-front`
- `cp .dev-env .env`
- `npm i`

Start:
- `npm start`