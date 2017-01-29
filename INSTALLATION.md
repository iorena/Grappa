Installation


For Windows:

1. Download and install nvm for windows from :https://github.com/coreybutler/nvm-windows

2. Download and install a shell client, eg powershell https://git-scm.com/downloads

3. Open the shell, and type ```nvm install latest``` which updates nvm to the latest version and installs npm.

4. You need ```pdftk``` to process the pdf-files so you have to install it to PATH from their website [pdflabs](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)

For Linux:


1. In case build-essential package isnt installed, enter ```apt-get install build-essential libssl-dev``` on command prompt.

2. Enter ```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash``` on command prompt to install nvm.

   NOTE that v0.31.0 was the latest version of nvm as of making this file. Incase a newer version has been released update the path accordingly.

3. You can try ```nvm install latest``` but if it doesn't work look up the latest [Node.js](https://nodejs.org/en/) version and enter ```nvm install x.x.x``` and ```nvm use x.x.x``` where x.x.x is the desired Node version.

4. You need ```pdftk``` to process the pdf-files so you have to install it to PATH with ```sudo apt-get install -y pdftk```

Same for both OSes:

1. Download this repository if you haven't done so already and go to the root of it with terminal and enter ```npm install```

2. At this moment I should probably mention that this repository stores all of its important variables in a file called ```.env``` that is stored in the root of this folder. But since holding important data inside public repository is unpreferable that file has been left out and as a temporary fix you should rename the ```.dev-env``` file to ```.env```. It is the development version which isn't used anywhere else (Travis and Heroku store their own environment variables).

3. Then enter ```npm start``` to run the server

4. Since the database is created only after running the server for the first time you must hit ```ctrl+c``` to cancel the process and then create the database tables with ```npm run db init```
