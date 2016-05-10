# Create new user
sudo adduser <username>
# Add user to sudoers list
sudo adduser <username> sudo
# Login in as the new user
sudo su <username>
# Give the new user all permissions to home folder
sudo chgrp -R <username> /home/
# And stuff?
sudo chmod -R g+rwx <username> /home/
# Find out the IP-address from the terminal
ip route get 8.8.8.8 | awk '{print $NF; exit}'
# Or
ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
# This tunnels the connection to the server(128.214.9.6) through melkki
# as it is otherwise unaccessible
ssh -L 9000:128.214.9.6:80 teekoivi@melkki.cs.helsinki.fi
# For testing database connection
psql -h localhost <db> <user>


# random stuff

# give yourself all rights to a folder. i guess
sudo chmod 755 /var/www/
# give user ownership of folder's contents
sudo chown -R "YOUR_USER_ACCOUNT" /var/www.
# kraken.js
# start up a single server
pm2 start app.js -n appname
# start up a cluster of four
pm2 start app.js -n appname -i 4
# scale the cluster size
pm2 scale appname 2
# do stuf with a server of id 0
pm2 restart 0
pm2 stop 0
pm2 delete 0
# do stuff with all the processes
pm2 restart all
# logs
pm2 logs
# use this command to setup startup script (with user www)
pm2 startup ubuntu -u www
# after that setup your servers as you'd like and then use the follwing
# save stuff for next reboot
pm2 save
