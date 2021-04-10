/* const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = null;

const endOfResponse = null;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = null;

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
 */
