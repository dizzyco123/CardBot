module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  // Get the functions required for this endpoint file from the functions.js file.
  const { retrieveUser, addMoney, removeMoney } = require('../functions');
  const makeId = require('../makeId');
  
  // This is not required, but helps a ton with writing cleaner code.
  const event = context.params.event;
  const { guild_id, channel_id, member, data, token, message } = context.params.event;
  
  if (member.user.id !== message.interaction.user.id) return lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token,
    content: 'This is not your message!',
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
  
  const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: member.user.id,
    guild_id
  });
  
  const targetUser = await lib.discord.guilds['@0.2.3'].members.retrieve({
    user_id: message.embeds[0].description.match(/\d+/g)[message.embeds[0].description.match(/\d+/g).length - 1],
    guild_id
  });
  
  const Tax = await lib.utils.kv['@0.1.16'].get({
    key: 'tax',
    defaultValue: 8
  });
  
  const amount = message.embeds[0].description.match(/\d+/g).filter((el) => el.length !== 18)[0];
  
  const tax = amount <= 1000 || process.env.TAX.toLowerCase() !== 'yes' ? 0 : Tax;
  const amountMinTax = parseInt(amount) - (tax / 100) * parseInt(amount);
  
  await addMoney(
    targetUser.user.id,
    guild_id,
    parseInt(amountMinTax),
    'cash',
  );
  
  await removeMoney(
    member.user.id,
    guild_id,
    parseInt(amountMinTax),
    'cash'
  );
  
  const description = tax == 0
    ? `<@!${member.user.id}> successfully transacted ${amountMinTax} to <@!${targetUser.user.id}>`
    : `<@!${member.user.id}> successfully transacted ${amountMinTax} after a ${tax}% tax to <@!${targetUser.user.id}>`;
  
  await lib.discord.channels['@0.3.0'].messages.update({
    message_id: message.id,
    channel_id,
    content: '',
    embed: {
      type: 'rich',
      title: `Transaction Completed`,
      description,
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
  });
  
  const ID = await makeId();
  
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: process.env.Audit_Log_Channel,
    content: '',
    embed: {
      type: 'rich',
      title: `New Transaction`,
      description: ``,
      author: {
        name: Member.user.username,
        icon_url: Member.user.avatar_url
      },
      footer: {
        text: 'CardBot 2022',
      },
      color: parseInt(process.env.EMBEDCOLOR),
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: 'Sender',
          value: `<@!${Member.user.id}>`,
          inline: true,
        },
        {
          name: 'Recipient',
          value: `<@!${targetUser.user.id}>`,
          inline: true,
        },
        {
          name: 'Amount',
          value: `${process.env.CURRENCY_EMOJI}${amount}`,
          inline: true
        },
        {
          name: 'Tax',
          value: `${tax == 0 ? 'Disabled' : tax+'%'}`,
          inline: true,
        },
        {
          name: 'Unique ID',
          value: ID,
          inline: true
        }
      ]
    }
  });
  
  const sender = await retrieveUser(member.user.id, guild_id);
  const recipient = await retrieveUser(targetUser.user.id, guild_id);

  await lib.airtable.query['@1.0.0'].insert({
    table: `Transactions`,
    fieldsets: [
      {
        Transaction_ID: ID,
        Transactor: [sender.rows[0].id],
        Recipient: [recipient.rows[0].id],
        Amount: amountMinTax,
        Tax: tax == 0 ? 0 : tax,
        Date: new Date().toDateString()
      }
    ],
    typecast: false
  });
}