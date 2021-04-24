const net = require('net');
const system = require('os');

const PORT = 8080;
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
      socket.write(startOfResponse);

      socket.write(`<H3 data-testid='ip'>${clientIP}</H3>`);

      socket.write(`<H3 data-testid='device'>client\`s device information: ${device}</H3>`);

      socket.write(`<p data-testid='arch'>Base archteture of the System: ${system.arch()}</p>`);
      socket.write(`<p>OS of the PC: ${system.platform()}</p>`);
      socket.write(`<p>OS version of the System: ${system.release()}</p>`);
      socket.write(`<p data-testid='cpu'>CPUs of System: ${system.cpus().length}</p>`);
      system.cpus().map((i, idx) => socket.write(`<p id=${idx}> CPU number ${idx + 1}: ${i.model} - ${i.speed}</p>`));
      socket.write(`<p data-testid='memory'>client\`s System total memory: ${system.totalmem() / 1024 / 1024 / 1024} GB</p>`);

      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid='posta_code'>${locationData.postal_code}</p>`);
      socket.write(`<p data-testid='region'>${locationData.region_name}</p>`);
      socket.write(`<p data-testid='country'>${locationData.country_name}</p>`);
      socket.write(`<p data-testid='company'>${locationData.isp}</p>`);

      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(PORT);
