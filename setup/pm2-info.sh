# start up a single server
pm2 start app.js -n grappa-backend
# start up a cluster of four
pm2 start app.js -n appname -i 4
# start up a cluster of max instances by cpu cores
pm2 start app.js -n grappa-backend -i max
# start server with name and npm start
pm2 start -n grappa-backend npm -- start
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
