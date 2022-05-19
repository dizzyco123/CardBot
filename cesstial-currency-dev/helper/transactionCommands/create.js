module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // Get the functions required for this endpoint file from the functions.js file.
  const { retrieveUser } = require('../functions');
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token } = context.params.event;
  
  // Useful function so I don't repeat myself 10 times for all different error messages.
  async function send (content) {
    await lib.discord.interactions['@1.0.1'].responses.update({
      token,
      content,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
    });
  }
  
  // Retrieve data for targeted user.
  const targetUser = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: data.options[0].options[0].value,
    guild_id
  });
  
  // Retrieve the transfer amount.
  const amount = data.options[0].options[1].value;
  
  // Bots don't count :)
  if (targetUser.user.bot) return send(`You can't transfer money to bots!`);
  
  // Get the current tax rate, if for some reason there is none use 8.
  const taxRate = await lib.utils.kv['@0.1.16'].get({
    key: `Tax`,
    defaultValue: 8
  });
  
  // Retrieve target users balance data.
  const userInfo = await retrieveUser(member.user.id, guild_id);
  
  // Error messages
  if (targetUser.user.id == member.user.id) return send (`You can't transfer money to yourself!`);
  if (userInfo.rows[0].fields.Cash < amount) return send(`You don't have enough cash for this transaction!`);
  if (amount < 100) return send(`You cannot transfer less than ${process.env.CURRENCY_EMOJI}100`);
  
  // Return a confirm messge with button interaction.
  return lib.discord.interactions['@1.0.1'].responses.update({
    token,
    content: '',
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    components: [
      {
        type: 1,
        components: [
          {
            style: 3,
            label: `Confirm`,
            custom_id: `transaction_confirm`,
            disabled: false,
            type: 2
          },
          {
            style: 4,
            label: `Refuse`,
            custom_id: `transaction_refuse`,
            disabled: false,
            type: 2
          }
        ]
      }
    ],
    embeds: [
      {
        type: 'rich',
        title: `Confirm Transaction`,
        description: `Please confirm your transaction of ${process.env.CURRENCY_EMOJI}${amount} to <@!${targetUser.user.id}>.`,
        author: {
          name: targetUser.user.username,
          icon_url: targetUser.user.avatar_url
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