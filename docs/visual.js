let SCHEME = [];
let SEED_COUNT = 0;
let LIMIT = 0;
let SEED_LENGTH = 0;

function start() {
    document.getElementById('scheme').hidden = false;
}

function processSchemeSelectAuto(type) {
    document.getElementById('seedCount').hidden = false;
    SCHEME = [['type', type], ['selection', 'auto']];
    document.getElementById('limitContinueAuto').hidden = false;
    setSeeds(SCHEME[0][1]);
}

function processSchemeSelectCustom(type) {
    SCHEME = [['type', type], ['selection', 'custom']];
    document.getElementById('limitContinueCustom').hidden = false;
    document.getElementById('limit').hidden = false;
    setSeeds(SCHEME[0][1]);
}

function processSeedCount(count) {
    SEED_COUNT = count;
    document.getElementById('limit').hidden = false;
}

function processLimit() {
    LIMIT = parseInt(document.getElementById('trackCount').innerText);
    console.log(SCHEME);
    if (SCHEME[1][1] === 'custom') {
        document.getElementById('seeds').hidden = false;
        displaySeeds();
    } else {
        document.getElementById('finalize').hidden = false;
    }
}

function displaySeeds() {
    let box = "";
    SEED_LENGTH = DATA_JSON['items'].length;
    for (let i = 0; i < SEED_LENGTH; i += 2) {
        box += '<div class="row justify-content-center">';
        for (let j = 0; j < 2; j++) {
            if ((i + j) >= SEED_LENGTH) {
                box += '<div class="col-lg-6"></div>';
                break;
            }
            box += '<div class="col-lg-6"><input type="checkbox" value="' + (i + j) + '" id="seed' + (i + j + 1) + '"/><label for="seed' + (i + j + 1) + '" style="color:white;margin-left:5px">' + DATA_JSON['items'][i + j]['name'] +'</label></div>';
        }
        box += '</div>'
    }
    document.getElementById('scrollBoxSeeds').innerHTML = box;
    for (let i = 0; i < SEED_LENGTH; i++) {
        document.getElementById('seed' + (i + 1)).addEventListener('change', checkboxListener);
    }
}

function createPlaylist() {
    document.getElementById('finalize').hidden = false;
}

function checkboxListener() {
    if (isSelectionPresent()) document.getElementById('seedButton').className = 'btn btn-custom js-scroll-trigger';
    isSeedSelectionMax();
}

function isSelectionPresent() {
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === true) return true;
    }
    return false;
}

function isSeedSelectionMax() {
    let seeds = 0;
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === true) seeds++;
        if (seeds === 5) setCheckboxDisabled(true);
        else setCheckboxDisabled(false);
    }
}

function setCheckboxDisabled(state) {
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === false)
            document.getElementById('seed' + (i + 1)).disabled = state;
    }
}