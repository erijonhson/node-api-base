const swaggerJSDoc = require('swagger-jsdoc');
const config       = require('config');
const appPackage   = require('../../package');

module.exports = app => {
  // swagger definition
  const swaggerDefinition = {
    info: {
      title: `${appPackage.fullname} Swagger API` ,
      version: '1.0.0',
      description: `Describes a RESTful API with Swagger for ${appPackage.fullname}`,
    },

    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [
      { jwt: [] }
    ],
    host: `${config.get('swaggerHost')}:${config.get('swaggerPort')}`,
    basePath: '/',
  };

  // TODO create script to read recursive
  const routes = require('glob').sync(__dirname + '/../services/**/*route.js', {});

  // options for the swagger docs
  const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: routes,
  };

  // initialize swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);

  // serve swagger
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
