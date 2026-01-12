import swaggerAutogen from 'swagger-autogen';

console.log('🚀 swagger.js started');

const swagger = swaggerAutogen();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './app.js',
];

const doc = {
  info: {
    title: 'Rainbow Rice Cake API',
    version: '1.0.0',
  },
};

await swagger(outputFile, endpointsFiles, doc);
console.log('✅ swagger_output.json generated');