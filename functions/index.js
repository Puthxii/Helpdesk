const functions = require("firebase-functions");
const admin=require('firebase-admin')

admin.initializeApp()
require('dotenv').config

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

// exports.sendEmailNotification=function.firestore.document('us')