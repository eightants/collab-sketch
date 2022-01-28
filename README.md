## Setup
Make sure you have Node.js and npm installed. 

1. Clone the repository to your local machine. 
2. In the root directory, run `npm install` or `npm i`
3. `cd client` to navigate to `/client/`, and run `npm i` again. 

## Developing

1. In `/server/app.js`, set `const uri` to be the MongoDB URI for local development. 
2. In `/server/`, run `npm start`
3. In `/client/constants.tsx`, comment out `DOMAIN = ""` and uncomment the other line so you are using your local server.
4. In `/client/` in another terminal window, run `npm start`