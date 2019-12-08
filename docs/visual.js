let SCHEME = [];
let SEED_COUNT = 0;
let LIMIT = 0;
let SEED_LENGTH = 0;
let LIMIT_BUTTON = "";

/**
 * Show recommendation scheme header when 'start' is clicked on spotirec index
 */
function start() {
    document.getElementById('scheme').hidden = false;
}

/**
 * Process selection if automatic scheme is selected. Seed count section is shown.
 * @param type: type of recommendation seed
 */
function processSchemeSelectAuto(type) {
    SCHEME = [['type', type], ['selection', 'auto']];

    // workaround to ensure scrolling on click
    document.getElementById('limitContinueAuto').hidden = false;
    LIMIT_BUTTON = 'limitContinueAuto';
    document.getElementById('seedCount').hidden = false;

    // retrieve seeds now to ensure they are ready
    setSeeds(SCHEME[0][1]);
}

/**
 * Process selection if automatic scheme is selected. Limit section is shown.
 * @param type: type of recommendation seed
 */
function processSchemeSelectCustom(type) {
    SCHEME = [['type', type], ['selection', 'custom']];

    // workaround to ensure scrolling on click
    document.getElementById('limitContinueCustom').hidden = false;
    LIMIT_BUTTON = 'limitContinueCustom';
    document.getElementById('limit').hidden = false;
    addLimitCheck();

    // retrieve seeds now to ensure they are ready
    setSeeds(SCHEME[0][1]);
}

/**
 * Set seed count session-specific var. Limit section is shown.
 * @param count
 */
function processSeedCount(count) {
    SEED_COUNT = count;
    document.getElementById('limit').hidden = false;
    addLimitCheck();
}

/**
 * Set limit session-specific var. If scheme is custom, seed selection section is shown, otherwise continue to
 * finalization.
 */
function processLimit() {
    LIMIT = parseInt(document.getElementById('trackCount').innerText);
    if (SCHEME[1][1] === 'custom') {
        document.getElementById('seeds').hidden = false;
        displaySeeds();
    } else {
        document.getElementById('finalize').hidden = false;
    }
}

/**
 * Display seeds as checkboxes on page.
 */
function displaySeeds() {
    let box = "";

    // 'any' (custom seed) is handled differently than the rest
    if (SCHEME[0][1] !== 'any') {
        let data;
        if (SCHEME[0][1] === 'artists' || SCHEME[0][1] === 'tracks') {
            SEED_LENGTH = DATA_JSON['items'].length;
            data = DATA_JSON['items'];
        } else {
            if (SCHEME[0][1] === 'genre-seeds') {
                SEED_LENGTH = DATA_JSON['genres'].length;
                data = DATA_JSON['genres'];
            } else {
                data = extractTopGenres();
                SEED_LENGTH = data.length;
            }
        }

        // loop through seeds and apply each as a column with a checkbox selection
        for (let i = 0; i < SEED_LENGTH; i += 3) {
            box += '<div class="row justify-content-center">';
            for (let j = 0; j < 3; j++) {

                // if index is out of bounds, break loop
                if ((i + j) >= SEED_LENGTH) {
                    box += '<div class="col-lg-3"></div>';
                    break;
                }

                let item = null;
                if (SCHEME[0][1] === 'artists' || SCHEME[0][1] === 'tracks') {
                    item = data[i + j]['name'];
                } else {
                    item = data[i + j];
                }
                box += '<div class="col-lg-3"><input type="checkbox" value="' + (i + j) + '" id="seed' + (i + j + 1) + '"/>' +
                    '<label for="seed' + (i + j + 1) + '" style="color:white;margin-left:5px">';

                // if name length is too long, trim
                if (item.length > 24) box += item.substring(0, 21) + '...';
                else box += item;
                box += '</label></div>';
            }
            box += '</div>'
        }

        document.getElementById('scrollBoxSeeds').innerHTML = box;

        // apply eventhandler to checkboxes that ensures 1-5 seeds are selected
        for (let i = 0; i < SEED_LENGTH; i++) {
            document.getElementById('seed' + (i + 1)).addEventListener('change', function () {
                if (isSelectionPresent()) {
                    document.getElementById('seedButton').className = 'btn btn-custom js-scroll-trigger';
                } else {
                    document.getElementById('seedButton').className = 'btn btn-custom js-scroll-trigger inactive';
                }
                isSeedSelectionMax();
            });
        }
    } else {
        for (let i = 0; i < 5; i++) {
            box += '<div class="col-lg-12 text-center" style="margin-top:1em">' +
                '<input type="text" id="seed' + (i + 1) + '"/></div>'
        }
        document.getElementById('seedHeader').innerText = 'Define your seeds';
        document.getElementById('scrollBoxSeeds').innerHTML = box;
        //TODO: add validity check for spotify uris or genres
    }
}

function extractTopGenres() {
    let genres = new Map();
    for (let artist of DATA_JSON['items']) {
        for (let genre of artist['genres']) {
            genre = genre.replace(' ', '-');
            if (GENRE_SEEDS.includes(genre)) {
                if (genres.hasOwnProperty(genre)) {
                    let count = genres.get(genre);
                    genres.set(genre, count + 1);
                } else {
                    genres.set(genre, 1);
                }
            }
        }
    }
    genres[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    };
    let genreArray = [];
    for (let genre of [...genres]) genreArray.push(genre[0]);
    DATA_JSON = genreArray;
    return genreArray;
}

function createPlaylist() {
    document.getElementById('finalize').hidden = false;
}

/**
 * Check if any checkbox is selected.
 * @returns {boolean}
 */
function isSelectionPresent() {
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === true) return true;
    }
    return false;
}

/**
 * Check if 5 checkboxes are checked. If 5 are checked, disable all unchecked checkboxes, otherwise enable all.
 */
function isSeedSelectionMax() {
    let seeds = 0;
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === true) seeds++;
        if (seeds === 5) setCheckboxDisabled(true);
        else setCheckboxDisabled(false);
    }
}

/**
 * Set unchecked checkboxes to input state.
 * @param state: boolean
 */
function setCheckboxDisabled(state) {
    for (let i = 0; i < SEED_LENGTH; i++) {
        if (document.getElementById('seed' + (i + 1)).checked === false)
            document.getElementById('seed' + (i + 1)).disabled = state;
    }
}

function addLimitCheck() {
    document.getElementById('trackCount').addEventListener('keyup', function () {
        let limit = parseInt(document.getElementById('trackCount').value);
        let error = document.getElementById('limitError');
        let limitButton = document.getElementById(LIMIT_BUTTON);
        if (isNaN(limit)) {
            error.innerText = 'Input value must be a number.';
            error.hidden = false;
            limitButton.className = 'btn btn-custom js-scroll-trigger inactive';
            return 0;
        }
        if (limit > 100 || limit < 0) {
            error.innerText = 'Input value must be in the range 1-100';
            error.hidden = false;
            limitButton.className = 'btn btn-custom js-scroll-trigger inactive';
        } else {
            error.hidden = true;
            limitButton.className = 'btn btn-custom js-scroll-trigger';
        }
    })
}