const URL_BASE = 'https://api.spotify.com/v1';
let HEADER_MAP = new Map();
HEADER_MAP.set("Authorization", "Bearer BQA-kv2sIdN-ElA1thEk51phDZFXCTt0Hp_5UjxqLIKHm0E3RnU690LJS3G3OG36tPZEbB5Few6TYPdNso7xaNkiNTz_91nIjuE9RRGc0ZY2ZKdOSZdNhI77GvFO3b9y01nUCKPr70VlHQSss3TK4D2rEMv051eoQXT2R4eC15ymmZlEjAFoOzsQ0GTyRH_E-Io_vs1ULzi51NEc9iwC03JKdQbhw2bRLHTuLG8Lr4DjnQ");

function topList(topType) {
    let params = JSON.stringify({"limit": 50});
    let callback = function (data) {
         parseResponse(data)
    };
    request("GET", URL_BASE + "/me/top/" + topType, callback, 200, params);
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
