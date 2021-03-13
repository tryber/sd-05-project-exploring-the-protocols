const net = require('net');
const fs = require('fs');
const { getLocationInfos } = require('./location');

let template = '';

fs.readFile(`${__dirname}/template.tpt`, 'utf8', (err, data) => {
  if (err) console.error(err);
  else template = data.split('\r\n') || [];
});

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';
const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      template.forEach((value) => {
        const v = value
          .replace(/%ip/g, clientIP)
          .replace(/%region/g, locationData.region)
          .replace(/%postal_code/g, locationData.postal_code)
          .replace(/%country/g, locationData.country_name)
          .replace(/%company/g, locationData.company);
        socket.write(v);
      });
      socket.write(endOfResponse);
      socket.end();
    });
  });
});

server.listen(8080);
