import express, { json } from "express";
import { mailTransporter, mailDetails } from "./mailer.js";
import cors from "cors";
import dotenv from "dotenv"


dotenv.config();

const app = express();

app.use(json({ limit: "10mb" }));
app.use(
  cors({
    origin: "*",
  })
);
const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.json({ status: true, message: "Our node.js app works" });
});

const footer = `<p><img src="cid:unique@nodemailer.com"></p><p>RACE AUTO INDIA</p><p>+91 8072098352 / 9962110101</p><p>Mail:&nbsp;raceautoindia@gmail.com / info@raceautoindia.com&nbsp;</p><p>Website : www.raceautoindia.com</p>`;

const BATCH_SIZE = 10; // Number of emails to send in each batch
const DELAY_MS = 1000; // Delay between batches in milliseconds

const sendEmailsInBatches = async (recipients, subject, htmlContent) => {
  const emailStatuses = []; // Array to keep track of email statuses

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const promises = batch.map((recipient) => {
      return new Promise((resolve, reject) => {
        mailTransporter.sendMail(
          {
            ...mailDetails,
            to: recipient,
            subject: subject,
            html: htmlContent,
          },
          (err, data) => {
            const status = {
              email: recipient,
              status: 'success',
              message: 'Email sent successfully',
            };
            if (err) {
              status.status = 'failure';
              status.message = err.message;
              console.log("Error sending email to", recipient, ":", err);
              reject(err);
            } else {
              console.log("Email sent successfully to:", recipient);
              resolve(data);
            }
            emailStatuses.push(status); // Add status to the list
          }
        );
      });
    });

    try {
      await Promise.all(promises); // Wait for all emails in the batch to be sent
      console.log(`Batch ${i / BATCH_SIZE + 1} sent successfully`);
    } catch (error) {
      console.log("Error in batch", i / BATCH_SIZE + 1, ":", error);
      console.log(mailTransporter)
    }

    // Delay before sending the next batch
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  return emailStatuses; // Return the list of email statuses
};


app.post("/api/mailer", async (req, res) => {
  try {
    const payload = req.body;
    const body = `${payload.html}${footer}`;
    if (!payload || !payload.recipients || !Array.isArray(payload.recipients)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload or recipients array",
      });
    }

    const emailStatuses = await sendEmailsInBatches(
      payload.recipients,
      payload.subject,
      body
    );

    const successEmails = emailStatuses.filter(status => status.status === 'success');
    const failureEmails = emailStatuses.filter(status => status.status === 'failure');
    const delayEmails = emailStatuses.filter(status => status.status === 'delay');

    res.json({
      success: true,
      message: "Emails processed",
      results: {
        success: successEmails,
        failure: failureEmails,
        delay: delayEmails
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
