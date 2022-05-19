module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // Get the functions required for this endpoint file from the functions.js file.
  const { retrieveUser, removeMoney } = require('../functions');
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  // Useful function so I don't repeat myself 10 times for all different error messages.
  async function ghost (content) {
    await lib.discord.interactions['@1.0.1'].responses.update({
      token,
      content,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
    });
  }
  
  // Retrieve data for targeted user.
  const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: member.user.id,
    guild_id
  });
  
  let item = await lib.airtable.query['@1.0.0'].records.retrieve({
    table: `Shop Items`,
    id: item
  });
  
  if (!item) return ghost(`No item found with ID: **${data.options[0].option[0].value}**!`);
  
  // Retrieve the transfer amount.
  const price = item.fields.Price;
  
  // Retrieve target users balance data.
  const userInfo = await retrieveUser(member.user.id, guild_id);
  
  // Error messages
  if (Array.isArray(item.fields.Users) && item.fields.Users.includes(userInfo.rows[0].id)) return ghost(`You already own this item!`);
  if (userInfo.rows[0].fields.Cash < price) return ghost(`You don't have enough cash to buy this item!`);
  
  // Add the item to the users inventory
  await lib.airtable.query['@1.0.0'].update({
    table: `Shop Items`,
    where: [
      {
        Name__is: item.fields.Name
      }
    ],
    limit: {
      count: 0,
      offset: 0
    },
    fields: {
      Users: item.fields.Users ? item.fields.Users.push(userInfo.rows[0].id) : [userInfo.rows[0].id]
    },
    typecast: false
  });
  
  // Remove the money
  await removeMoney(
    member.user.id,
    guild_id,
    price,
    'cash',
  );
  
  // Return a message.
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: '',
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Item purchased!`,
        description: `Congrats on your purchase!\nYou can view all your purchased items with the \`/inventory\` command!`,
        author: {
          name: Member.user.username,
          icon_url: Member.user.avatar_url
        },
        footer: {
          text: 'CardBot 2022',
        },
        color: parseInt(process.env.EMBEDCOLOR),
        timestamp: new Date().toISOString(),
      }
    ]
  });
}