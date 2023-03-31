function initGoogleSignIn() {
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
    }).then(function() {
      renderGoogleSignInButton();
    });
  });
}

function renderGoogleSignInButton() {
  gapi.signin2.render('google-signin-button', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onGoogleSignInSuccess,
    'onfailure': onGoogleSignInFailure
  });
}

function onGoogleSignInSuccess(googleUser) {
  // Get the user's ID token and basic profile information.
  var id_token = googleUser.getAuthResponse().id_token;
  var profile = googleUser.getBasicProfile();

  console.log('ID Token: ' + id_token);
  console.log('Name: ' + profile.getName());
  console.log('Email: ' + profile.getEmail());
  // You can send the ID token to your server for further processing and user authentication.
}

function onGoogleSignInFailure(error) {
  console.log('Error signing in with Google:', error);
}

// Start the Google Sign-In process.
initGoogleSignIn();
