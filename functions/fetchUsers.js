// Authenticates you with the API standard library
// Type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that returns all users from the airtable database.
* @returns {array} rows User from database
*/

module.exports = async () => {
  let res = await lib.airtable.query['@1.0.0'].select({
    table: `Users`,
    where: [{}],
    limit: {
      'count': 0,
      'offset': 0
    }
  });
  
  return res.rows;
}