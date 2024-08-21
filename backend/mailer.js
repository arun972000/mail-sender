import nodemailer from "nodemailer";



export const mailTransporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', // e.g., smtp.gmail.com, smtp.office365.com
  port: 465, // or 465
  secure: true, // true for 465, false for other ports
  auth: {
      user: 'enquiry@raceautoindia.com', // your email
      pass: 'Raceauto@0724', // your email password
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
