import Provider from 'oidc-provider';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3333;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Provider documentation: https://github.com/panva/node-oidc-provider/blob/main/docs/README.md
const provider = new Provider(`http://${host}:${port}`, {
  features: {
    devInteractions: { enabled: true },
  },
  clients: [{
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    grant_types: ['authorization_code'],
	  response_types: ['code'],
  }],
});

let server;

(async () => {
  server = provider.listen(port, () => {
    console.log(`listening on port ${port}, check http://${host}:${port}/.well-known/openid-configuration`);
  });
})().catch(err => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', () => {
  if (server && server.listening) server.close();
  process.exit(0);
});
