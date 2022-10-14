import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "304227548d02e2",
    pass: "629b65871170a9",
  },
});

export const sendEmailToUser = (email, subject, text) => {
  const mailOptions = {
    from: "shareandcare@gmail.com",
    to: email,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
