const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp(functions.config().firebase);
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
    authData.sendMail({
      from: "teenaputh12@gmail.com",
      to: `${data.email}`,
      subject: "Helpdesk - Ticket",
      text: `${id}`,
      html: `Your ticket reported was successful. You can tracking your ticket by this link http://localhost:4200/detail/${id}`,
    }).then((res) => console.log("successfully sent that mail"))
      .catch((err) => console.log(err));
  });

exports.notifyUser = functions.firestore.document("messages/{messageId}")
  .onCreate((event, ctx) => {
    const message = event.data();
    const userId = message.recipientId;
    const payload = {
      notification: {
        title: "New message!",
        body: `${message.senderId} sent you a new message`,
        icon: "https://firebasestorage.googleapis.com/v0/b/walaihelpdesk-25638.appspot.com/o/uploads%2F125247512_425636868432767_6394500177679922518_n%20(3).png?alt=media&token=2f271d65-6efc-4174-a635-363122733cc5",
      },
    };
    const db = admin.firestore();
    const userRef = db.collection("users").doc(userId);
    return userRef.get()
      .then((snapshot) => snapshot.data())
      .then((user) => {
        const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];
        if (!tokens.length) {
          throw new Error("User does not have any tokens!");
        }
        return admin.messaging().sendToDevice(tokens, payload);
      })
      .catch((err) => console.log(err));
  });