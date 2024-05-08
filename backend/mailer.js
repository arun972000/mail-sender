import nodemailer from "nodemailer";



export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "raceautoindia@gmail.com",
    pass: "htpampvppnrofdcx",
  },
});

export const mailDetails = {
  from: "raceautoindia@gmail.com",
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
