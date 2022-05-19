module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // Get the functions required for this endpoint file from the functions.js file.
  const { retrieveUser } = require('../functions');
  
   // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  const userQuery = await retrieveUser(member.user.id, guild_id);
  
  const transactions = await lib.airtable.query['@1.0.0'].select({
    table: `Transactions`,
    where: [{}],
    limit: {
      count: 0,
      offset: 0
    }
  });
  
  const userTransactions = transactions.rows.filter((transaction) => transaction.fields.Transactor.includes(userQuery.rows[0].id));
  
  const Description = userTransactions.map(async (transaction) => {
    let recipient = await lib.airtable.query['@1.0.0'].records.retrieve({
      table: `Users`,
      id: transaction.fields.Recipient[0]
    });
    return [
      `**• ID**: ${transaction.fields.Transaction_ID}`,
      `**• Recipient**: <@!${recipient.fields.User_ID}>`,
      `**• Amount**: ${transaction.fields.Amount}`,
      `**• Date**: ${transaction.fields.Date}`,
    ].join('\n');
  });
  
  const description = await Promise.all(Description);
  
  const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: member.user.id,
    guild_id
  });
  
  await lib.discord.interactions['@1.0.1'].responses.update({
    token,
    embeds: [
      {
        type: 'rich',
        title: 'Transaction Logs',
        description: description.join('\n\n'),
        author: {
          name: Member.user.username,
          icon_url: Member.user.avatar_url
        },
        footer: {
          text: 'CardBot 2022',
        },
        color: parseInt(process.env.EMBEDCOLOR),
        timestamp: new Date().toISOString(),
      },
    ],
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}