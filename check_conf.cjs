const https = require('https');
const querystring = require('querystring');

async function checkBody() {
  const { fbzx } = await new Promise((resolve) => {
    https.get('https://docs.google.com/forms/d/e/1FAIpQLScw2fKLPRJOyiiFrRBpyz_6lOGmmCU52mDl0EgmBZZwBB5ycQ/viewform', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const m = data.match(/name="fbzx"\s+value="([^"]+)"/);
        resolve({ fbzx: m ? m[1] : '' });
      });
    });
  });

  const payload = querystring.stringify({
    'entry.989902155': '20',
    'entry.1675920722': 'Synthetic Test Check',
    'entry.1642986862': '10000',
    'entry.1329824916': 'no',
    'entry.1177264065': 'None',
    'entry.1243095368': '0',
    'entry.1845795617': 'Never',
    'entry.1691582808': '3000',
    'fvv': '1',
    'pageHistory': '0',
    'fbzx': fbzx
  });

  const req = https.request({
    hostname: 'docs.google.com',
    path: '/forms/d/e/1FAIpQLScw2fKLPRJOyiiFrRBpyz_6lOGmmCU52mDl0EgmBZZwBB5ycQ/formResponse',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      const confMatch = body.match(/class="[^"]*freebirdFormviewerViewResponseConfirmationMessage[^"]*">([^<]+)<\/div>/i) ||
                        body.match(/<div[^>]*>([^<]*(?:response has been recorded|recorded)[^<]*)<\/div>/i);
      console.log('Confirmation message match:', confMatch ? confMatch[0] : 'Not matched directly');
      // Also look for link "Submit another response"
      const anotherLink = body.match(/href="([^"]*viewform[^"]*)"[^>]*>([^<]+)<\/a>/i);
      console.log('Another response link:', anotherLink ? anotherLink[0] : 'None');
    });
  });
  req.write(payload);
  req.end();
}

checkBody().catch(console.error);

