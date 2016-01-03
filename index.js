var port = process.env.PORT || 8080;

var Bootstrap = require('./app/bootstrap');
var app = new Bootstrap();

var server = app.init();

var cron = app.getArchiveCron();

cron.start();

server.listen(port, function(){
  console.log('Server has started on port 8080');
});
