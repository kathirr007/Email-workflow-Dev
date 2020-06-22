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
    /* auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'kathirr007@gmail.com',
            clientId: '374024780934-uad11adl7jai1tbdg1if3o9ojkrcnc9g.apps.googleusercontent.com',
            clientSecret: 'ZYq8WFtlCTTXGTeKdQ26PVc8',
            refreshToken: '1/ga4TJEHaMUypgYHzZPiSNpE91JRHb-aUi--eDyeRr8M'
        })
    }, */
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
                    dest + 'emails/test/test.html',
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

