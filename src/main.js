// On Page load (if in a subdirectory)
const currentPath = window.location.pathname.slice(1);
console.log(window.location.pathname.slice(1));

if (currentPath && currentPath != "versus") {
    ign = currentPath;
    previousName = ign;
    PlayerName.value = decodeURIComponent(currentPath);
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + PlayerName.value + "/face";
    call_Ranked_GetUser();
    call_Ranked_GetUserMatches_External();
} else if (currentPath == "versus") {
    const searchQuery = window.location.search;
    const keywords = searchQuery.split(/[ ?&=]+/);

    if (!searchQuery || keywords[1] != "player1" || keywords[3] != "player2") {
        history.pushState({}, '', '/');
        window.location.reload();
    }

    accessVersusByURL(keywords[2], keywords[4]);    
} else {
    history.pushState({}, '', '/');
    dataSection.style.display = "none";
    configUI.style.display = "none";
    LoadingText.style.display = "block";
    LoadingText.textContent = "Type ign in (search for player) field to search";
    PageTitle.textContent = "Home | Ranked Analysis";
}

// Nameplate
PlayerName.addEventListener("blur", function() {
    const text = PlayerName.value.trim();
    if (text == previousName || text == "") return;
    if (text) {
        history.pushState({}, '', '/' + encodeURIComponent(text));
    } else {
        history.pushState({}, '', '/');
    }
    ign = encodeURIComponent(text);
    previousName = encodeURIComponent(text);
    PlayerName.placeholder = PlayerName.value;
    PlayerName.value = "";
    PlayerModel.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
    dataSection.style.display = "block";
    versusToggle = false;
    VersusSearch.style.display = "none";
    VersusButton.style.backgroundColor = "#202F3D";
    call_Ranked_GetUser();
    call_Ranked_GetUserMatches_External();
})

PlayerName.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        PlayerName.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        playerName.value = ign;
        playerName.blur();
    }
})

// Seed Type Button
SeedTypeButton.addEventListener("mouseover", function() {
    seedTypeButtonHover = true
    if (!seedTypeButtonColorLock) {
        SeedTypeButton.style.backgroundColor = "#354e66";
    }
})

SeedTypeButton.addEventListener("mouseout", function() {
    seedTypeButtonHover = false
    if (!seedTypeButtonColorLock) {
        SeedTypeButton.style.backgroundColor = "#202F3D";
    }
})

SeedTypeButton.addEventListener("click", function() {
    SeedTypeButton.style.backgroundColor = "#507699";
    if (SeedTypeContent.style.display == "block") {
        SeedTypeContent.style.display = "none";
        seedTypeButtonColorLock = false;
        seedTypeButton.style.backgroundColor = "#354e66";
    } else {
        SeedTypeContent.style.display = "block";
        seedTypeButtonColorLock = true;
    }
})

SeedTypeContent.addEventListener("mouseover", function() {
    seedTypeContentHover = true;
})

SeedTypeContent.addEventListener("mouseout", function() {
    seedTypeContentHover = false;
})

// Gamemode button
GamemodeButton.addEventListener("click", function() {
    GamemodeButton.style.backgroundColor = "#507699";
    if (GamemodeContent.style.display == "block") {
        GamemodeContent.style.display = "none";
        gamemodeColorLock = false;
        GamemodeButton.style.backgroundColor = "#354e66";
        GamemodeButton.innerHTML = GamemodeButton.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    } else {
        GamemodeContent.style.display = "block";
        gamemodeColorLock = true;
        GamemodeButton.innerHTML = GamemodeButton.textContent + '<i style="float: right;margin-top: 6px;" class="arrow up"></i>';
    }
})

GamemodeButton.addEventListener("mouseover", function() {
    gamemodeButtonHover = true;
    if (!gamemodeColorLock) {
        GamemodeButton.style.backgroundColor = "#354e66";
    }
})

GamemodeButton.addEventListener("mouseout", function() {
    gamemodeButtonHover = false;
    if (!gamemodeColorLock) {
        GamemodeButton.style.backgroundColor = "#202F3D";
    }
})

