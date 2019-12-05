const OAUTH_AUTH_URL = 'https://accounts.spotify.com/authorize';
const OAUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = '78ba9bb95f5b40a2b74bc7733ea3cd81';
const CLIENT_SECRET = 'a0189d34e14d44448ddd9ed71d46e6f7';
const REDIRECT_URL = 'https://badgie.github.io/docs/auth.html';
const SCOPES = 'user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email ' +
    'ugc-image-upload user-read-playback-state user-modify-playback-state user-library-modify';
let STATE = randomString(10);

function auth() {
    let params = {'client_id': CLIENT_ID, 'response_type': 'token', 'redirect_uri': REDIRECT_URL, 'scope': SCOPES, 'state': STATE};
    let serialize = function () {
        let str = [];
        for (let field in params) {
            str.push(encodeURIComponent(field) + "=" + encodeURIComponent(params[field]))
        }
        return str.join('&')
    };
    window.open(OAUTH_AUTH_URL + "?" + serialize(), '_self');
}

function getCode() {
    let url = window.location.href;
    let code = url.split('?code=')[1];
    let body = JSON.stringify({'grant_type': 'authorization_code', 'code': code, 'redirect_uri': REDIRECT_URL});
    let secret = btoa(CLIENT_ID + ':' + CLIENT_SECRET);
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            updateDatabase(JSON.parse(http.responseText));
        }
    };
    http.open('POST', OAUTH_TOKEN_URL, true);
    http.setRequestHeader('Authorization', 'Basic ' + secret);
    http.send(body);
}

function getCredentials() {
    let url = window.location.href;
    let credentials = url.split('#')[1].split('&');
    document.getElementById('yeet').innerHTML = credentials.join(', ')
}

function updateDatabase(token) {
    document.getElementById('yeet').innerHTML = token['access_token'] + ", " +
        token['token_type'] + ', ' +
        token['scope'] + ', ' +
        token['expires_in'] + ', ' +
        token['refresh_token'];
}

function randomString(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}