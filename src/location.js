const https = require('https');

const options = {
  hostname: 'iplocation.com',
  port: 443,
  path: '/',
  method: 'POST',
  header: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const getInfos = (clientIP, cb) => {
  const req = https.request(options, (res) => {
    res.on('data', (DataRaw) => {
      const Data = JSON.parse(DataRaw.toString());

      console.log(' data:');
      console.log(Data);

      cb(Data);
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
  getInfos,
};
