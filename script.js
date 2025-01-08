const express = require('express');
const app = express();
const fetch = require('node-fetch');
const subLink = 'https://raw.githubusercontent.com/MrMohebi/xray-proxy-grabber-telegram/master/collected-proxies/row-url/all.txt';

app.get('/sub', async (req, res) => {
  let newConfigs = '';
  let resp = await fetch(subLink);
  let subConfigs = await resp.text();
  subConfigs = subConfigs.split('\n');
  for (let subConfig of subConfigs) {
    if (subConfig.search('vmess') != -1) {
      subConfig = subConfig.replace('vmess://', '');
      subConfig = Buffer.from(subConfig, 'base64').toString('utf-8');
      subConfig = JSON.parse(subConfig);
      if (subConfig.sni && !isIp(subConfig.sni) && subConfig.net == 'ws' && subConfig.port == 443) {
        var configNew = {
          v: '2',
          ps: 'Node-' + subConfig.sni,
          add: req.query.realpathname || req.hostname,
          port: subConfig.port,
          id: subConfig.id,
          net: subConfig.net,
          host: req.hostname,
          path: '/' + subConfig.sni + subConfig.path,
          tls: subConfig.tls,
          sni: req.hostname,
          aid: '0',
          scy: 'auto',
          type: 'auto',
          fp: 'chrome',
          alpn: 'http/1.1'
        };
        configNew = 'vmess://' + Buffer.from(JSON.stringify(configNew)).toString('base64');
        newConfigs += configNew + '\n';
      }
    }
  }
  res.send(newConfigs);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function isIp(ipstr) {
  try {
    if (ipstr == "" || ipstr == undefined) return false;
    if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(ipstr)) {
      return false;
    }
    var ls = ipstr.split('.');
    if (ls == null || ls.length != 4 || ls[3] == "0" || parseInt(ls[3]) === 0) {
      return false;
    }
    return true;
  } catch (ee) { }
  return false;
}
