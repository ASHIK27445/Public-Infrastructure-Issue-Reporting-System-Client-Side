// Run this in browser console
const tokens = [
  { name: 'Alice', token: 'qr_alice_001' },
  { name: 'Bob', token: 'qr_bob_002' },
  { name: 'Charlie', token: 'qr_charlie_003' },
  { name: 'Diana', token: 'qr_diana_004' },
  { name: 'Ethan', token: 'qr_ethan_005' }
];

tokens.forEach(({name, token}) => {
  console.log(`\n${name}:`);
  console.log(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${token}`);
});

/*

Alice:
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qr_alice_001

Bob:
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qr_bob_002

Charlie:
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qr_charlie_003

Diana:
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qr_diana_004

Ethan:
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qr_ethan_005

*/