require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function start() {
  const queue = 'mail_queue';
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queue, { durable: true });

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      const { email, resetLink } = JSON.parse(msg.content.toString());
      console.log(`E-posta gönderiliyor: ${email}`);

      // E-posta gönderme
     const transporter = nodemailer.createTransport({
     service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


      await transporter.sendMail({
        from: 'Şifre Sıfırlama <seninemailin@gmail.com>',
        to: email,
        subject: 'Şifre sıfırlama bağlantısı',
        html: `<p>Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a></p>`,
      });

      ch.ack(msg);
    }
  });

  console.log('📨 Mail Consumer çalışıyor...');
}

start();
