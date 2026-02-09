const dns = require('dns');

console.log('--- NODE DNS TEST ---');
const hostname = 'api.groq.com';

dns.lookup(hostname, (err, address, family) => {
  if (err) {
    console.error(`FAILED to resolve ${hostname}:`, err);
  } else {
    console.log(`SUCCESS: ${hostname} resolved to ${address} (IPv${family})`);
  }
});

dns.resolve4(hostname, (err, addresses) => {
  if (err) {
    console.error(`dns.resolve4 FAILED for ${hostname}:`, err);
  } else {
    console.log(`dns.resolve4 SUCCESS:`, addresses);
  }
});
