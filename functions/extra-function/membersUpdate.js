// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const event = context.params.event;

// Update the database with the new username and discriminator if the have change, otherwise they stay the same.
await lib.airtable.query['@1.0.0'].update({
  table: `Users`,
  where: [
    {
      User_ID__is: event.user.id,
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
  fields: {
    Username: event.user.username,
    Discriminator: event.user.discriminator,
  },
  typecast: false
});