const amqplib = require('amqplib');

let channel;

async function connectRabbit() {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('forgot-password');
  console.log('🐰 RabbitMQ bağlantısı başarılı.');
}

function sendToQueue(data) {
  if (!channel) {
    throw new Error('RabbitMQ bağlantısı kurulmamış. connectRabbit() çağrılmalı.');
  }
  channel.sendToQueue('forgot-password', Buffer.from(JSON.stringify(data)), {
    persistent: true
  });
}

module.exports = {
  connectRabbit,
  sendToQueue
};
