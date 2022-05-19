const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async () => {
  let id;;
  let alreadyExists = true;
  
  while (alreadyExists) {
    id = '';
    
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = letters.length;
    
    for (let i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    for (let i = 0; i < 6; i++) {
      id += Math.floor(Math.random() * 9);
    }
    
    let res = await lib.airtable.query['@1.0.0'].select({
      table: 'Transactions',
      where: [
        {
          Transaction_ID: id
        }
      ],
      limit: {
        count: 0,
        offset: 0
      }
    });
    if (!res.rows.length) alreadyExists = false;
  }
  console.log(id);
  return id;
}