# Assignment 02 - Readme

## Methodology

On Mac, using Terminal

### Setup

- Updated Homebrew system
- Installed nodejs via Homebrew
- Installed mongodb via Homebrew
- Ran homebrew cleanup
- Created application folder with structure (public and root)

### Mongodb setup

In one open terminal window;
- Created a folder in project `data` to hold the mongodb path, output
- Ran command to hard link the database path:

> % mongod --dbpath {directory}/data --port 27017

### Running the mongdob, nodejs

Opened a new terminal window, ran the mongodb;

> % mongosh mongodb://localhost:27017

This connects and I create a simple database, and insert a record, see: `screenshots/mongodb-running.png`

Opened a third terminal window, run the nodejs app.js

See: `node-app-running.png` and `browser-01.png`


### Screenshots

`/mongodb-running.png` - This is a screenshot of mongodb running on the terminal with a simple insert test of a movie.

`JS-App-Walkthrough.gif` - Animation