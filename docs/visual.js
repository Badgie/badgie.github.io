let SCHEME = [];
let SEED_COUNT = 0;
let LIMIT = 0;
let SEED_LENGTH = 0;

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
    document.getElementById('limit').hidden = false;

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
    SEED_LENGTH = DATA_JSON['items'].length;

    // loop through seeds and apply each as a column with a checkbox selection
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

    // apply eventhandler to checkboxes that ensures 1-5 seeds are selected
    for (let i = 0; i < SEED_LENGTH; i++) {
        document.getElementById('seed' + (i + 1)).addEventListener('change', function() {
            if (isSelectionPresent()) document.getElementById('seedButton').className = 'btn btn-custom js-scroll-trigger';
            isSeedSelectionMax();
        });
    }
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