// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

// This is not required, but helps a ton with writing cleaner code.
const event = context.params.event;
const { guild_id, channel_id, member, data, token } = context.params.event;

// Respond with a thinking msg.
await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});

// Retrieve all users from the database.
let result = await lib.airtable.query['@1.0.0'].select({
  table: `Users`,
  where: [{}],
  limit: {
    count: 0,
    offset: 0
  }
});

// Since airtable returns the database rows from bottom to top, we need to revers it. Then get the top 10 people.
result.rows.reverse();
let top10 = result.rows.slice(0, 10);

// Empty array variables to push field content into.
let usernames = [];
let cash = [];
let bank = [];

// Push the data from top 10 users in empty arrays.
top10.forEach((user) => {
  usernames.push(`${user.fields.Username}#${user.fields.Discriminator}`);
  cash.push(user.fields.Cash);
  bank.push(user.fields.Bank);
});

// Retrieve the interaction member.
const user = await lib.discord.guilds['@0.2.3'].members.retrieve({
  user_id: member.user.id,
  guild_id
});

// Return a message
await lib.discord.interactions['@1.0.1'].responses.update({
  token,
  embeds: [
      {
      type: 'rich',
      author: {
        name: user.user.username,
        icon_url: user.user.avatar_url
      },
      footer: {
        text: 'CardBot 2022',
      },
      color: parseInt(process.env.EMBEDCOLOR),
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: 'User',
          value: usernames.join('\n'),
          inline: true,
        },
        {
          name: 'Cash',
          value: cash.join('\n'),
          inline: true,
        },
        {
          name: 'Bank',
          value: bank.join('\n'),
          inline: true,
        },
      ],
    },
  ],
});