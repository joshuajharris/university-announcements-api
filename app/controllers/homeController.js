var Scraper = require('../lib/scraper.js');

var HomeController = function(server, config) {
  var scraper = new Scraper(config);
  return {
    initRoutes: function() {
      server.get('/announcements', function(req, res, next) {
        scraper.getAnnouncementsJSON().then(function(data){
          res.send(data);
        });
        next();
      });
    }
  }
}

module.exports = HomeController;
