// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

// This is not required, but helps a ton with writing cleaner code.
const event = context.params.event;
const { guild_id, channel_id, member, data, token } = context.params.event;

// Get the functions required for this endpoint file from the functions.js file.
const { retrieveUser, addMoney, removeMoney } = require('../../../helper/functions');

const user = await lib.discord.guilds['@0.2.4'].members.retrieve({
  user_id: event.member.user.id,
  guild_id,
});

// Respond with thinking message
await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

// Declaring the amount variable.
const amount = data.options[0].value;

if (amount !== 'all' && isNaN(amount) || amount <= 0) return lib.discord.interactions['@1.0.1'].responses.update({
  token: event.token,
  content: `Invalid amount.`
});

const userBalance = await retrieveUser(user.user.id, event.guild_id);

const Amount = amount.toLowerCase() == 'all' ? userBalance.rows[0].fields.Bank : parseInt(amount);

const respond = async (content) => {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: event.token,
    content
  });
};

const { Cash, Bank } = userBalance.rows[0].fields;

if (parseInt(Bank) <= 0) return respond(`You don't have any money to withdraw.`);

if (Amount > Bank) return respond(`You don't have that much to withdraw! You currently have ${process.env.CURRENCY_EMOJI}${Cash}`);

// Remove the money from the bank.
await removeMoney(
  user.user.id,
  guild_id,
  Amount,
  'bank',
);

// Add the money to the cash balance.
await addMoney(
  user.user.id,
  guild_id,
  Amount,
  'cash',
);

// Return success msg.
await respond(`Successfully withdrew ${process.env.CURRENCY_EMOJI}${Amount}`);