import fetch from 'node-fetch';

const subLink = 'https://raw.githubusercontent.com/Edudotnexx/Ftest/refs/heads/main/Kdowiw';

async function fetchData() {
  try {
    // دریافت داده‌ها از لینک
    const resp = await fetch(subLink);
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const subConfigs = await resp.text();

    // پردازش داده‌ها
    const newConfigs = processSubConfigs(subConfigs, 'example.com', 'example-path');
    console.log(newConfigs);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

function processSubConfigs(subConfigs, hostname, pathname) {
  let newConfigs = '';
  const configLines = subConfigs.split('\n');

  for (let subConfig of configLines) {
    if (subConfig.includes('vmess')) {
      try {
        subConfig = subConfig.replace('vmess://', '');
        subConfig = Buffer.from(subConfig, 'base64').toString('utf-8');
        subConfig = JSON.parse(subConfig);

        if (subConfig.sni && !isIp(subConfig.sni) && subConfig.net === 'ws' && subConfig.port === 443) {
          const configNew = {
            v: '2',
            ps: 'Node-' + subConfig.sni,
            add: pathname || hostname,
            port: subConfig.port,
            id: subConfig.id,
            net: subConfig.net,
            host: hostname,
            path: '/' + subConfig.sni + (subConfig.path || ''),
            tls: subConfig.tls,
            sni: hostname,
            aid: '0',
            scy: 'auto',
            type: 'auto',
            fp: 'chrome',
            alpn: 'http/1.1',
          };
          const encodedConfig = 'vmess://' + Buffer.from(JSON.stringify(configNew)).toString('base64');
          newConfigs += encodedConfig + '\n';
        }
      } catch (error) {
        console.error('Error processing subConfig:', error);
      }
    }
  }

  return newConfigs;
}

function isIp(ipstr) {
  try {
    if (!ipstr) return false;
    const ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/;
    if (!ipPattern.test(ipstr)) return false;

    const parts = ipstr.split('.');
    if (parts.length !== 4 || parts[3] === "0" || parseInt(parts[3]) === 0) return false;

    return true;
  } catch (error) {
    return false;
  }
}

// اجرای تابع اصلی
fetchData();
