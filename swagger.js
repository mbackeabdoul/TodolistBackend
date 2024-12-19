const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Todo List',
      version: '1.0.0',
      description: 'API de gestion de tâches pour une Todo List',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./server.js'], // fichiers contenant les annotations
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };