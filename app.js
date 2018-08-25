const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: req.body.host || "smtp.gmail.com",
    port: req.body.port || 465,
    secure: req.body.secure !== undefined ? req.body.secure : true, // true for 465, false for other ports
    auth: {
      user: req.body.user,
      pass: req.body.password
    }
  });

  const mailOptions = {
    from: req.body.user,
    to: req.body.receiver,
    subject: req.body.subject,
    html: req.body.body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(JSON.stringify({
        type: 'error',
        info: error
      }));
      return;
    }
    res.send(JSON.stringify({
      type: 'success',
      info: info
    }));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("READY");
});
