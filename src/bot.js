const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const corpus = require('./corpus');
const { crearBuscadorTFIDF, buscarRespuesta } = require('./nlp');
const { registrarPreguntaNoReconocida } = require('./registro');
const { enviarBienvenida } = require('./bienvenida');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'bot-mindmate',
    dataPath: './session'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const tfidf = crearBuscadorTFIDF(corpus);

const numerosBienvenida = [
  "573045874931@c.us",
  "573148859955@c.us",
  "573153863179@c.us",
  "573145586839@c.us"
];

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
  console.log("✅ Conexión exitosa con WhatsApp.");
  console.log("🤖 Bot listo para recibir mensajes.");

  for (const numero of numerosBienvenida) {
    await enviarBienvenida(client, numero);
  }

  console.log("📨 Bienvenidas enviadas.");
});


client.on('message', async message => {
  const remitente = message.from;

  // Ignora mensajes de status o no deseados
  if (remitente === 'status@broadcast') return;

  // Solo responder y registrar si el remitente está autorizado
  const autorizado = numerosBienvenida.includes(remitente);

  if (!autorizado) {
    console.log(`🚫 Mensaje ignorado de ${remitente}`);
    return;
  }

  console.log(`📩 Mensaje recibido de ${remitente}: ${message.body}`);

  const respuesta = buscarRespuesta(corpus, tfidf, message.body);

  if (respuesta) {
    await client.sendMessage(remitente, respuesta);
    console.log(`✅ Respuesta enviada: ${respuesta}`);
  } else {
    registrarPreguntaNoReconocida(remitente, message.body);
    const mensajeGenerico = "Lo siento, no entendí tu pregunta. ¿Podrías reformularla?";
    await client.sendMessage(remitente, mensajeGenerico);
    console.log("⚠️ Pregunta no reconocida registrada.");
  }
});


module.exports = { client };
