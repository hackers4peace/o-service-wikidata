const Hapi = require('hapi')
const Wikidata = require('o-wikidata-api').default
const Joi = require('joi')
const config = require('./config.json')

const server = new Hapi.Server()
const wikidata = new Wikidata()

server.register([
  {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      }]
    }
  }], function (err) {

  if (err) throw err

  // interface and port
  server.connection({
    port: config.hapi.port
  })

  // routes
  server.route({
    method: 'GET',
    path: '/webSearchEntities',
    config: {
      cors: true,
      validate: {
        query: {
          search: Joi.string().required()
        }
      }
    },
    handler: function (request, reply) {
      return reply(wikidata.webSearchEntities(request.query.search))
    }
  })

  // start!
  server.start(function () {
    server.log('info', 'Server running at:' + server.info.uri)
  })
})
