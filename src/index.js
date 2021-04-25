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
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      const {
        city,
        postal_code: postalCode,
        region,
        country_name: countryName,
        company,
      } = locationData;

      socket.write(startOfResponse);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(
        `<p data-testid="arch">${
          os.platform() - os.arch() - os.release()
        }</p>`,
      );
      socket.write(`<p data-testid="cpu">${os.cpu}</p>`);
      socket.write(`<p data-testid="memory">${os.memory}</p>`);
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write(`<h1 data-testid="ip">${clientIP}</h1>`);
      socket.write(`<h1 data-testid="city">${city}</h1>`);
      socket.write(`<h1 data-testid="postal_code">${postalCode}</h1>`);
      socket.write(`<h1 data-testid="region">${region}</h1>`);
      socket.write(`<h1 data-testid="country">${countryName}</h1>`);
      socket.write(`<h1 data-testid="company">${company}</h1>`);
      socket.write(
        '<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>',
      );
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
