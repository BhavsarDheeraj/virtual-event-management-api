const nodemailer = require('nodemailer');


async function sendRegistrationSuccessMail(recipientEmail, eventDetails) {
    const gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: recipientEmail,
        subject: `Registration successful for ${eventDetails.name}`,
        text: `Hello! You have successfully registered for the event "${eventDetails.name}".`,
        html: `<h1>Hello!</h1><p>You have successfully registered for the event "${eventDetails.name}".</p>`
    };

    try {
        const info = await gmailTransporter.sendMail(mailOptions);
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendRegistrationSuccessMail
}