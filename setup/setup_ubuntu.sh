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
ssh -L 9000:128.214.9.6:80 teekoivi@melkki.cs.helsinki.fi
# For testing database connection
psql -h localhost <db> <user>
# to log into the postgres
sudo -i -u postgres
# to connect to database
psql -d grappadb