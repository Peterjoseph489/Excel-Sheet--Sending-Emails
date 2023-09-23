const nodemailer = require('nodemailer');
const fs = require('fs');
const xlsx = require('xlsx');
const emailSender = require('./email');



const sendEmails = async (req, res) => {
  try {
    // Read the list of graduates and their email addresses from an Excel file
    const graduatesList = [];

    const workbook = xlsx.readFile('./graduates.xlsx'); // Change the filename to your Excel file
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet

    const data = xlsx.utils.sheet_to_json(worksheet, { header: 'A' });

    data.forEach((row) => {
      if (row.FirstName && row.Email) {
        graduatesList.push({ firstName: row.FirstName, email: row.Email });
      }
    });

    const html = `Dear {{firstName}},
      Try to make yourself available on
      Time: 8am
      Venue: Jakunde-Lekki.`;

    const sentEmails = [];

    for (const graduate of graduatesList) {
      await emailSender({
        email: graduate.email,
        subject: 'Invitation',
        html: html.replace('{{firstName}}', graduate.firstName),
      });
      sentEmails.push(graduate.email);
    }

    if (sentEmails.length === graduatesList.length) {
      res.status(200).json({
        message: 'Emails sent successfully..!!!',
      });
    } else {
      res.status(400).json({
        message: 'Failed to send some emails',
        failedEmails: graduatesList.filter((graduate) => !sentEmails.includes(graduate.email)),
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = sendEmails;
