exports.options = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Asante Kotoko Supporters API',
      description: 'Fastify REST API with Node.js and Swagger',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'api.asantekotokosupporters.com',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
