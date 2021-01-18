const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
admin.initializeApp()
require('dotenv').config()

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env

exports.sendEmailNotification = functions.firestore.document('ticket/{docId}')
    .onCreate((snap, ctx) => {
        const data = snap.data()
        let authData = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: SENDER_EMAIL,
                pass: SENDER_PASSWORD
            }
        })
        authData.sendMail({
            from: 'teenaputh12@gmail.com',
            to: `${data.email}`,
            subject: 'Your submission Ticket',
            text: `${data.email}`,
            html: `${data.email}`,
        }).then(res => console.log('successfully sent that mail')).catch(err => console.log(err))
    })