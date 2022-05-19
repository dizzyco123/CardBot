module.exports = async (context) => {
  // Authenticates you with the API standard library
  // Type `await lib.` to display API autocomplete
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  
  await lib.discord.interactions['@1.0.1'].responses.destroy({
    token: context.params.event.token,
  });
}