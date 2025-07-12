require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function start() {
  const queue = 'mail_queue';
    const conn = await amqp.connect(process.env.RABBITMQ_URL);// render'a yüklenecekse burası değişebilir
  const ch = await conn.createChannel();
  await ch.assertQueue(queue, { durable: true });

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      const { email, resetLink } = JSON.parse(msg.content.toString());
      console.log(`📧 E-posta gönderiliyor: ${email}`);

      // Nodemailer yapılandırması
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // HTML Şablon
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Şifre Sıfırlama - İzleCine</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    padding: 30px;
                    color: #333;
                }
                .container {
                    background-color: white;
                    border-radius: 8px;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #91249d;
                    text-align: center;
                }
                .button {
                    display: block;
                    width: fit-content;
                    margin: 20px auto;
                    background-color: #91249d;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: bold;
                }
                .warning {
                    font-size: 14px;
                    background-color: #fff3cd;
                    border: 1px solid #ffeeba;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Şifre Sıfırlama Talebi</h1>
                <p>Merhaba, İzleCine hesabınız için şifre sıfırlama talebi aldık.</p>
                <p>Aşağıdaki butona tıklayarak şifrenizi sıfırlayabilirsiniz:</p>
                <a href="${resetLink}" class="button">Şifremi Sıfırla</a>
                <p>Buton çalışmıyorsa aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırın:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <div class="warning">
                    ⚠️ Bu bağlantı 1 saat içinde geçerliliğini yitirir.
                </div>
                <div class="footer">
                    Bu e-posta sistem tarafından otomatik gönderilmiştir. Lütfen yanıtlamayınız.
                </div>
            </div>
        </body>
        </html>
      `;

      // Mail gönder
      await transporter.sendMail({
        from: `"İzleCine" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 İzleCine - Şifre Sıfırlama Bağlantısı',
        html: htmlContent,
      });

      console.log(`✅ E-posta gönderildi: ${email}`);
      ch.ack(msg);
    }
  });

  console.log('📨 Mail Consumer çalışıyor...');
}

start();
