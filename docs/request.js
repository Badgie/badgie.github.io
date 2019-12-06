const URL_BASE = 'https://api.spotify.com/v1';
let HEADER_MAP = new Map();
let CREDENTIALS = setCredentials();
HEADER_MAP.set("Authorization", "Bearer " + CREDENTIALS.get('access_token'));

function topList(topType) {
    let params = JSON.stringify({"limit": 50});
    let topList = null;
    let callback = function (data) {
         topList = JSON.parse(data);
    };
    request("GET", URL_BASE + "/me/top/" + topType, callback, 200, params);
    console.log(topList);
    return topList;
}

function userID() {
    let callback = function (data) {

    };
    request('GET', URL_BASE + '/me', callback, 200);
}

function parseResponse(data) {
    let json = JSON.parse(data);
    for (let obj of json['items']) {
        document.getElementById('yeet').innerHTML += obj['name'] + ", "
    }
}

function request(requestType, url, callback, expectedResponse, body) {
    if (body === undefined) body = null;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === expectedResponse)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open(requestType, url, true);
    HEADER_MAP.forEach(function(value, key, map) {
        xmlHttp.setRequestHeader(key, value)
    });
    xmlHttp.send(body);
}

function setCredentials() {
    let cookie = document.cookie;
    let map = new Map();
    for (let cred of cookie.split(', ')) {
        let kv = cred.split('=');
        map.set(kv[0], kv[1]);
        //TODO: handle token expiration edge-case
    }
    return map;
}