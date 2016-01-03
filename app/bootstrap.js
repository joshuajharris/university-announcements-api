var restify = require('restify');
var config = require('../config');
var ArchiveCron = require('./archiveCron');

var Bootstrap = function() {
  this.init = function() {
    var server = restify.createServer();
    server.use(restify.fullResponse());
    server.use(restify.bodyParser());

    var HomeController = require('./controllers/homeController.js');

    var homeController = new HomeController(server, config);
    homeController.initRoutes();

    return server;
  };

  this.getArchiveCron = function() {
    var archiveCron = new ArchiveCron(config);
    return archiveCron.setup();
  };

  return this;
}

module.exports = Bootstrap;
