// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Respond with a thinking msg.
await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

// Since we used subcommands within the shop command we they all trigger the same file.
// Therefore we split them up in multiple files for orginisation.
// Here we just call those files.
const subCommand = context.params.event.data.options[0].name;
await require(`../../../helper/shopCommands/${subCommand}`)(context);