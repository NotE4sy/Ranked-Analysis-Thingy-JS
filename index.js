// Variables
let gamemode = 2; // 2 = ranked, 3 = private
let previousName = "Type ign to search";
let matchCount = 20;
let ign = "Type ign to search";

const matchCountLimit = 50;

// API urls
const Ranked_GetUser = "https://api.mcsrranked.com/users/";
const Ranked_GetUserMatches = "/matches?type=" + gamemode + "&count=";

// Elements
const PlayerName = document.getElementById("playerName");
const PbLabel = document.getElementById("pbLabel");
const WinRateLabel = document.getElementById("winRateLabel");
const PlayerModel = document.getElementById("playerModel");

const RankedButton = document.getElementById("Ranked");
const PrivateButton = document.getElementById("Private");

const MatchCount = document.getElementById("MatchCount");
const MatchCountSlider = document.getElementById("matchCountSlider");

// Misc functions
function msToMinSecs(ms) {
    let mins = ms / 60000;
    let secs = parseInt(60 * (mins - parseInt(mins)));
    if (secs < 10) {
        return String(parseInt(mins)) + ":0" + String(secs);
    }

    return String(parseInt(mins)) + ":" + String(secs);
}

// Calling APIs
async function call_Ranked_GetUserMatches() {
    try {
        const response = await fetch(Ranked_GetUser + ign + Ranked_GetUserMatches + matchCount);
        const statusCode = response.status;

        if (statusCode != 200) {
            return;
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetUserMatches': ", error);
    }
}

async function call_Ranked_GetUser() {
    try {
        const response = await fetch(Ranked_GetUser + ign);
        const statusCode = response.status;

        if (statusCode != 200) {
            return;
        }

        const data = await response.json();
        const pb = data["data"]["statistics"]["season"]["bestTime"]["ranked"];
        const wins = data["data"]["statistics"]["season"]["wins"]["ranked"];
        const losses = data["data"]["statistics"]["season"]["loses"]["ranked"];

        WinRateLabel.textContent = "W/L%: " + (wins / (wins + losses) * 100).toFixed(1) + "%";
        PbLabel.textContent = "PB: " + msToMinSecs(pb);
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetUser': ", error);
    }
}

// Nameplate
const currentPath = window.location.pathname.slice(1);
if (currentPath) {
    ign = currentPath;
    PlayerName.textContent = decodeURIComponent(currentPath);
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + PlayerName.textContent + "/face";
    call_Ranked_GetUser();
}

PlayerName.addEventListener("blur", function() {
    const text = PlayerName.innerText.trim();
    if (text == previousName) return;
    if (text) {
        history.pushState({}, '', '/' + encodeURIComponent(text));
    } else {
        history.pushState({}, '', '/');
    }
    ign = text;
    previousName = text;
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
    call_Ranked_GetUser();
    call_Ranked_GetUserMatches();
})

PlayerName.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        PlayerName.blur();
    }  
})

// Gamemode buttons
RankedButton.style.backgroundColor = "#507699";

RankedButton.addEventListener("click", function() {
    RankedButton.style.backgroundColor = "#507699";
    PrivateButton.style.backgroundColor = "#202F3D";
    gamemode = 2;
})

RankedButton.addEventListener("mouseover", function() {
    if (gamemode == 3) {
        RankedButton.style.backgroundColor = "#354e66";
    }
})

RankedButton.addEventListener("mouseout", function() {
    if (gamemode == 3) {
        RankedButton.style.backgroundColor = "#202F3D";
    }
})

PrivateButton.addEventListener("mouseover", function() {
    if (gamemode == 2) {
        PrivateButton.style.backgroundColor = "#354e66";
    }
})

PrivateButton.addEventListener("mouseout", function() {
    if (gamemode == 2) {
        PrivateButton.style.backgroundColor = "#202F3D";
    }
})

PrivateButton.addEventListener("click", function() {
    PrivateButton.style.backgroundColor = "#507699";
    RankedButton.style.backgroundColor = "#202F3D";
    gamemode = 3;
})

// Match Count Slider
MatchCount.addEventListener("blur", function() {
    let newText = this.textContent;
    if (/^\d+$/.test(newText) == false || parseInt(newText) > matchCountLimit) {
        // Has letters or number exceeds limit
        newText = "1";
    }
    MatchCountSlider.value = parseInt(newText);
    this.textContent = newText;
})

MatchCount.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        MatchCount.blur();
    }
})

MatchCountSlider.addEventListener("input", function() {
    MatchCount.textContent = MatchCountSlider.value;
})