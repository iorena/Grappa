#!/bin/bash

# Bash script in which is all the commands required to get the
# Nginx-Node -server on Ubuntu 14.04 to work.
# And yes you can't run it, you must do it line at the time because
# of all the user-creations

# as a root:
apt-get update
apt-get install -y git
mkdir -p /var/www/grappa.cs.helsinki.fi
sudo adduser grappauser
sudo adduser grappauser sudo
# unneeded???
sudo chgrp -R grappauser /var/www/grappa.cs.helsinki.fi
# digital ocean wants this
sudo chmod -R g+rwx /var/www/grappa.cs.helsinki.fi
# open up a screen so you can have more terminals open. wee
screen
sudo su grappauser

# installation of software
# install NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# reload it into current terminal session, no need to restart it
. ~/.bashrc
# install Node 5.9.1
nvm install 5.9.1
# install pm2 for running the servers
npm install pm2 -g
# install nginx to be run as web-proxy and better performance
sudo apt-get install -y nginx
# install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
# install pdftk for manipulation of PDFs
sudo apt-get install -y pdftk

# Setup the database
sudo -i -u postgres
createuser -P grappadbuser
createdb grappadb
exit
# installation of the source files
cd /var/www/grappa.cs.helsinki.fi
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-backend.git
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-front.git
cd grappa-backend
export NODE_ENV=production
npm install
npm run db init
cd ../grappa-front
export NODE_ENV=production
export API_URL=/backend
npm install
# Configure nginx
sudo cp /var/www/grappa.cs.helsinki.fi/grappa-backend/bin/grappa.cs.helsinki.fi.conf /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/grappa.cs.helsinki.fi.conf /etc/nginx/sites-enabled/grappa.cs.helsinki.fi.conf
sudo rm /etc/nginx/sites-enabled/default
# nginx can only be restarted with sudo permissions.. haa..
sudo service nginx restart
# Start up the server clusters
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-backend/app.js -n grappa-backend -i 2
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-front/index.js -n grappa-front -i 1
