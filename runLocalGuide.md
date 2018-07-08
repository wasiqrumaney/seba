# Install and run Guides

## First installation, locally

1. Choose the right branch to pull from. This should be master, unless the other person you are working with (for frontend / backend) is developing on something that you need to wait on.
2. Git clone (pull if after first time)
3. Open console and navigate to /backend. run "npm install" run "npm start"
4. (one time locally). Update your mongodb driver to one compatible with mLab "npm install mongodb"
5. Connect Mongodb to the remote database (on mLab): mongod --dbpath database
6. Open another console tab and navigate to /frontend. run "npm install", run "npm start"
7. Navigate to localhost:8000/index.js, find the index page.

Make sure to commit often, and push to the branch you pulled from when you have error-free code

## Normal development
1. Use Terminal/Console, navigate to the project folder
2. in /backend run npm update, then npm start
3. in /frontend run npm run build, then npm start
(2 and 3 require different terminal tabs/windows; use CTRL + SHIFT + T)
Ignore any errors about browser opening. Just navigate to localhost:8000 in whatever browser you are using

Err case  1: Empty page
- check in Inspect/browser console if network requests are being sent (indicates project page was correctly reached and it running but something is wrong with the application code itself)
Err case  2: only "LOADING" appears
- there is an error in the code which is fatal
- read console logs from "npm start" of frontend
- it can also be that a HTTP request, IE. GET to Listings/backend caused this state

**Time saving information:**
npm install is only for the first time, after that you can use npm update.

# Technology Specific Help

## mLab
### How do I connect to our remote mLab instance?:
To connect to mLab you need firstly a mongo shell recent version (major version 3. or above)
- make sure mongod is running

Connect to our database as follows:  mongo ds247670.mlab.com:47670/seba -u <USERHERE> -p <PASSWORDHERE>
(User/password is available on our whatsapp.)

then you should be by default in "seba" database. you can type "show collections" to see the mongo collections we have.

- you can for example write db.Listings.find()
- that returns:

{ "_id" : ObjectId("5b156385fb6fc02bcb8d9509"), "title" : "River based storage solution", "price" : 12.5, "owner" : 3, "address" : { "formatted_address" : "Eisbachwelle, Germany", "location" : { "lat" : 48.1438886, "lng" : 11.5872225 } }, "description" : "Wow, Great Trees here" }
{ "_id" : ObjectId("5b156372fb6fc02bcb8d94e0"), "title" : "24 hour available central storage location", "price" : 10, "owner" : 2, "address" : { "formatted_address" : "277 Bedford Ave, Brooklyn, NY 11211, USA", "location" : { "lat" : 40.7142205, "lng" : -73.9612903 } }, "description" : "Amazing Location" }

so you can check the contents, edit them...

## Which IDE do we use?
Right now only Webstorm

## What are the teams / aims?
### Frontend Team
Jonathan & Ghania - developing React components to fit into our application. Components can be recreated nicely, ideal for Single Page Applications

### Backend Team
Wasiq & James - developing backend, managing database, offering API to frontend team