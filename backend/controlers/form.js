const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
    const {email, name, message} = req.body;
    console.log(req.body);
    const emailData = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        cc:'',
        subject: `Contact-Form - ${process.env.APP_NAME}`,
        text:`Email received from contact form \n Sender Name : ${name} \n sender Email : ${email} \n Sender Message : ${message}`,
        html:`
            <h4>Email received from contact form</h4>
            <p>Sender Name : ${name}</p>
            <p>sender Email : ${email}</p>
            <p>Sender Message : ${message}</p>
            <hr/>
            <p>This email may contain sensitive information</p>
        `
    }
    sgMail.send(emailData)
    .then(send => {
        res.json({
            success: true
        });
    } )
      .catch((error) => {
        res.json({
            success: false
        });
      });
}

exports.contactBlogAuthorForm = (req, res) => {
    const {authorEmail, email, name, message} = req.body;
    let mailList = [authorEmail, process.env.EMAIL_TO]
    const emailData = {
        to: mailList,
        from: 'shehanudeesha@gmail.com',
        cc:'',
        subject: `Someone message from ${process.env.APP_NAME}`,
        text:`Email received from contact form \n Name : ${name} \n Email : ${email} \n Message : ${message}`,
        html:`
            <h4>Email received from contact form</h4>
            <p>Name : ${name}</p>
            <p>Email : ${email}</p>
            <p> Message : ${message}</p>
            <hr/>
            <p>This email may contain sensitive information</p>
        `
    }
    sgMail.send(emailData)
    .then(send => {
        res.json({
            success: true
        });
    } ) 
      .catch((error) => {
        res.json({
            success: false
        });
      });
}