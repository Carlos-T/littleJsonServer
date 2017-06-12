var express = require('express');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var port = 8800;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, HEADER.APPLICATIONID, HEADER.TRACKING_ID, HEADER.SERVICE_CHANNEL, HEADER.SERVICE_PROCEDENCE, HEADER.SERVICE_LANGUAGE, HEADER.SERVICE_COUNTRY, HEADER.DEVICE_ID, X-BanTotal-Token, HEADER.SESSION_TOKEN, HEADER.USER_SESSION_ID, HEADER.OPERATING_SYSTEM_VERSION, HEADER.OPERATING_SYSTEM_LANGUAGE, HEADER.OPERATING_SYSTEM_NAME, HEADER.RSA_DATA, X-XSRF-TOKEN");
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/*', response);
app.post('/*', response);
app.put('/*', response);
app.delete('/*', response);

function response(req, res) {
  var url = req.url.split('?')[0];
  var status = 200;
  var file, path = './api' + url + '.' + req.method + '.json';
  try {
    file = fs.readFileSync(path, 'UTF-8');
  } catch (e) {
    status = 404;
    res.status(404);
    file = JSON.stringify({
      status: 404,
      data: 'ENOENT: No such file or directory'
    });
    console.error('404 - ' + path + ' - No such file or directory');
  }
  try {
    file = JSON.parse(file);
  } catch (e) {
    res.status(500);
    status = 500;
    file = {
      error: 500,
      message: 'Malformed json' + JSON.stringify(e)
    };
    console.error('500 - ' + path + ' - Malformed json');
  }
  if ((file.index || file.index === 0) && file.responses) {
    file = file.responses[file.index];
  }
  if (file.status && file.data) {
    res.status(file.status);
  } else {
    status = 500;
    res.status(500);
    file = {
      error: 500,
      message: 'Incorrect json'
    };
    console.error('500 - ' + path + ' - Incorrect json');
  }
  if(file.headers) {
    for(var i in file.headers) {
      if(file.headers.hasOwnProperty(i)) {
        res.set(i, file.headers[i]);
      }
    }
  }
  //console.log(status + ' - ' + path + ' - ' + ' - request: ' + util.inspect(req.body, false, null) + ' - response: ' + util.inspect(file.data, false, null));
  res.send(file.data);
}
app.listen(port, function() {
  console.log('json mock listening on port ' + port + '!');
});
