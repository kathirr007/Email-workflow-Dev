require('dotenv').config()
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'kathirr007@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
    }
})

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

var datetime = new Date().today() + " @" + new Date().timeNow();

var
  devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),
  source = './',
  dest = devBuild ? 'builds/development/' : 'builds/production/';

var htmlPaths = [
                    dest + 'emails/one/template-one.html',
                    // dest + 'emails/two/template-two.html',
                    // dest + 'emails/three/template-three.html',
                    // dest + 'emails/four/template-four.html',
                    // dest + 'emails/five/template-five.html',
                    // dest + 'emails/six/template-six.html',
                    // dest + 'emails/seven/template-seven.html',
                    // dest + 'emails/eight/template-eight.html',
                    // dest + 'emails/nine/template-nine.html',
                    // dest + 'emails/ten/template-ten.html',
                    // dest + 'emails/eleven/template-eleven.html',
                    // dest + 'emails/twelve/template-twelve.html',
                    // dest + 'emails/thirteen/template-thirteen.html',
                    // dest + 'emails/fourteen/template-fourteen.html',
                    // dest + 'emails/fifteen/template-fifteen.html',
                    // dest + 'emails/sixteen/template-sixteen.html',
                    // dest + 'emails/17/template-17.html',
                    dest + 'emails/gmailIssues/clip-off-issue.html',
                 ],
    path,mailOptions;
    $(htmlPaths).each(function(i){
        path = htmlPaths[i];
        mailOptions = {
        from: 'Kathirr007 <kathirr007@gmail.com>',
        // to: `kathirr007@gmail.com, kathirr007@aol.com, kathirr007@hotmail.com, kathirr007@yahoo.com, kathirr007@yandex.com`,
        to: 'kathirr007@gmail.com, \
             kathirr007@aol.com, \
             kathirr007@hotmail.com, \
             kathirr007@yahoo.com, \
             kathirr007@yandex.com,',
        subject: `Test Mail ${i+1} on ${datetime}`,
        text: 'Hello World!!',
        html: {path:''+path+''}
        // html: {path:'https://ep-test.contentplace.io/webapp-theme/fo/mail-intern-info.html'}

      }
      transporter.sendMail(mailOptions, function (err, res) {
          if(err){
              console.log(err);
          } else {
              console.log(`Email ${i+1} has been sent Successfully`);
          }
      })
    });
    // for (i=0; i<htmlPaths.length; i++){
    // }

