const https = require('https');

const options = {
  hostname: 'iplocation.com',
  port: 443,
  // https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers 443 HTTPS
  path: '/',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const getLocationInfos = (clientIP, cb) => {
  const req = https.request(options, (res) => {
    res.on('data', (locationDataRaw) => {
      const locationData = JSON.parse(locationDataRaw.toString());

      console.log('Location data:');
      console.log(locationData);

      cb(locationData);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  // TO DO: Enviar mensagem (IP) ao server
  req.write(`ip=${clientIP}`);
  req.end();
};

module.exports = {
  getLocationInfos,
};
