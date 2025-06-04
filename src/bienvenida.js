const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

async function enviarBienvenida(client, numero) {
  const rutaImagen = path.resolve('./media/image.png');

  if (!fs.existsSync(rutaImagen)) {
    console.warn("⚠️ Imagen promocional no encontrada:", rutaImagen);
    return;
  }

  try {
    const media = MessageMedia.fromFilePath(rutaImagen);
    const mensaje = `
 ¡Hola! Soy el asistente académico de MindMate.

 MindMate es tu aliado en la gestión y apoyo clínico para personas con esquizofrenia.

Nuestra plataforma incluye:
• 🩺 Módulo de diagnóstico psiquiátrico profesional  
• 📊 Seguimiento de síntomas en tiempo real  
• 🧪 Evaluaciones clínicas personalizadas  
• 🗺️ Mapa interactivo de centros de atención  
• 💬 Chat seguro con especialistas o asistentes virtuales

 ¿Por qué elegir MindMate?
 Mejora el control terapéutico  
 Facilita la comunicación paciente-terapeuta  
 Refuerza el bienestar emocional  
 Seguridad clínica con autenticación protegida



¿Te gustaría conocer más? Pregúntame sobre los módulos o servicios de MindMate. Estoy aquí para ayudarte. 🤝
    `.trim();

    await client.sendMessage(numero, media, { caption: mensaje });
    console.log(`✅ Bienvenida enviada a ${numero}`);
  } catch (err) {
    console.error(`❌ Error enviando la imagen a ${numero}:`, err.message);
  }
}

module.exports = { enviarBienvenida };
