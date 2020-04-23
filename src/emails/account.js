const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to:email,
        from: 'jamesoneill997@gmail.com',
        subject: 'Thanks for joining',
        text: 'Welcome to the app, '+ name + '. Let me know how you get on!'
    })
}


const sendCancellationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'jamesoneill997@gmail.com',
        subject: 'Sorry to see you go',
        text: 'Hi '+name+', I notice that you have cancelled your account with us. You are tearing me apart'
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}


