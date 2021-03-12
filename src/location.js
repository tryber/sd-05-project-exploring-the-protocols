const https = require('https');

const options = {
  // chamada HTTPS à API iplocation
  hostname: 'iplocation.com',
  // padrão HTTPS <https://docs.microsoft.com/pt-br/mem/configmgr/core/plan-design/hierarchy/ports>
  port: 443,
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

  // request HTTPS para enviar o endereço IP,ip=CLIENT_IP, req9 feito no plantão anteriormente
  // TO DO: Enviar mensagem (IP) ao server
  req.write(`ip=${clientIP}`);

  req.end();
};

module.exports = {
  getLocationInfos,
};
