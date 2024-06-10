const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host : process.env.HOST,
            port: process.env.PORT,
            service: process.env.SMPT_SERVICE, // SMTP service (e.g., 'gmail')
            auth: {
                user: process.env.SMPT_MAIL, // Your email address
                pass: process.env.SMPT_PASSWORD, // Your email password
            },
            logger: true, // Enable logging to console
            debug: true // Enable debugging output
        });

        // Verify connection configuration
        await transporter.verify();
        console.log('Server is ready to take our messages');

        // Setup email data
        const mailOptions = {
            from: process.env.SMPT_MAIL, // Sender address
            to: options.email, // List of receivers
            subject: options.subject, // Subject line
            text: options.message, // Plain text body
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
