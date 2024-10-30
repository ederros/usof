const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});


const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"usof" <${process.env.MAIL}>`, 
        to,
        subject,
        text,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = { sendEmail };