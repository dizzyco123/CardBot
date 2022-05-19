const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

async function retrieveUser (userId, guildId) {
  let user;
  user = await lib.airtable.query['@1.0.0'].select({
    table: `Users`,
    where: [
      {
        User_ID__is: userId,
      },
    ],
    limit: {
      count: 0,
      offset: 0,
    },
  });
  if (!user.rows.length) {
    const User = await lib.discord.guilds['@0.2.3'].members.retrieve({
      user_id: userId,
      guild_id: guildId,
    });

    user = await lib.airtable.query['@1.0.0'].insert({
      table: `Users`,
      fieldsets: [
        {
          User_ID: User.user.id,
          Username: User.user.username,
          Discriminator: User.user.discriminator,
          Cash: 1000,
          Bank: 0,
        },
      ],
      typecast: false,
    });
  }
  return user;
}

async function addMoney (userId, guild_id, amount, type) {
  const cashType = type == 'cash';
  const user = await retrieveUser(userId, guild_id);

  const fields = cashType ? { Cash: user.rows[0].fields.Cash + amount } : { Bank: user.rows[0].fields.Bank + amount }

  await lib.airtable.query['@1.0.0'].records.update({
    table: `Users`,
    id: user.rows[0].id,
    fields,
  });
}

async function removeMoney (userId, guild_id, amount, type) {
  const cashType = type == 'cash';
  const user = await retrieveUser(userId, guild_id);
  
  const fields = cashType ? { Cash: user.rows[0].fields.Cash - amount } : { Bank: user.rows[0].fields.Bank - amount }
  
  await lib.airtable.query['@1.0.0'].records.update({
    table: `Users`,
    id: user.rows[0].id,
    fields,
  });
}

module.exports = { retrieveUser, addMoney, removeMoney };