const sendEmails = require('./controller');
const express = require('express');
const route = express.Router();

route.post('/sendingEmail', sendEmails);

module.exports = route;
