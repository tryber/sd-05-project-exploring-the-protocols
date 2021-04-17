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

const arch = os.arch();

const platform = os.platform();

const release = os.release();

const totalCores = os.cpus().length;

const cores = cpus.map((core) => `- modelo: ${core.model} - velocidade ${core.speed / 1000}GHz`);

const totalMemory = os.totalmem() / 1024 / 1024 / 1024;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const userAgent = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">${locationData.region}</p>`);
      socket.write(`<p data-testid="country">${locationData.country}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write(`<p data-testid="device">${userAgent}</p>`);
      socket.write(`<h1 data-testid="arch">A arquitetura do nosso SO é: ${arch}. A plataforma é ${platform}. E a versão é: ${release}</h1>`);
      socket.write(`<h1 data-testid="cpu">A CPU tem ${totalCores} cores. Que são eles: ${cores}</h1>`);
      socket.write(`<h1 data-testid="memory">A memória RAM total é de ${totalMemory.toFixed(0)}GB</h1>`);
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
