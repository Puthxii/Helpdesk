const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
require("dotenv").config();

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

exports.sendEmailNotification = functions.firestore.document("ticket/{docId}")
  .onCreate((snap, ctx) => {
    const data = snap.data();
    const id = snap.id;
    const authData = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
    if (data.status != "Draft") {
      authData.sendMail({
        from: "teenaputh12@gmail.com",
        to: `${data.email}`,
        subject: "Helpdesk - Ticket",
        text: `${id}`,
        html: `Your ticket reported was successful. You can tracking your ticket by this link https://walaihelpdesk-25638.web.app/detail/${id}`,
      }).then((res) => console.log("successfully sent that mail"))
        .catch((err) => console.log(err));
    }
  });

exports.sendUpdate = functions.firestore.document("ticket/{docId}")
  .onUpdate((change, ctx) => {
    const newValue = change.after.data();
    const id = change.after.id;
    const authData = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });
    if (newValue.status != "Draft") {
      authData.sendMail({
        from: "teenaputh12@gmail.com",
        to: `${newValue.email}`,
        subject: "Helpdesk - Ticket",
        text: `${id}`,
        html: `Your ticket reported was successful. You can tracking your ticket by this link https://walaihelpdesk-25638.web.app/detail/${id}`,
      }).then((res) => console.log("successfully sent that mail"))
        .catch((err) => console.log(err));
    }
  });