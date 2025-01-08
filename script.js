import fetch from 'node-fetch';
import fs from 'fs';

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

    // ایجاد فایل HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GitHub Pages Output</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          pre {
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>Output:</h1>
        <pre>${newConfigs}</pre>
      </body>
      </html>
    `;

    // ذخیره فایل HTML در پوشه docs
    if (!fs.existsSync('docs')) {
      fs.mkdirSync('docs');
    }
    fs.writeFileSync('docs/index.html', htmlContent);
    console.log('HTML file created successfully!');
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