GamemodeContent.addEventListener("mouseover", function() {
    gamemodeContentHover = true;
})

GamemodeContent.addEventListener("mouseout", function() {
    gamemodeContentHover = false;
})

// Seed Type Items
for (let i = 0; i < SeedTypeItems.length; i++) {
    if (SeedTypeItems[i].querySelector("img").src == SeedTypeButton.querySelector("img").src) {
        SeedTypeItems[i].style.backgroundColor = "#507699";
    }

    SeedTypeItems[i].addEventListener("mouseover", function() {
        if (SeedTypeItems[i].querySelector("img").src != SeedTypeButton.querySelector("img").src) {
            SeedTypeItems[i].style.backgroundColor = "#354e66";
        }
    })

    SeedTypeItems[i].addEventListener("mouseout", function() {
        if (SeedTypeItems[i].querySelector("img").src != SeedTypeButton.querySelector("img").src) {
            SeedTypeItems[i].style.backgroundColor = "#18232e";
        }
    })

    SeedTypeItems[i].addEventListener("click", function() {
        seedTypeButtonColorLock = false;
        seedTypeButtonHover = false;
        SeedTypeContent.style.display = "none";
        SeedTypeButton.style.backgroundColor = "#202F3D";
        if (i == seedType[0]) return;
        SeedTypeItems[i].style.backgroundColor = "#507699";
        SeedTypeItems[seedType[0]].style.backgroundColor = "#18232e"
        seedType[0] = i;
        switch (i) {
            case 0:
                seedType[1] = "ALL";
                break;
            case 1:
                seedType[1] = "BURIED_TREASURE";
                break;
            case 2:
                seedType[1] = "VILLAGE";
                break;
            case 3:
                seedType[1] = "SHIPWRECK";
                break;
            case 4:
                seedType[1] = "DESERT_TEMPLE";
                break;
            case 5:
                seedType[1] = "RUINED_PORTAL";
                break;
        }
        displayStatsBySeedType();   
        SeedTypeButton.querySelector("img").src = SeedTypeItems[i].querySelector("img").src;
    })
}

// Gamemode Items
for (let i = 0; i < GamemodeItems.length; i++) {
    if (GamemodeItems[i].textContent == GamemodeButton.textContent) {
        GamemodeItems[i].style.backgroundColor = "#507699";
    }

    GamemodeItems[i].addEventListener("mouseover", function() {
        if (i + 1 != gamemode) {
            GamemodeItems[i].style.backgroundColor = "#354e66";
        }
    })

    GamemodeItems[i].addEventListener("mouseout", function() {
        if (i + 1 != gamemode) {
            GamemodeItems[i].style.backgroundColor = "#18232e";
        }
    })

    GamemodeItems[i].addEventListener("click", function() {
        gamemodeColorLock = false;
        gamemodeContentHover = false;
        GamemodeContent.style.display = "none";
        GamemodeButton.style.backgroundColor = "#202F3D";
        GamemodeButton.innerHTML = GamemodeButton.textContent + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        if (i + 1 == gamemode) return;
        GamemodeItems[i].style.backgroundColor = "#507699";
        GamemodeItems[gamemode - 1].style.backgroundColor = "#18232e";
        gamemode = i + 1; // Surely this works prayge
        GamemodeButton.innerHTML = gamemodes[i] + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        configureInVersusMode()
        call_Ranked_GetUserMatches_External();
    })
}

