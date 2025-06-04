# 🤖 MINDMATE Bot - Asistente Inteligente para Apoyo Clínico

Este proyecto implementa un **chatbot de atención académica y clínica** para la aplicación web **MindMate**, un sistema especializado en el seguimiento y apoyo psicológico de pacientes con esquizofrenia.

El bot utiliza **Procesamiento de Lenguaje Natural (PLN)** para responder consultas frecuentes sobre la plataforma, registrar preguntas no reconocidas y enviar mensajes automáticos vía **WhatsApp** usando la API no oficial de `whatsapp-web.js`.

---

## ¿Qué es MindMate?

**MindMate** es una aplicación web desarrollada en Angular que permite:
- Registrar y monitorear diagnósticos clínicos.
- Hacer seguimiento de síntomas psicológicos.
- Aplicar pruebas mentales personalizadas.
- Visualizar mapas de centros de atención.
- Acceder a chats seguros entre paciente y terapeuta.

---

##  Objetivos del Bot

- Automatizar respuestas a preguntas frecuentes sobre la plataforma.
- Permitir la interacción por WhatsApp con pacientes, terapeutas o usuarios interesados.
- Registrar preguntas no reconocidas para retroalimentación y mejora del corpus.
- Aplicar técnicas de PLN usando **TF-IDF + Cosine Similarity** para detección semántica.

---

## Estructura del Proyecto
project_chatbot/
├── data/
│ └── no_reconocidas.json # Preguntas no reconocidas registradas
├── media/
│ └── image.png # Imagen promocional para bienvenida
├── node_modules/ # Dependencias
├── session/ # Sesión persistente de WhatsApp
├── src/
│ ├── bot.js # Lógica del bot principal
│ ├── corpus.js # Preguntas y respuestas frecuentes
│ ├── bienvenida.js # Envío de imagen + bienvenida
│ ├── registro.js # Registro de preguntas no entendidas
│ └── nlp.js # Procesamiento de Lenguaje Natural (TF-IDF)
├── ejecutar.js # Archivo principal de ejecución
├── package.json
├── package-lock.json
├── requirements.txt # Paquetes necesarios
└── README.md



## Instala las dependencias
npm install

##  Inicia el bot
node ejecutar.js
o
npm start

Escanea el código QR que se muestra para vincular tu sesión de WhatsApp.

## Caracteristicas Tecnicas

| Componente   | Tecnología                                                              |
| ------------ | ----------------------------------------------------------------------- |
| Lenguaje     | Node.js (JavaScript)                                                    |
| Mensajería   | [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)       |
| PLN          | [natural](https://www.npmjs.com/package/natural)                        |
| Similaridad  | TF-IDF + Cosine Similarity                                              |
| Imagenes     | `image.png` enviada automáticamente al iniciar                          |
| Seguridad    | Filtrado de mensajes por número autorizado                              |
| Persistencia | Registro local de preguntas no reconocidas (`data/no_reconocidas.json`) |

## Procesamiento de Lenguaje Natural
El bot aplica TF-IDF (Term Frequency-Inverse Document Frequency) + Similitud de Coseno para comparar el mensaje del usuario con el corpus predefinido.

Pasos aplicados:

Tokenización y Stemming usando natural.

Conversión del texto a vectores TF-IDF.

Comparación semántica mediante similitud de coseno.

Elección de la respuesta más parecida.

Registro de preguntas no reconocidas si no supera el umbral de similitud.

## Funcionalidades Clave
Envío automático de mensaje de bienvenida con imagen.

Interacción basada en similitud semántica (PLN).

Soporte para múltiples usuarios autorizados.

Registro de consultas no reconocidas para análisis.

Modo persistente de sesión (no es necesario escanear QR cada vez).

Modularidad completa y fácil mantenimiento.

| Funcionalidad                            | Detalles                                                 |
| ---------------------------------------- | -------------------------------------------------------- |
| 🧾 Corpus base                           | +60 preguntas sobre MindMate + preguntas cotidianas      |
| 🤖 Respuestas automáticas                | PLN con TF-IDF y similitud de coseno                     |
| 🖼️ Bienvenida personalizada             | Imagen promocional + texto de presentación               |
| 🔒 Filtro de usuarios autorizados        | Solo se responde a números predefinidos                  |
| 🗂️ Registro de preguntas no reconocidas | Guardado en `data/no_reconocidas.json`                   |
| 🔁 Sesión persistente WhatsApp           | Vinculación automática sin escanear QR en cada ejecución |


## Vista previa


![alt text](media/image.png)


