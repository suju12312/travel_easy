var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aaradhya25903@gmail.com',
    pass: 'fzou cynj mhfc yvqd',
  }
});

var mailOptions = {
  from: 'aaradhya25903@gmail.com',
  to: 'aryangaur380@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'This is the sample mail!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});