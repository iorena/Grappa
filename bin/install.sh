sudo -#!/bin/sh

# Bash script which is (theoretically as there was no time to see if
# this works) run on sudo permissions to download
# all the required files and doing the required configuration
# for the Ubuntu 14.04 Virtual-Machine server to work.

# Update all the dependencies
apt-get update
# Install git
apt-get install git
# Install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# Loads the nvm into this terminal-session, no need to restart it
# TODO: might not work
source ~/.profile
# Install Node.js 5.9.1
nvm install 5.9.1
# Install nginx
apt-get install nginx
# install process manager 2 for running Node-process as daemon
npm install pm2 -g
# Install PostgresSQL
apt-get install postgresql postgresql-contrib
# Database stuff I'm not so sure about
createuser -P grappadbuser
createdb grappadb
# Database is now running on port 5432?
# Create tables
npm run db:prod create
# Create the actual server files
mkdir -p /var/www/grappa.cs.helsinki.fi
cd /var/www/grappa.cs.helsinki.fi
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-backend.git
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-front.git
cd grappa-backend
npm install
cd ../grappa-front
npm install
# Configure nginx
cd /etc/nginx/sites-available
cp /var/www/grappa.cs.helsinki.fi/bin/grappa.cs.helsinki.fi.conf
ln -s /etc/nginx/sites-available/grappa.cs.helsinki.fi.conf /etc/nginx/sites-enabled/grappa.cs.helsinki.fi.conf
service nginx restart
# Configuration information read from .env file that is excluded from
# this git repository

# So all that is left is starting up the pm2 and spinning up some servers
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-backend/app.js -n grappa-backend -i 2
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-front/index.js -n grappa-front -i 1
