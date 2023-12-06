const clientId = "";
const clientSecret = "";

async function requestAccessToken(code, redirectUri) {
  const tokenEndpoint = 'https://github.com/login/oauth/access_token';

  // Construct the request body
  const requestBody = new URLSearchParams();
  requestBody.append('client_id', clientId);
  requestBody.append('client_secret', clientSecret);
  requestBody.append('code', code);
  requestBody.append('redirect_uri', redirectUri);

  return fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  })
  .then(response => response.json())
  .then(data => {
    const token = data['access_token'];
    return token;
  });
}

export const launchWebAuthFlow = async () => {
  const redirectUri = chrome.identity.getRedirectURL("github");
  const state = Math.random().toString(32).substring(2);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('state', state);

  console.log({url});

  return chrome.identity.launchWebAuthFlow(
    {
      url: url.toString(),
      interactive: true
    }
  ).then((responseUrl) => {
    const url = new URL(responseUrl);
    const code = url.searchParams.get('code');
    
    if (state !== url.searchParams.get('state')) throw new Error('invalid state');

    return requestAccessToken(code, redirectUri);
  })
}