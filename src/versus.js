// Home Button
BackButton.addEventListener("mouseover", function() {
    BackButton.style.backgroundColor = "#354e66";
})

BackButton.addEventListener("mouseout", function() {
    BackButton.style.backgroundColor = "#18232e";
})

BackButton.addEventListener("click", function() {
    BackButton.style.backgroundColor = "#507699";
    history.pushState({}, '', '/' + originalIGN);
    window.location.reload();
})

// Versus Nameplate
Versus_PlayerName1.addEventListener("blur", function() {
    const text = Versus_PlayerName1.value.trim();
    if (text == previousName || text == "") return;
    if (text) {
        history.pushState({}, '', '/versus?player1=' + text + "&player2=" + encodeURIComponent(versusIGN));
    } else {
        history.pushState({}, '', '/');
    }
    ign = text;
    previousName = text;
    Versus_PlayerName1.placeholder = Versus_PlayerName1.value;
    Versus_PlayerName1.value = "";
    Versus_PlayerModel1.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
    LoadingText.textContent = "Loading . .";
    call_Ranked_GetUser_Versus(Versus_PlayerName1, Versus_PbLabel1, Versus_WinRateLabel1, 0, ign);
    versus1ChangeStats();
})

Versus_PlayerName1.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Versus_PlayerName1.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        Versus_PlayerName1.value = ign;
        Versus_PlayerName1.blur();
    }
})

Versus_PlayerName2.addEventListener("blur", function() {
    const text = Versus_PlayerName2.value.trim();
    if (text == previousVersusIGN || text == "") return;
    if (text) {
        history.pushState({}, '', '/versus?player1=' + ign + "&player2=" + encodeURIComponent(text));
    } else {
        history.pushState({}, '', '/');
    }
    versusIGN = text;
    previousVersusIGN = text;
    Versus_PlayerName2.placeholder = Versus_PlayerName2.value;
    Versus_PlayerName2.value = "";
    Versus_PlayerModel2.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";
    LoadingText.textContent = "Loading . .";
    call_Ranked_GetUser_Versus(Versus_PlayerName2, Versus_PbLabel2, Versus_WinRateLabel2, 1, text);
    versus_call_Ranked_GetUserMatches();
})

Versus_PlayerName2.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Versus_PlayerName2.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        Versus_PlayerName2.value = previousVersusIGN;
        Versus_PlayerName2.blur();
    }
})

// Versus Match Count Sliders
Versus_MatchCount1.addEventListener("blur", function() {
    Versus_MatchCount1.style.backgroundColor = "#18232e";
    let newText = Versus_MatchCount1.value;
    if (newText == "") return;
    if (/^\d+$/.test(newText) == false) {
        // Has letters or number exceeds limit
        newText = "1";
    } else if (parseInt(newText) >= matchCountLimit) {
        newText = String(matchCountLimit);
    } else if (parseInt(newText) <= 0) {
        newText = "1";
    }
    Versus_MatchCount1.placeholder = newText;
    Versus_MatchCount1.value = "";
    if (parseInt(newText) == versus_previousMatchCount1) return;
    Versus_MatchCountSlider1.value = parseInt(newText);
    matchCount = parseInt(newText); 
    versus_previousMatchCount1 = parseInt(newText);
    versus1ChangeStats();
})

Versus_MatchCount1.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Versus_MatchCount1.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        Versus_MatchCount1.value = "";
        Versus_MatchCount1.blur();
    }
})

Versus_MatchCountSlider1.addEventListener("input", function() {
    Versus_MatchCount1.placeholder = Versus_MatchCountSlider1.value;
    matchCount = Versus_MatchCountSlider1.value;
})

Versus_MatchCountSlider1.addEventListener("mouseup", function() {
    if (Versus_MatchCountSlider1.value >= matchCountLimit) {
        Versus_MatchCountSlider1.value = matchCountLimit;
        matchCount = matchCountLimit;
        Versus_MatchCount1.placeholder = String(matchCountLimit);
    }
    if (Versus_MatchCountSlider1.value == versus_previousMatchCount1) return;
    versus_previousMatchCount1 = Versus_MatchCountSlider1.value;
    versus1ChangeStats();
})

