const express = require('express')
const asyncHandler = require('express-async-handler')

const constructRouter = routesPath => {
  const apiRouter = express.Router()
  // load all routes
  const routes = require('./' + routesPath)
  for (let url in routes) {
    const verbs = routes[url]
    for (let verb in verbs) {
      const def = verbs[verb]
      const method = require('../controllers/' + def.controller)[def.method]
      if (!method) {
        throw new Error(def.method + ' is undefined')
      }
      const middleware = []
      middleware.push(asyncHandler(method))
      apiRouter[verb](url, middleware)
    }
  }
  return apiRouter
}

module.exports = constructRouter
