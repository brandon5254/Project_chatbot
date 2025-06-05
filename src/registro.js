const fs = require('fs');
const path = './data/no_reconocidas.json';

const numerosAutorizados = [
  "573045874931@c.us",
  "573145586839@c.us",
  "573137825227@c.us"
];

function registrarPreguntaNoReconocida(numero, mensaje) {
  if (!numerosAutorizados.includes(numero)) {
    console.log(`🚫 No se registró pregunta de ${numero} (no autorizado)`);
    return;
  }

  const fecha = new Date().toISOString();
  let datos = [];

  try {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }

    if (fs.existsSync(path)) {
      const contenido = fs.readFileSync(path, 'utf8');
      datos = contenido ? JSON.parse(contenido) : [];
    }

    datos.push({ numero, mensaje, fecha });

    fs.writeFileSync(path, JSON.stringify(datos, null, 2), 'utf8');
    console.log(`📝 Pregunta registrada de ${numero}`);
  } catch (error) {
    console.error(`❌ Error al registrar pregunta: ${error.message}`);
  }
}

module.exports = { registrarPreguntaNoReconocida };
