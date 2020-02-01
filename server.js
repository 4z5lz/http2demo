const express = require('express');
const morgan = require('morgan');
const serveIndex = require('serve-index');

const portHttp = 3000;
const app = express();

//console-log the http traffic
morgan.token('protocol', function(req, res) {
  return req.secure ? 'https' : 'http ';
});
app.use(morgan(':date[iso] :protocol -- :method :url :status :res[content-length] - :response-time ms'));

// serve the demo folder.
app.use(express.static(__dirname + '/demo/'));
app.use('/app', serveIndex(__dirname + '/demo/'));

app.listen(portHttp, function() {
  console.log('HTTP server started: http://localhost:' + portHttp);
});
