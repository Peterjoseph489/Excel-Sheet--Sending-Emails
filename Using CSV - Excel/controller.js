const nodemailer = require('nodemailer');
const fs = require('fs');
const csv = require('csv-parser');
const emailSender = require('./email');



const sendEmails = async (req, res) => {
    try {
      // Read the list of graduates and their email addresses from a CSV file
      const graduatesList = [];
  
      fs.createReadStream('./graduates.csv - Sheet1.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Assuming your CSV has columns: FirstName, Email
          graduatesList.push({ firstName: row.FirstName, email: row.Email });
        })
        .on('end', async () => {
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
        });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};



module.exports = sendEmails;
