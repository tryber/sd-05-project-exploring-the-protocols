const net = require('net');
const system = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data.split('\r\n').find((chunk) => chunk.startsWith(header));
  return headerData.split(': ').pop();
};
const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';
const endOfResponse = '\r\n\r\n';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const device = getHeaderValue(data.toString(), 'User-Agent');
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    getLocationInfos(clientIP, (locationData) => {
      socket.write(startOfResponse);
      // console.log('locationData: ', locationData);
      socket.write(
        '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">',
      );
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<h3 data-testid='ip'>client_ip: ${clientIP}</h3>`);
      socket.write(`<h3 data-testid='device'>client\`s device information: ${device}</h3>`);
      socket.write(`<p data-testid='arch'>Base archteture of the System: ${system.arch}</p>`);
      socket.write(`<p data-testid='cpu'>Numbers of CPUs of System: ${system.cpus().length}</p>`);

      system.cpus().map((i, idx) => socket.write(`<p id=${idx}> CPU number ${idx + 1}: ${i.model} - ${i.speed}</p>`));
      socket.write(`<p data-testid='memory'>client\`s System free memory: ${system.totalmem() / 1024 / 1024 / 1024} GB</p>`);
      socket.write(`<p data-testid='city'>client\`s city: ${locationData.city}</p>`);
      socket.write(`<p data-testid='posta_code'>client\`s postal code: ${locationData.postal_code}</p>`);
      socket.write(`<p data-testid='region'>client\`s region: ${locationData.region_name}</p>`);
      socket.write(`<p data-testid='country'>client\`s country: ${locationData.country_name}</p>`);
      socket.write(`<p data-testid='company'>client\`s Internet service provider: ${locationData.isp}</p>`);
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
