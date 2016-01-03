var fs = require('fs');
var Scraper = require('../lib/scraper.js');

var HomeController = function(server, config) {
  var scraper = new Scraper(config);

  return {
    initRoutes: function() {
      server.get('/', function(req, res, next) {
        fs.readFile('views/doc.html', function(err, html) {
          if(err) { console.error(err);}
          res.writeHead(200, {
            'Content-Length': Buffer.byteLength(html),
            'Content-Type': 'text/html'
          });
          res.write(html);
          res.end();
        });
        next();
      });

      server.get('/scraper', function(req, res, next) {
        scraper.getAnnouncementsJSON().then(function(data){
          res.send(data);
        });
        next();
      });
    }
  }
};

module.exports = HomeController;
