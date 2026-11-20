const fs = require('fs');

const html = fs.readFileSync('form_page.html', 'utf8');
const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.+?\]);\s*<\/script>/s);

if (!match) {
  console.log('FB_PUBLIC_LOAD_DATA_ not found');
  process.exit(1);
}

try {
  const data = JSON.parse(match[1]);
  console.log('Form Title:', data[1][8] || data[1][0]);
  console.log('Form Description:', data[1][0]);
  
  const items = data[1][1];
  console.log('Total items in data[1][1]:', items.length);

  items.forEach((item, idx) => {
    const id = item[0];
    const title = item[1];
    const desc = item[2];
    const typeCode = item[3];
    const entryData = item[4];

    console.log(`\n========================================`);
    console.log(`Item #${idx + 1}: ID=${id}`);
    console.log(`Title: "${title}"`);
    if (desc) console.log(`Description: "${desc}"`);
    console.log(`Type: ${typeCode}`);

    if (entryData && Array.isArray(entryData)) {
      entryData.forEach((sub, sIdx) => {
        const entryId = sub[0];
        const options = sub[1] ? sub[1].map((o) => o[0]) : null;
        const isRequired = sub[2] === 1;
        console.log(`  Sub[${sIdx}] Entry ID: entry.${entryId} (Required: ${isRequired})`);
        if (options) {
          console.log(`  Options:`, options);
        }
      });
    }
  });
} catch (err) {
  console.error('JSON parse error:', err.message);
}

