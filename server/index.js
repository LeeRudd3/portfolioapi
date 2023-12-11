// server/index.js
const config = require('../env.config');
const bodyParser = require('body-parser');
const express = require("express");

const PORT = process.env.PORT || config.port;

//const path = require('path');
const app = express();

// Have Node serve the files for our built React app
//app.use(express.static(path.resolve(__dirname, '../client/build')));
const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const BandRouter =  require('./band/routes.config');
const VenueRouter = require('./venue/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
BandRouter.routesConfig(app);
VenueRouter.routesConfig(app);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  const randomText = "Thank You for Calling my API!";
  res.json({ message: randomText });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = {
};