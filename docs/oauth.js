OAUTH_AUTH_URL = 'https://accounts.spotify.com/authorize';
OAUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
CLIENT_ID = '78ba9bb95f5b40a2b74bc7733ea3cd81';
CLIENT_SECRET = 'a0189d34e14d44448ddd9ed71d46e6f7';
REDIRECT_URL = 'https://badgie.github.io/docs/auth.html';
SCOPES = 'user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email ' +
    'ugc-image-upload user-read-playback-state user-modify-playback-state user-library-modify';

function auth() {
    let params = {'client_id': CLIENT_ID, 'response_type': 'code', 'redirect_uri': REDIRECT_URL, 'scope': SCOPES};
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
    //let http = new XMLHttpRequest();
    $.ajax({
        type: 'post',
        url: OAUTH_TOKEN_URL,
        contentType: 'application/json',
        data: body,
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', 'Basic ' + secret);
        },
        success: function (result) {
            updateDatabase(result);
        },
        async: true
    });
    /*http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            updateDatabase(JSON.parse(http.responseText));
        }
    };
    http.open('POST', OAUTH_TOKEN_URL, true);
    http.setRequestHeader('Authorization', 'Basic ' + secret);
    http.send(body);*/
}

function updateDatabase(token) {
    document.getElementById('yeet').innerHTML = token['access_token'] + ", " +
        token['token_type'] + ', ' +
        token['scope'] + ', ' +
        token['expires_in'] + ', ' +
        token['refresh_token'];
}