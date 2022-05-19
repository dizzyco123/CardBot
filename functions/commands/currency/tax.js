// Authenticates you with the API standard library
// Type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// This is not required, but helps a ton with writing cleaner code.
const event = context.params.event;
const { guild_id, channel_id, member, data, token } = context.params.event;

await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

const tax = await lib.utils.kv['@0.1.16'].get({
  key: `Tax`,
  defaultValue: false,
});

if (!tax || process.env.TAX !== 'yes') return lib.discord.interactions['@1.0.1'].responses.update({
  token,
  content: `Tax is disabled!`
});

return lib.discord.interactions['@1.0.1'].responses.update({
  token,
  content: `The current tax rate is ${tax}%!`
});