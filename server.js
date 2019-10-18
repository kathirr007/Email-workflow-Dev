var express = require('express');
var nodemailer = require("nodemailer");
var app = express();
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: ""
    }
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'kathirr007@gmail.com',
        clientId: '374024780934-uad11adl7jai1tbdg1if3o9ojkrcnc9g.apps.googleusercontent.com',
        clientSecret: '2SHHBPYE81fS7kEEvD_xDMM1',
        refreshToken: '1/2W0GiRY6qIj3VTXGWlEHhpG3XY2pcGbG8IJDk97WwOQ',
        accessToken: 'ya29.Il-bB5mPYoqAtVY-hv4KKULNZnewcb8jB7aqTXLrLGIPB6W8pElCGFoquMi-RiTe3cBj0ry1LYB3R3Skiok74PNtR70vbjriOz-2CjKJgpQ6yspNiljtu18i5K0L2dvh7g'
        /* xoauth2: xoauth2.createXOAuth2Generator({
            user: 'kathirr007@gmail.com',
            clientId: '374024780934-uad11adl7jai1tbdg1if3o9ojkrcnc9g.apps.googleusercontent.com',
            clientSecret: '2SHHBPYE81fS7kEEvD_xDMM1',
            refreshToken: '1/2W0GiRY6qIj3VTXGWlEHhpG3XY2pcGbG8IJDk97WwOQ'
        }) */
    }
})
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});
app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
        subject: req.query.subject,
        text: req.query.text,
        html: req.query.htmlContent
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent...");
            res.end("sent");
        }
    });
});

/*--------------------Routing Over----------------------------*/

app.listen(3000, function () {
    console.log("Express Started on Port 3000");
});