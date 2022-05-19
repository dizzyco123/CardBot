console.time()
// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// This file simply creates the slash commands upon instalation of this app.

const sleep = async(ms) => new Promise((r) => setTimeout(r, ms));

if (process.env.CommandCreation.toLowerCase() !== 'yes') return;

const guild_id = process.env.GuildId;

await lib.discord.commands['@0.0.0'].create({
  guild_id,
  name: "duel",
  description: "Duel a user of your choice!",
  options: [
    {
      type: 6,
      name: "user",
      description: "The user you want to battle.",
      required: true
    }
  ]
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: `balance`,
  description: 'Check yours/someone elses balance.',
  options: [
    {
      type: 6,
      name: 'user',
      description: 'User to check balance for.',
      required: false,
    }
  ]
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: `deposit`,
  description: 'Deposit money to your bank.',
  options: [
    {
      type: 3,
      name: 'amount',
      description: 'Amount to deposit. \'all\' to deposit all your money.',
      required: true,
    }
  ]
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: `withdraw`,
  description: 'Withdraw money from your bank.',
  options: [
    {
      type: 3,
      name: 'amount',
      description: 'Amount to withdraw. \'all\' to withdraw all your money.',
      required: true,
    }
  ]
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'transaction',
  description: 'Transaction Commands',
  options: [
    {
      type: 1,
      name: 'create',
      description: 'Create a new transacion',
      options: [
        {
          type: 6,
          name: 'recipient',
          description: 'Recipient',
          required: true
        },
        {
          type: 10,
          name: 'amount',
          description: 'Amount to transfer.',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'log',
      description: 'View your transaction log.'
    },
  ]
});

await sleep(3000);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'tax',
  description: 'Returns the current tax rate.',
});

await sleep(2000);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'profile',
  description: 'Returns the users profile.',
  options: [
    {
      name: 'user',
      description: 'User to return profile for.',
      type: 6,
      required: false,
    },
  ],
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'inventory',
  description: 'Returns the users inventory.',
  options: [
    {
      name: 'user',
      description: 'User to return profile for.',
      type: 6,
      required: false,
    },
  ],
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'cards',
  description: 'Returns the users card inventory.',
  options: [
    {
      name: 'user',
      description: 'User to return cards for.',
      type: 6,
      required: false,
    },
  ],
});

await sleep(2500);

await lib.discord.commands['@0.1.1'].create({
  guild_id,
  name: 'shop',
  description: 'Shop commands',
  options: [
    {
      type: 1,
      name: 'open',
      description: 'Open the shop.'
    },
    {
      type: 1,
      name: 'item-buy',
      description: 'Buy an item form the shop.',
      options: [
        {
          type: 3,
          name: 'item-id',
          description: 'ID of the item.',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'item-create',
      description: 'Create a new item for the shop.',
      options: [
        {
          type: 3,
          name: 'item-name',
          description: 'Name of the item.',
          required: true
        },
        {
          type: 3,
          name: 'description',
          description: 'Item description',
          required: true
        },
        {
          type: 10,
          name: 'price',
          description: 'Item price.',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'item-destroy',
      description: 'Destroy an item from the shop.',
      options: [
        {
          type: 3,
          name: 'item-id',
          description: 'ID of the item.',
          required: true
        },
        {
          type: 3,
          name: 'refund-cost',
          description: 'Refund the money back to everyone who has buyed this item.',
          choices: [
            {
              name: 'Yes',
              value: 'true'
            },
            {
              name: 'No',
              value: 'false'
            }
          ],
          required: true
        }
      ]
    },
  ]
});
console.timeEnd();