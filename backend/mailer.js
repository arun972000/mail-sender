import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

export const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // e.g., smtp.gmail.com, smtp.office365.com
  port: process.env.MAIL_PORT, // or 465
  secure: true, // true for 465, false for other ports
  auth: {
      user: process.env.USER, // your email
      pass: process.env.MAIL_PASS, // your email password
  },
  tls: {
    ciphers: 'SSLv3'            // Optional: Some Outlook servers may require this
  }
});

// export const mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "raceautoindia@gmail.com",
//     pass: "htpampvppnrofdcx",
//   },
// });

export const mailDetails = {
  from: "enquiry@raceautoindia.com",
  to: "abc@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
  html: "hello",
  attachments: [{
    filename: 'thumbnail logo.png',
    path: 'asset/thumbnail logo.png',
    cid: 'unique@nodemailer.com' //same cid value as in the html img src
}]
};
