module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  if (!['MANAGE_GUILD', 'ADMINISTRATOR'].some((permission) => member.permission_names.includes(permission)))
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: `You don't have permission to use this command!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
  
  const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: member.user.id,
    guild_id
  });
  
  await lib.airtable.query['@1.0.0'].insert({
    table: `Shop Items`,
    fieldsets: [
      {
        Name: data.options[0].options[0].value,
        Description: data.options[0].options[1].value,
        Price: parseInt(data.options[0].options[2].value),
        CreatedAt: new Date().toDateString(),
      }
    ],
    typecast: false
  });
  
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: `Item Created!`,
    embeds: [
      {
        type: 'rich',
        author: {
          name: Member.user.username,
          icon_url: Member.user.avatar_url
        },
        description: [
          `**${process.env.CURRENCY_EMOJI}${data.options[0].options[2].value} - ${data.options[0].options[0].value}**`,
          `${data.options[0].options[1].value}`
        ].join('\n'),
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