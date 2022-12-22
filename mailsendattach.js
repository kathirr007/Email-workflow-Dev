//  save file as  mailsendattch.js
var nodemailer = require('nodemailer');
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var fs = require('fs');
http
  .createServer(function (req, res) {
    console.log(req.url);
    if (req.url === '/') {
      fs.readFile('./public/mailsendattch.html', 'UTF-8', function (err, html) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(html);
      });
    }
    if (req.method === 'POST') {
      var data = '';
      req.on('data', function (chunk) {
        data += chunk;
      });
      req.on('end', function (chunk) {
        var q = querystring.parse(data);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN,
          },
        });
        var mailOptions = {
          from: 'kathirr007@gmail.com', // sender's gmail
          to: q.demail, // data coming from form
          subject: q.dsub, // data coming from form
          text: q.dmsg, // data coming from form
          attachments: [
            {
              // file on disk as an attachment
              filename: q.dfile, // name of the file attach
              path: q.dfile,
            },
          ],
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.end('Mail sent successefully');
            console.log('Email sent: ' + info.response);
          }
        });
      });
    }
  })
  .listen(3000);