Versus_MatchCountSlider1.addEventListener("touchend", function() {
    if (Versus_MatchCountSlider1.value >= matchCountLimit) {
        Versus_MatchCountSlider1.value = matchCountLimit;
        matchCount = matchCountLimit;
        Versus_MatchCount1.placeholder = String(matchCountLimit);
    }
    if (Versus_MatchCountSlider1.value == versus_previousMatchCount1) return;
    versus_previousMatchCount1 = Versus_MatchCountSlider1.value;
    versus1ChangeStats();
})

Versus_MatchCount2.addEventListener("blur", function() {
    Versus_MatchCount2.style.backgroundColor = "#18232e";
    let newText = Versus_MatchCount2.value;
    if (newText == "") return;
    if (/^\d+$/.test(newText) == false) {
        // Has letters or number exceeds limit
        newText = "1";
    } else if (parseInt(newText) > matchCountLimit) {
        newText = String(matchCountLimit);
    } else if (parseInt(newText) <= 0) {
        newText = "1";
    }
    Versus_MatchCount2.placeholder = newText;
    Versus_MatchCount2.value = "";
    if (parseInt(newText) == versus_previousMatchCount2) return;
    Versus_MatchCountSlider2.value = parseInt(newText);
    versus_matchCount2 = parseInt(newText);
    versus_previousMatchCount2 = parseInt(newText);
    versus_call_Ranked_GetUserMatches();
})

Versus_MatchCount2.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Versus_MatchCount2.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        Versus_MatchCount2.value = "";
        Versus_MatchCount2.blur();
    }
})

Versus_MatchCountSlider2.addEventListener("input", function() {
    Versus_MatchCount2.placeholder = Versus_MatchCountSlider2.value;
    versus_matchCount2 = Versus_MatchCountSlider2.value;
})

Versus_MatchCountSlider2.addEventListener("mouseup", function() {
    if (Versus_MatchCountSlider2.value >= matchCountLimit) {
        Versus_MatchCountSlider2.value = matchCountLimit;
        versus_matchCount2 = matchCountLimit;
        Versus_MatchCount2.placeholder = String(matchCountLimit);
    }
    if (Versus_MatchCountSlider2.value == versus_previousMatchCount2) return;
    versus_previousMatchCount2 = Versus_MatchCountSlider2.value;
    versus_call_Ranked_GetUserMatches();
})

Versus_MatchCountSlider2.addEventListener("touchend", function() {
    if (Versus_MatchCountSlider2.value >= matchCountLimit) {
        Versus_MatchCountSlider2.value = matchCountLimit;
        versus_matchCount2 = matchCountLimit;
        Versus_MatchCount2.placeholder = String(matchCountLimit);
    }
    if (Versus_MatchCountSlider2.value == versus_previousMatchCount2) return;
    versus_previousMatchCount2 = Versus_MatchCountSlider2.value;
    versus_call_Ranked_GetUserMatches();
})

// Versus Button
VersusButton.addEventListener("mouseover", function() {
    if (!versusToggle) {
        VersusButton.style.backgroundColor = "#354e66";
    }
})

VersusButton.addEventListener("mouseout", function() {
    if (!versusToggle) {
        VersusButton.style.backgroundColor = "#202F3D";
    }
})

VersusButton.addEventListener("click", function() {
    versusToggle = !versusToggle;
    if (versusToggle) {
        VersusButton.style.backgroundColor = "#507699";
        VersusSearchText.textContent = "(Search for player 2)";
        dataSection.style.display = "none";
        VersusSearch.style.display = "block";
    } else {
        VersusSearch.style.display = "none";
        VersusButton.style.backgroundColor = "#202F3D";
        dataSection.style.display = "block";
    }
})

