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

/**
 * Make API request
 * @param requestType: type of request, e.g. GET, POST, etc
 * @param url: url to request from
 * @param callback: callback function that processes data
 * @param expectedResponse: expected response from API
 * @param body: any parameters that need to be sent to the API
 */
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

/**
 * Map credentials
 * @param data: credentials retrieved from url as comma-separated string
 * @returns {Map<string, string>}: mapped credentials
 */
function setCredentials(data) {
    let map = new Map();
    for (let cred of data.split(', ')) {
        let kv = cred.split('=');
        map.set(kv[0], kv[1]);
        //TODO: handle token expiration edge-case - this only happens if user stays on page for more than an hour
        // NOTE: maybe add 'create another recommendation' button that reloads page with new auth
    }
    return map;
}

/**
 * Set seeds as session-specific var. Only run when custom seeds are used.
 * @param type: type of recommendation
 */
function setSeeds(type) {
    let params = {};
    let callback = function (content) {
        DATA_JSON = JSON.parse(content);
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