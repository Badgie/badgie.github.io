const URL_BASE = 'https://api.spotify.com/v1';
let HEADER_MAP = new Map();
let CREDENTIALS;
let DATA_JSON;

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

function request(requestType, url, callback, expectedResponse, body) {
    if (body === undefined) body = null;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === expectedResponse) {
            callback(xmlHttp.responseText);
        }};
    xmlHttp.open(requestType, url, true);
    HEADER_MAP.forEach(function(value, key, map) {
        xmlHttp.setRequestHeader(key, value)
    });
    xmlHttp.send(body);
}

function setCredentials(data) {
    let map = new Map();
    for (let cred of data.split(', ')) {
        let kv = cred.split('=');
        map.set(kv[0], kv[1]);
        //TODO: handle token expiration edge-case
    }
    return map;
}

function setSeeds(type) {
    let params = {};
    console.log(HEADER_MAP);
    let callback = function (content) {
        DATA_JSON = JSON.parse(content);
        console.log(DATA_JSON);
    };
    switch(type) {
        case 'artists':
            params = JSON.stringify({"limit": 50});
            request("GET", URL_BASE + "/me/top/artists", callback, 200, params);
            break;
        case 'tracks':
            params = JSON.stringify({"limit": 50});
            request("GET", URL_BASE + "/me/top/tracks", callback, 200, params);
            break;
        case 'genres':

            break;
        case 'genre-seeds':

            break;
        case 'any':

            break;
    }
}