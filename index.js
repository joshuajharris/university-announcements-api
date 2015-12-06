var port = process.env.PORT || 8080;

var Bootstrap = require('./app/Bootstrap');
var app = new Bootstrap();

var server = app.init();

server.listen(port, function(){
  console.log('Server has started on port 8080');
});
