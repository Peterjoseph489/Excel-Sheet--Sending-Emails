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



// Initialize the Excel JavaScript API
// const Excel = require('@microsoft/office-js/excel');

// Function to create and populate an Excel workbook
const createAndPopulateExcelWorkbook = async (req, res) => {
  try {
    await Excel.run(async (context) => {
      const sheetName = "DataSheet";
      const sheet = context.workbook.worksheets.add(sheetName);

      // Define sample data
      const data = [
        ["Name", "Age", "City"],
        ["John", 30, "New York"],
        ["Alice", 25, "Los Angeles"],
        ["Bob", 35, "Chicago"],
        ["Eve", 28, "San Francisco"]
      ];

      // Populate data into the worksheet
      const range = sheet.getRange("A1:C5");
      range.values = data;

      // Format the header row
      const headerRow = range.getRow(0);
      headerRow.format.fill.color = "lightgray";
      headerRow.format.font.bold = true;

      // Save the workbook
      await context.sync();
      const savedExcel = await context.workbook.save();

      console.log("Excel workbook created, populated, and saved successfully.");

      if (!savedExcel) {
        res.status(400).json({
          message: "There is an Error somewhere, Please Try Again."
        })
      } else {
        res.status(201).json({
          message: "Excel workbook created, populated, and saved successfully."
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}






module.exports = { sendEmails, createAndPopulateExcelWorkbook };