//Versus Search
VersusSearchText.addEventListener("blur", async function() {
    const text = VersusSearchText.value.trim();
    originalIGN = ign;

    if (text == "") return;
    if (text) {
        randomiseParrot(0);
        loadingText.textContent = "Loading . .";
        loadingText.style.marginTop = "40%";

        LoadingText.style.display = "block";
        LoadingParrot.style.display = "inline";

        history.pushState({}, '', '/versus?player1=' + ign + "&player2=" + encodeURIComponent(text));
        Nameplate.style.display = "none";
        configUI.style.display = "none";
        VersusSearch.style.display = "none";

        versus_matchCount2 = defaultMatchCount;
        versus_previousMatchCount1 = matchCount;
        versus_previousMatchCount2 = defaultMatchCount;

        Versus_MatchCount1.textContent = matchCount;
        Versus_MatchCount2.textContent = versus_matchCount2;
        Versus_MatchCountSlider1.value = matchCount;
        Versus_MatchCountSlider2.value = versus_matchCount2;

        versus_gamemode2 = gamemode;

        Versus_GamemodeButton1.innerHTML = gamemodes[gamemode - 1] + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>"
        Versus_GamemodeButton2.innerHTML = gamemodes[gamemode - 1] + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>"

        for (let i = 0; i < Versus_GamemodeItems1.length; i++) {
            if (Versus_GamemodeItems1[i].textContent == Versus_GamemodeButton1.textContent) {
                Versus_GamemodeItems1[i].style.backgroundColor = "#507699";
            } else {
                Versus_GamemodeItems1[i].style.backgroundColor = "#18232e";
            }
        }

        for (let i = 0; i < Versus_GamemodeItems2.length; i++) {
            if (Versus_GamemodeItems2[i].textContent == Versus_GamemodeButton2.textContent) {
                Versus_GamemodeItems2[i].style.backgroundColor = "#507699";
            } else {
                Versus_GamemodeItems2[i].style.backgroundColor = "#18232e";
            }
        }

        Versus_PlayerModel1.src = "https://starlightskins.lunareclipse.studio/render/default/" + ign + "/face";
        Versus_PlayerModel2.src = "https://starlightskins.lunareclipse.studio/render/default/" + text + "/face";

        call_Ranked_GetUser_Versus(Versus_PlayerName1, Versus_PbLabel1, Versus_WinRateLabel1, 0, ign);
        call_Ranked_GetUser_Versus(Versus_PlayerName2, Versus_PbLabel2, Versus_WinRateLabel2, 1, text);
        versusIGN = text;
        previousVersusIGN = text;
        await versus_call_Ranked_GetUserMatches();

        BackButton.style.display = "block";

        Versus_NameplatePlayer1.style.display = "block";
        Versus_NameplatePlayer2.style.display = "block";

        Versus_Config1.style.display = "inline-flex";
        Versus_Config2.style.display = "inline-flex";

        Versus_Data1.style.display = "block";
        Versus_Data2.style.display = "block";

        LoadingText.style.display = "none";
        LoadingParrot.style.display = "none";
    } else {
        history.pushState({}, '', '/' + ign);
    }
})

VersusSearchText.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        VersusSearchText.blur();
    }

    if (event.key == "Escape") {
        event.preventDefault();
        VersusSearchText.value = "";
        VersusSearchText.blur();
    }
})

// Versus 1 Gamemode Button
Versus_GamemodeButton1.addEventListener("click", function() {
    Versus_GamemodeButton1.style.backgroundColor = "#507699";
    if (Versus_GamemodeContent1.style.display == "block") {
        Versus_GamemodeContent1.style.display = "none";
        gamemodeColorLock = false;
        Versus_GamemodeButton1.style.backgroundColor = "#354e66";
        Versus_GamemodeButton1.innerHTML = Versus_GamemodeButton1.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    } else {
        Versus_GamemodeContent1.style.display = "block";
        gamemodeColorLock = true;
        Versus_GamemodeButton1.innerHTML = Versus_GamemodeButton1.textContent + '<i style="float: right;margin-top: 6px;" class="arrow up"></i>';
    }
})

Versus_GamemodeButton1.addEventListener("mouseover", function() {
    versus_gamemodeButtonHover1 = true;
    if (!versus_gamemodeColorLock1) {
        Versus_GamemodeButton1.style.backgroundColor = "#354e66";
    }
})

Versus_GamemodeButton1.addEventListener("mouseout", function() {
    versus_gamemodeButtonHover1 = false;
    if (!versus_gamemodeColorLock1) {
        Versus_GamemodeButton1.style.backgroundColor = "#202F3D";
    }
})

Versus_GamemodeContent1.addEventListener("mouseover", function() {
    versus_gamemodeContentHover1 = true;
})

Versus_GamemodeContent1.addEventListener("mouseout", function() {
    versus_gamemodeContentHover1 = false;
})

