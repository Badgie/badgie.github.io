const OAUTH_AUTH_URL = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = '78ba9bb95f5b40a2b74bc7733ea3cd81';
//const REDIRECT_URL = 'https://badgie.github.io/docs/auth.html';
const REDIRECT_URL = 'http://localhost:63342/badgie.github.io/docs/auth.html';
const SCOPES = 'user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email ' +
    'ugc-image-upload user-read-playback-state user-modify-playback-state user-library-modify';

function auth() {
    let params = {'client_id': CLIENT_ID, 'response_type': 'token', 'redirect_uri': REDIRECT_URL, 'scope': SCOPES};
    let serialize = function () {
        let str = [];
        for (let field in params) {
            str.push(encodeURIComponent(field) + "=" + encodeURIComponent(params[field]))
        }
        return str.join('&')
    };
    window.open(OAUTH_AUTH_URL + "?" + serialize(), '_self');
}

function getCredentials() {
    let url = window.location.href;
    let credentials = url.split('#')[1].split('&');
    credentials[credentials.length] = 'expires_at=' + (Math.round(Date.now() / 1000) + 3600);
    document.cookie = credentials.join(', ');
    console.log(document.cookie);

}