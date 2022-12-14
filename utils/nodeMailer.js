import nodemailer from 'nodemailer';

export const sendEmailToUser = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '304227548d02e2',
      pass: '629b65871170a9',
    },
  });

  const mailOptions = {
    from: 'shareandcare@gmail.com',
    to: email,
    subject,
    text,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
};
