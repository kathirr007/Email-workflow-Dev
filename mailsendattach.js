//  save file as  mailsendattch.js
var nodemailer = require('nodemailer');
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var fs = require('fs');
http.createServer(function (req, res) {
    console.log(req.url)
    if (req.url === "/") {
        fs.readFile("./public/mailsendattch.html", "UTF-8", function (err, html) {
            res.writeHead(200, { "Content-type": "text/html" });
            res.end(html);
        });
    }
    if (req.method === "POST") {
        var data = "";
        req.on("data", function (chunk) {
            data += chunk;
        });
        req.on("end", function (chunk) {
            var q = querystring.parse(data);
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
            });
            var mailOptions = {
                from: 'kathirr007@gmail.com',     // sender's gmail
                to: q.demail,                 // data coming from form
                subject: q.dsub,              // data coming from form
                text: q.dmsg,                 // data coming from form
                attachments: [{               // file on disk as an attachment
                    filename: q.dfile,        // name of the file attach
                    path: q.dfile             
                }]
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.end("Mail sent successefully");
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
}).listen(3000);