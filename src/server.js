const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.HTTP_PORT || 8080;        // set our port
const server = app.listen(port);

console.log(`Server listening on ${port}`);
const CommonDataController = require('./CommonDataController');

app.post('/common', CommonDataController.store);
app.post('/common/search', CommonDataController.findAll);

module.exports = server;