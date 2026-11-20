const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

async function fetchFormTokens() {
  return new Promise((resolve, reject) => {
    https.get('https://docs.google.com/forms/d/e/1FAIpQLScw2fKLPRJOyiiFrRBpyz_6lOGmmCU52mDl0EgmBZZwBB5ycQ/viewform', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const fbzxMatch = data.match(/name="fbzx"\s+value="([^"]+)"/);
        const fbzx = fbzxMatch ? fbzxMatch[1] : '';
        resolve({ fbzx });
      });
    }).on('error', reject);
  });
}

async function submitResponse(payload) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(payload);
    const options = {
      hostname: 'docs.google.com',
      port: 443,
      path: '/forms/d/e/1FAIpQLScw2fKLPRJOyiiFrRBpyz_6lOGmmCU52mDl0EgmBZZwBB5ycQ/formResponse',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          isSuccess: res.statusCode === 200 || (body && (body.includes('Your response has been recorded') || body.includes('freebirdFormviewerViewResponseConfirmationMessage'))),
          bodySnippet: body.slice(0, 500)
        });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function test() {
  console.log('Fetching fresh tokens...');
  const { fbzx } = await fetchFormTokens();
  console.log('Token fbzx:', fbzx);

  // Test Profile 1 (Debt-free student)
  const payload = {
    'entry.989902155': '19', // Age
    'entry.1675920722': 'Undergraduate Student (Synthetic Test #1)', // Occupation
    'entry.1642986862': '8000', // Income
    'entry.1329824916': 'no', // EMI status
    'entry.1177264065': 'None', // Category
    'entry.1243095368': '0', // Monthly EMI
    'entry.1845795617': 'Never', // Difficulty
    'entry.1691582808': '2500', // Savings
    'fvv': '1',
    'pageHistory': '0',
    'fbzx': fbzx
  };

  console.log('Submitting test payload...');
  const res = await submitResponse(payload);
  console.log('Status code:', res.statusCode);
  console.log('Is success:', res.isSuccess);
  console.log('Body snippet:\n', res.bodySnippet);
}

test().catch(console.error);

