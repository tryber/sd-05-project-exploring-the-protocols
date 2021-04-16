const net = require('net');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    const clientIP = await getHeaderValue(data.toString(), 'X-Forwarded-For');
    console.log('clientIP: ', clientIP);

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<h3 data-testid='ip'>client_ip: ${clientIP}</h3>`);
      socket.write(`<p data-testid='city'>client\`s city: ${locationData}</p>`);
      socket.write(`<p data-testid='posta_code'>client\`s postal code: ${locationData}</p>`);
      socket.write(`<p data-testid='region'>client\`s region: ${locationData}</p>`);
      socket.write(`<p data-testid='country'>client\`s country: ${locationData}</p>`);
      socket.write(`<p data-testid='company'>client\`s Internet service name: ${locationData}</p>`);
      socket.write('</body></html>');
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write(endOfResponse);
    });
  });
});

// console.log(getHeaderValue());
server.listen(8080);
