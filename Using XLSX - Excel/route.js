const { sendEmails, createAndPopulateExcelWorkbook } = require('./controller');
const express = require('express');
const route = express.Router();

route.post('/sendingEmail', sendEmails);
route.post('/creatingExcel', createAndPopulateExcelWorkbook);

module.exports = route;