// Versus 1 Gamemode Items
for (let i = 0; i < Versus_GamemodeItems1.length; i++) {
    if (Versus_GamemodeItems1[i].textContent == Versus_GamemodeButton1.textContent) {
        Versus_GamemodeItems1[i].style.backgroundColor = "#507699";
    }

    Versus_GamemodeItems1[i].addEventListener("mouseover", function() {
        if (i + 1 != gamemode) {
            Versus_GamemodeItems1[i].style.backgroundColor = "#354e66";
        }
    })

    Versus_GamemodeItems1[i].addEventListener("mouseout", function() {
        if (i + 1 != gamemode) {
            Versus_GamemodeItems1[i].style.backgroundColor = "#18232e";
        }
    })

    Versus_GamemodeItems1[i].addEventListener("click", function() {
        versus_gamemodeColorLock1 = false;
        versus_gamemodeContentHover1 = false;
        Versus_GamemodeContent1.style.display = "none";
        Versus_GamemodeButton1.style.backgroundColor = "#202F3D";
        Versus_GamemodeButton1.innerHTML = Versus_GamemodeButton1.textContent + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        if (i + 1 == gamemode) return;
        Versus_GamemodeItems1[i].style.backgroundColor = "#507699";
        Versus_GamemodeItems1[gamemode - 1].style.backgroundColor = "#18232e";
        gamemode = i + 1; // Surely this works prayge
        Versus_GamemodeButton1.innerHTML = gamemodes[i] + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        versus1ChangeStats();
    })
}

// Versus 2 Gamemode Button
Versus_GamemodeButton2.addEventListener("click", function() {
    Versus_GamemodeButton2.style.backgroundColor = "#507699";
    if (Versus_GamemodeContent2.style.display == "block") {
        Versus_GamemodeContent2.style.display = "none";
        gamemodeColorLock = false;
        Versus_GamemodeButton2.style.backgroundColor = "#354e66";
        Versus_GamemodeButton2.innerHTML = Versus_GamemodeButton2.textContent + '<i style="float: right;margin-top: 3px;" class="arrow down"></i>';
    } else {
        Versus_GamemodeContent2.style.display = "block";
        gamemodeColorLock = true;
        Versus_GamemodeButton2.innerHTML = Versus_GamemodeButton2.textContent + '<i style="float: right;margin-top: 6px;" class="arrow up"></i>';
    }
})

Versus_GamemodeButton2.addEventListener("mouseover", function() {
    versus_gamemodeButtonHover2 = true;
    if (!versus_gamemodeColorLock2) {
        Versus_GamemodeButton2.style.backgroundColor = "#354e66";
    }
})

Versus_GamemodeButton2.addEventListener("mouseout", function() {
    versus_gamemodeButtonHover2 = false;
    if (!versus_gamemodeColorLock2) {
        Versus_GamemodeButton2.style.backgroundColor = "#202F3D";
    }
})

Versus_GamemodeContent2.addEventListener("mouseover", function() {
    versus_gamemodeContentHover2 = true;
})

Versus_GamemodeContent2.addEventListener("mouseout", function() {
    versus_gamemodeContentHover2 = false;
})

// Versus 2 Gamemode Items
for (let i = 0; i < Versus_GamemodeItems2.length; i++) {
    if (Versus_GamemodeItems2[i].textContent == Versus_GamemodeButton2.textContent) {
        Versus_GamemodeItems2[i].style.backgroundColor = "#507699";
    }

    Versus_GamemodeItems2[i].addEventListener("mouseover", function() {
        if (i + 1 != versus_gamemode2) {
            Versus_GamemodeItems2[i].style.backgroundColor = "#354e66";
        }
    })

    Versus_GamemodeItems2[i].addEventListener("mouseout", function() {
        if (i + 1 != versus_gamemode2) {
            Versus_GamemodeItems2[i].style.backgroundColor = "#18232e";
        }
    })

    Versus_GamemodeItems2[i].addEventListener("click", function() {
        versus_gamemodeColorLock2 = false;
        versus_gamemodeContentHover2 = false;
        Versus_GamemodeContent2.style.display = "none";
        Versus_GamemodeButton2.style.backgroundColor = "#202F3D";
        Versus_GamemodeButton2.innerHTML = Versus_GamemodeButton2.textContent + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        if (i + 1 == versus_gamemode2) return;
        Versus_GamemodeItems2[i].style.backgroundColor = "#507699";
        Versus_GamemodeItems2[versus_gamemode2 - 1].style.backgroundColor = "#18232e";
        versus_gamemode2 = i + 1; // Surely this works prayge
        Versus_GamemodeButton2.innerHTML = gamemodes[i] + "<i style='float: right;margin-top: 3px;' class='arrow down'></i>";
        versus_call_Ranked_GetUserMatches();
    })
}