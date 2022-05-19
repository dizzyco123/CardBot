const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { guild_id, channel_id, member, data, token } = context.params.event;

const userId = data.options[0] ? data.options[0].value : member.user.id;
const { retrieveUser } = require('../../../helper/functions');
await lib.discord.interactions['@1.0.1'].responses.create({
  token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});
const Member = await lib.discord.guilds['@0.2.3'].members.retrieve({
  user_id: member.user.id,
  guild_id
});


const user = await lib.discord.guilds['@0.2.4'].members.retrieve({
  user_id: userId,
  guild_id,
});

await lib.discord.channels['@0.3.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": "",
  "tts": false,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "custom_id": `select_card`,
          "placeholder": `Choose card...`,
          "options": [
            {
              "label": `Bow and Arrow [Common]`,
              "value": `sel_bowarrow`,
              "emoji": {
                "id": null,
                "name": `🟡`
              },
              "default": false
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    }
  ],
  "embeds": [
    {
      "type": "rich",
      "title": `${Member.user.username} VS. ${user.user.username}`,
      "description": `Let's get ready to duel!`,
      "color": 0x000000,
      "thumbnail": {
        "url": `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/313/crossed-swords_2694-fe0f.png`,
        "height": 0,
        "width": 0
      }
    }
  ]
});