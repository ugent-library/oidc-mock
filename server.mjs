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
  pkce: {
    required: function () { return false }
  },
  clients: [{
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ['code'],
    grant_types: ['authorization_code'],
  }],
});

function handleError(ctx, err) {
  console.log(ctx);
  console.log(err);
}

provider.on('authorization.error', handleError);
provider.on('backchannel.error', handleError);
provider.on('jwks.error', handleError);
provider.on('discovery.error', handleError);
provider.on('end_session.error', handleError);
provider.on('grant.error', handleError);
provider.on('introspection.error', handleError);
provider.on('pushed_authorization_request.error', handleError);
provider.on('registration_create.error', handleError);
provider.on('registration_delete.error', handleError);
provider.on('registration_read.error', handleError);
provider.on('registration_update.error', handleError);
provider.on('revocation.error', handleError);
provider.on('server_error', handleError);
provider.on('userinfo.error', handleError);

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
