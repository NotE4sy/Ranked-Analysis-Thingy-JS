// Variables
let gamemode = 0;

const matchCountLimit = 50;

// API urls
const Ranked_GetUser = "https://api.mcsrranked.com/users/";

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
async function call_Ranked_GetUser(ign) {
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
        console.error("ERROR: ", error);
    }
}

// Nameplate
const currentPath = window.location.pathname.slice(1);
if (currentPath) {
    PlayerName.textContent = decodeURIComponent(currentPath);
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + PlayerName.textContent + "/face";
    call_Ranked_GetUser(currentPath);
}

PlayerName.addEventListener("blur", function() {
    const text = PlayerName.innerText.trim();
    if (text) {
        history.pushState({}, '', '/' + encodeURIComponent(text));
    } else {
        history.pushState({}, '', '/');
    }
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
    call_Ranked_GetUser(text);
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
    gamemode = 0;
    console.log(gamemode);
})

RankedButton.addEventListener("mouseover", function() {
    if (gamemode == 1) {
        RankedButton.style.backgroundColor = "#354e66";
    }
})

RankedButton.addEventListener("mouseout", function() {
    if (gamemode == 1) {
        RankedButton.style.backgroundColor = "#202F3D";
    }
})

PrivateButton.addEventListener("mouseover", function() {
    if (gamemode == 0) {
        PrivateButton.style.backgroundColor = "#354e66";
    }
})

PrivateButton.addEventListener("mouseout", function() {
    if (gamemode == 0) {
        PrivateButton.style.backgroundColor = "#202F3D";
    }
})

PrivateButton.addEventListener("click", function() {
    PrivateButton.style.backgroundColor = "#507699";
    RankedButton.style.backgroundColor = "#202F3D";
    gamemode = 1;
    console.log(gamemode);
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