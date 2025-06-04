const fs = require('fs');
const path = './data/no_reconocidas.json';

// Lista de números autorizados para registrar preguntas no reconocidas
const numerosAutorizados = [
  "573045874931@c.us",
  "573148859955@c.us",
  "573153863179@c.us"
];

function registrarPreguntaNoReconocida(numero, mensaje) {
  // Solo registrar si el número está autorizado
  if (!numerosAutorizados.includes(numero)) {
    console.log(`🚫 No se registró pregunta de ${numero} (no autorizado)`);
    return;
  }

  const fecha = new Date().toISOString();
  let datos = [];

  if (fs.existsSync(path)) {
    const contenido = fs.readFileSync(path, 'utf8');
    datos = contenido ? JSON.parse(contenido) : [];
  }

  datos.push({ numero, mensaje, fecha });
  fs.writeFileSync(path, JSON.stringify(datos, null, 2), 'utf8');
  console.log(`📝 Pregunta registrada de ${numero}`);
}

module.exports = { registrarPreguntaNoReconocida };
