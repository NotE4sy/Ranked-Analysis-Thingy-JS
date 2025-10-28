// Variables
let gamemode = 0;

const matchCountLimit = 50;

// Elements
const PlayerName = document.getElementById("playerName");
const PlayerModel = document.getElementById("playerModel");

const RankedButton = document.getElementById("Ranked");
const PrivateButton = document.getElementById("Private");

const MatchCount = document.getElementById("MatchCount");
const MatchCountSlider = document.getElementById("matchCountSlider");

// Nameplate
const currentPath = window.location.pathname.slice(1);
if (currentPath) {
    PlayerName.textContent = decodeURIComponent(currentPath);
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + PlayerName.textContent + "/face";
}

PlayerName.addEventListener("blur", function() {
    const text = PlayerName.innerText.trim();
    if (text) {
        history.pushState({}, '', '/' + encodeURIComponent(text));
    } else {
        history.pushState({}, '', '/');
    }
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
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