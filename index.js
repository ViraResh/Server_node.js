var http = require('http');
var url = require('url');
var stream = require('stream');
var lodash = require('lodash');
var flag;

var users = [{ id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
  { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
  { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }];

function setResponseHeaders(response) {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  if(request.method === "OPTIONS") {
    response.writeHead(200, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    });
    response.end();
  }
  else if(request.method === "GET" && parsedUrl.pathname === '/api/users') {
    if (!flag) {
      if (request.headers['content-type'] === undefined || request.headers['content-type'] !== 'application/json') {
        response.writeHead(401, {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json; charset=utf-8'
        });
        response.end();;
      } else {
        response.writeHead(200, {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json; charset=utf-8'
        });
        response.end(JSON.stringify(users));
      }
    } else {
      response.writeHead(200, {
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json; charset=utf-8'
      });
      response.end(JSON.stringify(users));
    }

  }
  if (request.method === 'GET' && parsedUrl.pathname === '/refreshAdmins') {
    response.writeHead(200, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8'
    });
    response.end();
  }
  if(request.method === "POST") {
    var body = '';
    request.on('data', function(resultdata) {
      body += resultdata;
      console.log(body);
    });
    request.on('end', function () {
      var parsed = JSON.parse(body);
      var newUser;
      var id = +users[users.length - 1].id + 1;
      if (parsed.role === 'Administrator' || parsed.role === undefined || parsed.role === 'Support') {
        if (parsed.role === undefined) {
          newUser = {
            id: id,
            name: parsed.name,
            phone: parsed.phone,
            role: 'Student'
          };
          users.push(newUser);
        } else {
          newUser = {
            id: id,
            name: parsed.name,
            phone: parsed.phone,
            role: parsed.role
          };
          users.push(newUser);
        }
        response.writeHead(200, {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json; charset=utf-8'
        });
        response.end(JSON.stringify(id));
      } else {
        response.writeHead(401, {
          'Access-Control-Allow-Headers': 'content-type',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        });
        response.end();
      }
    });
  }
  else if (request.method === 'PUT') {
    flag = true;
  }
});

if (module.parent) {
  module.exports = server
} else {
  server.listen(20007); }
