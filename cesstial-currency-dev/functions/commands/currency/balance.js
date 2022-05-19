// Authenticates you with the API standard library
// Type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Get the functions required for this endpoint file from the functions.js file.
const { retrieveUser } = require('../../../helper/functions');

// This is not required, but helps a ton with writing cleaner code.
const event = context.params.event;
const { guild_id, channel_id, member, data, token } = context.params.event;

// Respond with a thinking msg.
await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

// Retrieve data for targeted user.
const targetUser = await lib.discord.guilds['@0.2.3'].members.retrieve({
  user_id: data.options[0] ? data.options[0].value : member.user.id,
  guild_id
});

// Bots don't count :)
if (targetUser.user.bot) return lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  token,
  content: `Please choose a non-bot user!`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
});

// Retrieve target users balance data.
const userInfo = await retrieveUser(targetUser.user.id, guild_id);

// Return an embed message with the users balance details.
await lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: '',
    embeds: [
      {
        type: 'rich',
        title: ``,
        author: {
          name: targetUser.user.username,
          icon_url: targetUser.user.avatar_url
        },
        footer: {
          text: 'CardBot 2022',
        },
        color: parseInt(process.env.EMBEDCOLOR),
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '•Coins•',
            value: process.env.CURRENCY_EMOJI + userInfo.rows[0].fields.Cash,
            inline: true
          },
          {
            name: `•Bank•`,
            value: process.env.CURRENCY_EMOJI + userInfo.rows[0].fields.Bank,
            inline: true
          },
          {
            name: '•Net Worth•',
            value: process.env.CURRENCY_EMOJI + userInfo.rows[0].fields.Networth,
            inline: true
          }
        ],
      },
    ],
});