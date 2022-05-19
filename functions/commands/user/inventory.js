// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

// This is not required, but helps a ton with writing cleaner code.
const event = context.params.event;
const { guild_id, channel_id, member, data, token } = context.params.event;

// Get the functions required for this endpoint file from the functions.js file.
const { retrieveUser } = require('../../../helper/functions');

await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

const userId = data.options[0] ? data.options[0].value : member.user.id;

const user = await lib.discord.guilds['@0.2.4'].members.retrieve({
  user_id: userId,
  guild_id,
});

const Data = await retrieveUser(user.user.id, guild_id);

if (!Data || !Data.rows[0].fields.Items.length) return lib.discord.interactions['@1.0.1'].responses.update({
  token,
  content: `User has no items.`,
});

const userData = Data.rows[0].fields

const items = userData.Items.map(async (item) => {
  const Item = await lib.airtable.query['@1.0.0'].records.retrieve({
    table: 'Shop Items',
    id: item,
  });

  return [
    `**• Name**: ${Item.fields.Name}`,
    `**• ID**: *${Item.fields.ID}*`,
  ].join('\n');
});

const Items = await Promise.all(items);

await lib.discord.interactions['@1.0.1'].responses.update({
  token,
  embeds: [
    {
      type: 'rich',
      description: Items.join('\n\n'),
      timestamp: new Date().toISOString(),
      color: parseInt(process.env.EMBEDCOLOR),
      author: {
        name: `${user.user.username}#${user.user.discriminator}`,
        icon_url: user.user.avatar_url,
      },
      footer: {
        text: `CardBot 2022`
      },
      thumbnail: { url: user.user.avatar_url },
    }
  ]
});