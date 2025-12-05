import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Catálogo Tech',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/swagger/swagger-components.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions) as any;
