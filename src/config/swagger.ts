import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Temperature Converter API',
      version: '1.0.0',
      description: 'A simple REST API for converting temperatures between Celsius, Fahrenheit, and Kelvin',
      license: {
        name: 'MIT',
      },
      contact: {
        name: 'Temperature Converter',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['src/routes/*.ts', 'src/app.ts'],
};

const specs = swaggerJsdoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Temperature Converter API',
};

export default specs;
