const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const ejs = require('ejs');
const templatePath = `${__dirname}/../views/index.ejs`;

module.exports = async (context) => {
  await lib.utils.kv['@0.1.16'].set({
    key: 'url',
    value: context.host
  });

  const response = await ejs.renderFile(
    templatePath,
    {
      BASE_URL: context.http.url
    },
    {}
  );

  return {
    body: Buffer.from(response || ''),
    headers: {
      'Content-Type': 'text/html'
    }
  };

};