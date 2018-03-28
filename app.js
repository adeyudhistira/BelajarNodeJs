var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var connection = require('./config/db');
 
var app = express();
 
connection.init();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
module.exports = app;