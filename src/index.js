const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

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
    const clientDevice = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      const { postal_code: postalCode, country_name: country } = locationData;

      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<H2 data-testid="ip">${clientIP}</H2>`);
      socket.write(`<H2 data-testid="city">${locationData.city}</H2>`);
      socket.write(`<H2 data-testid="postal_code">${postalCode}</H2>`);
      socket.write(`<H2 data-testid="region">${locationData.region}</H2>`);
      socket.write(`<H2 data-testid="country">${country}</H2>`);
      socket.write(`<H2 data-testid="company">${locationData.company}</H2>`);
      socket.write(`<H3 data-testid="device"> ${clientDevice}</H3>`);
      socket.write(`<H3 data-testid="arch"> ${os.platform() - os.arch() - os.release()}</H3>`);
      socket.write(`<H3 data-testid="cpu"> ${os.cpus()}</H3>`);
      socket.write(`<H3 data-testid="memory"> ${os.totalmem()}</H3>`);
      socket.write(`<p data-testid="device"> ${clientDevice}</p>`);
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
