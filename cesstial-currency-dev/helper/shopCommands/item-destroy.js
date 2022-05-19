module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  // Get the functions required for this endpoint file from the functions.js file.
  const { addMoney } = require('../functions');
  
  if (!['MANAGE_GUILD', 'ADMINISTRATOR'].some((permission) => member.permission_names.includes(permission)))
  return lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token,
    content: `You don't have permission to use this command!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
  
  const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: member.user.id,
    guild_id
  });
  
  const item = await lib.airtable.query['@1.0.0'].records.retrieve({
    table: `Shop Items`,
    id: data.options[0].options[0].value
  })
  .catch((err) => {
     return lib.discord.interactions['@1.0.1'].responses.update({
      token,
      content: `No item found with ID: **${data.options[0].options[0].value}**!`,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
    });
  })
  
  if (data.options[0].options[1].value == 'true') {
    item.fields.Users.forEach(async (user) => {
      await lib.airtable.query['@1.0.0'].records.retrieve({
        table: `Shop Items`,
        id: user
      })
      .then(async (record) => {
        await addMoney(
          record.fields.User_ID,
          guild_id,
          item.fields.Price,
          'cash',
        );
      })
      .catch((err) => console.log(err));
    });
  }
  
  await lib.airtable.query['@1.0.0'].records.destroy({
    table: `Shop Items`,
    id: item.id
  });
  
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: `Item Destroyed!`,
    embeds: [
      {
        type: 'rich',
        author: {
          name: Member.user.username,
          icon_url: Member.user.avatar_url
        },
        description: `Shop item deleted: **${item.fields.Name}**${data.options[0].options[1].value == 'true' ? ', all purchases of this item have been refunded!' : '!'}`,
        timestamp: new Date().toISOString(),
        color: parseInt(process.env.EMBEDCOLOR),
        footer: {
          text: `CardBot 2022`,
        },
      }
    ],
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}