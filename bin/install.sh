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
# ?????
# sudo chgrp -R grappauser /var/www/grappa.cs.helsinki.fi
# digital ocean wants this
sudo chmod -R g+rwx /var/www/grappa.cs.helsinki.fi
# also fix the language shit for digitalocean
locale-gen "fi_FI.UTF-8"
dpkg-reconfigure locales
LANG=fi_FI.UTF-8
# and remember to setup split if you are running on the shittiest digital ocean's server..
# open up a screen so you can have more terminals open. wee
screen
sudo su grappauser
# you can't download stuff while in root folder
cd ..

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
sudo apt-get install -y postgresql-9.3 postgresql-contrib
# install pdftk for manipulation of PDFs
sudo apt-get install -y pdftk

# Setup the database
sudo -i -u postgres
createuser -P grappadbuser
# >> enter password <<
createdb grappadb
exit
# installation of the source files
cd /var/www/grappa.cs.helsinki.fi
# you need sudo rights for most of this stuff but this way (root -> user -> root)
# we have access to our software like npm
sudo -s
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-backend.git
git clone https://github.com/ultra-hyper-storm-ohtuprojekti/grappa-front.git
cd grappa-backend
# here you should name the variables inside .env
mv .dev-env .env
# >>> rename .env variables <<<<
npm i
npm run db init
cd ../grappa-front
mv .dev-env .env
# >>> rename .env variables <<<
npm i
# if webpack doesn't build automatically you can trigger it yourself
npm run postinstall
# Configure nginx
sudo cp /var/www/grappa.cs.helsinki.fi/grappa-backend/bin/grappa.cs.helsinki.fi /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/grappa.cs.helsinki.fi /etc/nginx/sites-enabled/grappa.cs.helsinki.fi
sudo rm /etc/nginx/sites-enabled/default
# nginx can only be restarted with sudo permissions.. haa..
sudo service nginx restart
# Start up the server cluster
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-backend/app.js -n grappa-backend
pm2 start /var/www/grappa.cs.helsinki.fi/grappa-front/index.js -n grappa-front
# since we are on single core no need to have multiple processess like this
# pm2 start /var/www/grappa.cs.helsinki.fi/grappa-backend/app.js -n grappa-backend -i 2
# pm2 start /var/www/grappa.cs.helsinki.fi/grappa-front/index.js -n grappa-front -i 1
