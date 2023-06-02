import nodemailer from 'nodemailer';
import config from '@/config';

const emailDelivery = async ({ from, to, subject, content }) => {
  const transporter = nodemailer.createTransport({
    service: 'SendinBlue',
    auth: {
      user: config.SEND_IN_BLUE.EMAIL_USERNAME,
      pass: config.SEND_IN_BLUE.EMAIL_PASS
    }
  });

  const options = {
    from: from ?? `${config.SEND_IN_BLUE.EMAIL_FROM}`,
    to: to,
    subject: subject,
    html: content
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(new Error('Failed to send an Email'));
      } else {
        resolve(`Message Sent ${info.response}`);
      }
    });
  });
};

export default emailDelivery;
