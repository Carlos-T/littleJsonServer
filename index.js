var express = require('express');
var fs = require('fs');
var app = express();
var port = 8800;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, HEADER.APPLICATIONID, HEADER.TRACKING_ID, HEADER.SERVICE_CHANNEL, HEADER.SERVICE_PROCEDENCE, HEADER.SERVICE_LANGUAGE, HEADER.SERVICE_COUNTRY, HEADER.DEVICE_ID, X-BanTotal-Token, HEADER.SESSION_TOKEN, HEADER.USER_SESSION_ID");
  next();
});
app.get('/*', response);
app.post('/*', response);
app.put('/*', response);
app.delete('/*', response);

function response(req, res) {
  var url = req.url.split('?')[0];
  var file, path = './api' + url + '.' + req.method + '.json';
  try {
    file = fs.readFileSync(path, 'UTF-8');
  } catch (e) {
    res.status(404);
    file = JSON.stringify({
      status: 404,
      data: 'ENOENT: No such file or directory'
    });
  }
  try {
    file = JSON.parse(file);
  } catch (e) {
    res.status(500);
    file = {
      error: 500,
      message: 'Malformed json' + JSON.stringify(e)
    };
  }
  if (file.index && file.responses) {
    file = file.responses[index];
  }
  if (file.status && file.data) {
    res.status(file.status);
  } else {
    res.status(500);
    file = {
      error: 500,
      message: 'Incorrect json'
    };
  }
  res.send(file);
}
app.listen(port, function() {
  console.log('json mock listening on port ' + port + '!');
});
