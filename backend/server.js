const express = require("express");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const dotenv = require('dotenv');

dotenv.config()

const app = express();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));

app.post('/api/email', (request, response)=>{
    const { sender, recipients, subject, content } = request.body;

    mg.messages.create(process.env.MAILGUN_DOMAIN, {
		from: `"GTalkie" ${sender}`,
        to: `${recipients}`,
        subject: `${subject}`,
        html: `${content}`,
	})
	.then(msg => {
		console.log(msg); // logs response data
        response.write("<h1>You have successfully subscribed!</h1>");
        response.end();
	})
	.catch(err => {
		console.log(err); // logs any error
		response.status(500).send('Error sending email.');
	});
});

const port = 4000;

app.listen(port, function(request, response){
    console.log(`server is running on port ${port}`)
});