document.addEventListener("keydown", function(event) {
    if (event.key == "Escape") {
        if (GamemodeContent.style.display == "block") {
            event.preventDefault();
            GamemodeContent.style.display = "none";
            gamemodeColorLock = false;
            GamemodeButton.style.backgroundColor = "#202F3D";
            GamemodeButton.innerHTML = GamemodeButton.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
        }
        if (Versus_GamemodeContent1.style.display == "block") {
            event.preventDefault();
            Versus_GamemodeContent1.style.display = "none";
            versus_gamemodeColorLock1 = false;
            Versus_GamemodeButton1.style.backgroundColor = "#202F3D";
            Versus_GamemodeButton1.innerHTML = Versus_GamemodeButton1.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
        }
        if (Versus_GamemodeContent2.style.display == "block") {
            event.preventDefault();
            Versus_GamemodeContent2.style.display = "none";
            versus_gamemodeColorLock2 = false;
            Versus_GamemodeButton2.style.backgroundColor = "#202F3D";
            Versus_GamemodeButton2.innerHTML = Versus_GamemodeButton2.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
        }
    }
})

document.addEventListener("mouseup", function(event) {
    if (GamemodeContent.style.display == "block" && !gamemodeContentHover && !gamemodeButtonHover) {
        GamemodeContent.style.display = "none";
        gamemodeColorLock = false;
        GamemodeButton.style.backgroundColor = "#202F3D";
        GamemodeButton.innerHTML = GamemodeButton.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    }
    if (Versus_GamemodeContent1.style.display == "block" && !versus_gamemodeContentHover1 && !versus_gamemodeButtonHover1) {
        Versus_GamemodeContent1.style.display = "none";
        versus_gamemodeColorLock1 = false;
        Versus_GamemodeButton1.style.backgroundColor = "#202F3D";
        Versus_GamemodeButton1.innerHTML = Versus_GamemodeButton1.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    }
    if (Versus_GamemodeContent2.style.display == "block" && !versus_gamemodeContentHover2 && !versus_gamemodeButtonHover2) {
        Versus_GamemodeContent2.style.display = "none";
        versus_gamemodeColorLock2 = false;
        Versus_GamemodeButton2.style.backgroundColor = "#202F3D";
        Versus_GamemodeContent2.innerHTML = Versus_GamemodeContent2.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    }
})

// Match Count Slider
MatchCount.addEventListener("blur", function() {
    MatchCount.style.backgroundColor = "#18232e";
    let newText = MatchCount.value;
    if (newText == "") return;
    if (/^\d+$/.test(newText) == false) {
        // Has letters or number exceeds limit
        newText = "1";
    } else if (parseInt(newText) >= matchCountLimit) {
        newText = String(matchCountLimit);
    } else if (parseInt(newText) <= 0) {
        newText = "1";
    }
    if (parseInt(newText) == previousMatchCount) return;
    MatchCountSlider.value = parseInt(newText);
    previousMatchCount = parseInt(newText);
    matchCount = parseInt(newText);
    MatchCount.placeholder = newText;
    MatchCount.value = "";
    configureInVersusMode()
    call_Ranked_GetUserMatches_External();
})

MatchCount.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        MatchCount.blur();
    }
    if (event.key == "Escape") {
        event.preventDefault();
        MatchCount.value = "";
        MatchCount.blur();
    }
})

MatchCountSlider.addEventListener("input", function() {
    MatchCount.placeholder = MatchCountSlider.value;
    matchCount = matchCountSlider.value;
})

MatchCountSlider.addEventListener("mouseup", function() {
    if (MatchCountSlider.value >= matchCountLimit) {
        MatchCountSlider.value = matchCountLimit;
        matchCount = matchCountLimit;
        MatchCount.placeholder = String(matchCountLimit);
    }
    if (MatchCountSlider.value == previousMatchCount) return;
    previousMatchCount = MatchCountSlider.value;
    configureInVersusMode()
    call_Ranked_GetUserMatches_External();
})

MatchCountSlider.addEventListener("touchend", function() {
    if (MatchCountSlider.value >= matchCountLimit) {
        MatchCountSlider.value = matchCountLimit;
        matchCount = matchCountLimit;
        MatchCount.placeholder = String(matchCountLimit);
    }
    if (MatchCountSlider.value == previousMatchCount) return;
    previousMatchCount = matchCountSlider.value;
    configureInVersusMode()
    call_Ranked_GetUserMatches_External();
})