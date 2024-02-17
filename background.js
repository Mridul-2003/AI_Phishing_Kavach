document.addEventListener('mousemove', function(event) {
    console.log('Mouse movement on webpage - X:', event.clientX, 'Y:', event.clientY);
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
      url: chrome.extension.getURL('popup.html'),
      active: true
    });
  });

// background.js

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_KEY = 'gmail_token';

chrome.runtime.onInstalled.addListener(async () => {
  // Check if the user is already authenticated
  const token = await getToken();
  if (!token) {
    // If not authenticated, initiate the OAuth flow
    await authorize();
  }
});

async function authorize() {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=225323746450-sr8fa46t7m91msnf95ogna7bl5u59gfa.apps.googleusercontent.com&response_type=token&redirect_uri=YOUR_EXTENSION_ID&scope=https://www.googleapis.com/auth/gmail.readonly`;

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl,
      interactive: true,
    },
    async (redirectUrl) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      const token = extractTokenFromRedirect(redirectUrl);
      saveToken(token);
    }
  );
}

function extractTokenFromRedirect(redirectUrl) {
  const tokenRegex = /access_token=([^&]+)/;
  const match = redirectUrl.match(tokenRegex);
  return match ? match[1] : null;
}

function saveToken(token) {
  chrome.storage.local.set({ [TOKEN_KEY]: token }, () => {
    console.log('Token stored:', token);
  });
}

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get([TOKEN_KEY], (result) => {
      resolve(result[TOKEN_KEY]);
    });
  });
}

function listEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  gmail.users.messages.list({ userId: 'me', maxResults: 10 }, (err, res) => {
    if (err) {
      console.error('The API returned an error:', err);
      return;
    }

    const emails = res.data.messages;
    if (emails && emails.length > 0) {
      emails.forEach(async (email) => {
        const message = await getEmail(auth, email.id);
        console.log('Email Data:', message);
        // Use the email data as needed
      });
    } else {
      console.log('No emails found.');
    }
  });
}

async function getEmail(auth, messageId) {
  const gmail = google.gmail({ version: 'v1', auth });

  return new Promise((resolve, reject) => {
    gmail.users.messages.get({ userId: 'me', id: messageId }, (err, res) => {
      if (err) {
        console.error('Error fetching email:', err);
        reject(err);
      }

      resolve(res.data);
    });
  });
}

// Execute the Gmail API request when the extension button is clicked
chrome.browserAction.onClicked.addListener(() => {
  getToken().then((token) => {
    if (token) {
      const oAuth2Client = new google.auth.OAuth2('225323746450-sr8fa46t7m91msnf95ogna7bl5u59gfa.apps.googleusercontent.com', '', '');
      oAuth2Client.setCredentials({ access_token: token });
      listEmails(oAuth2Client);
    } else {
      console.error('No valid token available. Please authenticate the extension.');
    }
  });
});
