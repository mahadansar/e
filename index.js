const express = require("express");
const app = express();
const port = 3000;
const mails = require("./mails");
const mailinglist = require("./mailinglist");

const nodemailer = require("nodemailer");

async function sendEmails() {
  let myEmails = 0;
  const smtp = {
    host: mails.emails[myEmails].host,
    port: mails.emails[myEmails].port,
    user: mails.emails[myEmails].user,
    pass: mails.emails[myEmails].pass,
  };

  let transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  let subject = "Hello";
  let text = "message";
  let html = "html tags";

  for (let x in mailinglist.emails) {
    let response = await mail(
      transporter,
      smtp.host,
      mailinglist.emails[x],
      subject,
      text,
      html
    );

    if (response) {
    } else {
      myEmails = +1;
      smtp.host = mails.emails[myEmails].host;
      smtp.port = mails.emails[myEmails].port;
      smtp.user = mails.emails[myEmails].user;
      smtp.pass = mails.emails[myEmails].pass;

      transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });
    }
  }
}

sendEmails();

async function mail(transporter, from, to, subject, text, html) {
  let info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  return info;
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
