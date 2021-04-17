const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));
  console.log('começo data', data, 'fim data')

  console.log('começo header', headerData, 'fim header')

  return headerData.split(': ').pop();
};

const startOfResponse = `${[
  'HTTP/1.1 200 OK',
  'Content-Type: text/html; charset=UTF-8',
].join('\r\n')}\r\n\r\n`;

const endOfResponse = `${[].join('\r\n')}\r\n\r\n`;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
