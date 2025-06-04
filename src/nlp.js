const natural = require('natural');
const TfIdf = natural.TfIdf; 
const tokenizer = new natural.WordTokenizer(); 
const stemmer = natural.PorterStemmer; 

/**
 * Aplicamos técnicas de PLN básicas sobre un texto: tokenización y stemming.
 * Esto normaliza el lenguaje y mejora la comparación semántica.
 
 @param {string} texto 
 @returns {string[]} 
 */
function preprocesarTexto(texto) {
  const tokens = tokenizer.tokenize(texto.toLowerCase()); // Convierte a minúsculas y separa en tokens
  const stems = tokens.map(token => stemmer.stem(token)); // Reduce cada token a su raíz
  return stems;
}

/**
 * Construye una instancia del modelo TF-IDF con preguntas preprocesadas del corpus.
 * 
 * @param {Array} corpus - Arreglo de objetos {pregunta, respuesta}
 * @returns {TfIdf} - Objeto TF-IDF entrenado con el corpus
 */
function crearBuscadorTFIDF(corpus) {
  const tfidf = new TfIdf();
  corpus.forEach(item => {
    const procesado = preprocesarTexto(item.pregunta).join(' '); // Preprocesa la pregunta
    tfidf.addDocument(procesado); // Agrega documento TF-IDF
  });
  return tfidf;
}

/**
 * Convierte una pregunta/documento en un vector numérico basado en su peso TF-IDF.
 * 
 * @param {TfIdf} tfidf - Modelo entrenado
 * @param {number} docIndex - Índice del documento a vectorizar
 * @param {string[]} vocabulario - Vocabulario global para alineación de vectores
 * @returns {number[]} - Vector numérico del documento
 */
function getTfidfVector(tfidf, docIndex, vocabulario) {
  const terms = tfidf.listTerms(docIndex);
  return vocabulario.map(term => {
    const termObj = terms.find(t => t.term === term);
    return termObj ? termObj.tfidf : 0; // Si el término existe, retorna su peso, sino 0
  });
}

/**
 * Calcula la similitud de coseno entre dos vectores numéricos.
 * Es la métrica principal para comparar el mensaje del usuario con el corpus.
 * 
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} - Valor de similitud entre 0 y 1
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0); // Producto punto
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0)); // Norma A
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0)); // Norma B
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

/**
 * Busca la mejor respuesta del corpus en función de la similitud semántica
 * entre el mensaje del usuario y las preguntas almacenadas.
 * 
 * @param {Array} corpus - Base de datos de preguntas y respuestas
 * @param {TfIdf} tfidf - Modelo TF-IDF ya inicializado
 * @param {string} mensajeUsuario - Mensaje recibido por el bot
 * @returns {string|null} - Respuesta más probable o mensaje por defecto
 */
function buscarRespuesta(corpus, tfidf, mensajeUsuario) {
  const entradaProcesada = preprocesarTexto(mensajeUsuario).join(' '); // Limpia entrada
  tfidf.addDocument(entradaProcesada); // Agrega como documento temporal

  // Crea vocabulario global con todos los términos
  const vocabSet = new Set();
  for (let i = 0; i < tfidf.documents.length; i++) {
    tfidf.listTerms(i).forEach(t => vocabSet.add(t.term));
  }
  const vocabulario = Array.from(vocabSet);

  // Vector del mensaje del usuario
  const userVec = getTfidfVector(tfidf, tfidf.documents.length - 1, vocabulario);

  let mejorSimilitud = 0;
  let mejorRespuesta = "Lo siento, no entendí tu pregunta.";

  // Compara contra cada pregunta del corpus
  for (let i = 0; i < corpus.length; i++) {
    const docVec = getTfidfVector(tfidf, i, vocabulario);
    const sim = cosineSimilarity(userVec, docVec);
    if (sim > mejorSimilitud) {
      mejorSimilitud = sim;
      mejorRespuesta = corpus[i].respuesta;
    }
  }

  tfidf.documents.pop(); // Elimina el documento temporal para evitar crecimiento del corpus
  return mejorSimilitud > 0.1 ? mejorRespuesta : null; // Umbral mínimo aceptable
}

// Exporta funciones principales
module.exports = {
  crearBuscadorTFIDF,
  buscarRespuesta
};
