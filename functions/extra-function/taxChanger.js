// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Generate a random number between 5 and 20;
const newTaxRate = Math.floor(Math.random() * 6 + 2);

// Set the new tax rate in the KV.
await lib.utils.kv['@0.1.16'].set({
  key: 'Tax',
  value: newTaxRate
});