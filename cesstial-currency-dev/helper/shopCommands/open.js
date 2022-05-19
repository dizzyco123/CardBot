module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  const guild = await lib.discord.guilds['@0.2.3'].retrieve({
    guild_id
  });
  
  let shop_items = await lib.airtable.query['@1.0.0'].select({
    table: `Shop Items`,
    where: [{}],
    limit: {
      count: 0,
      offset: 0
    }
  });
  
  if (!shop_items.rows.length) return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: `The shop is currently empty, use the \`/shop item-create\` command to create an item for the shop!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
  
  const description = shop_items.rows.map((item) => {
    return [
      `**${process.env.CURRENCY_EMOJI}${item.fields.Price} - ${item.fields.Name}**`,
      `**ID**: \`${item.fields.ID}\``,
      `**Description**: ${item.fields.Description}`
    ].join('\n')
  }).join('\n\n');
  
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    embeds: [
      {
        type: 'rich',
        author: {
          name: `${guild.name} | Shop`,
          icon_url: guild.icon_url
        },
        footer: {
          text: `CardBot 2022`
        },
        color: parseInt(process.env.EMBEDCOLOR),
        description: `Buy an item using the \`/shop item-buy\` command!\n\n${description}`,
        timestamp: new Date().toISOString()
      }
    ],
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}