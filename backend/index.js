import express, { json } from "express";
import { mailTransporter, mailDetails } from "./mailer.js";
import cors from "cors";

const app = express();

app.use(json());
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

    payload.recipients.forEach((recipient) => {
      mailTransporter.sendMail(
        { ...mailDetails, to: recipient, subject: payload.subject, html: body },
        function (err, data) {
          if (err) {
            console.log("Error sending email to", recipient, ":", err);
          }
        }
      );
    });

    res.json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
