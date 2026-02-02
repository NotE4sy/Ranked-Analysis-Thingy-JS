function msToMinSecs(ms) {
    let mins = ms / 60000;
    let secs = parseInt(60 * (mins - parseInt(mins)));

    if (isNaN(mins) || isNaN(secs)) {
        return "N/A";
    }

    if (secs < 10) {
        return String(parseInt(mins)) + ":0" + String(secs);
    }

    return String(parseInt(mins)) + ":" + String(secs);
}

function percentageCalc(e1, e2) {
    let result = e1 / e2 * 100;
    if (isNaN(result)) {
        return "N/A";
    }

    return result.toFixed(1) + "%";
}

function randomiseParrot(parrot) {
    if (parrot == 0) { // Loading Parrot
        LoadingParrot.src = parrots[Math.floor(Math.random() * (3 + 1) )];
    } else { // Nameplate Parrot
        NameplateParrot.src = parrots[Math.floor(Math.random() * (3 + 1) )];
    }
}

function calculateDiff(time1, time2, label) {
    result = Math.abs(time1 - time2);
    converted = msToMinSecs(result);

    if (converted == "N/A") {
        label.textContent = " (N/A)";
        label.style.color = "orange";
        return;
    }

    if (time1 > time2) {
        label.textContent = " (+" + converted + ")";
        label.style.color = "red";
    } else {
        label.textContent = " (-" + converted + ")";
        label.style.color = "lime";
    }
}

function configureInVersusMode() {
    if (versusToggle) {
        versusToggle = false;
        VersusSearch.style.display = "none";
        VersusButton.style.backgroundColor = "#202F3D";
        const text = PlayerName.innerText.trim();
        if (text) {
            history.pushState({}, '', '/' + encodeURIComponent(text));
        } else {
            history.pushState({}, '', '/');
        }
    }
}

async function versus1ChangeStats() {
    randomiseParrot(0);

    BackButton.style.display = "none";

    Versus_NameplatePlayer1.style.display = "none";
    Versus_NameplatePlayer2.style.display = "none";

    Versus_Config1.style.display = "none";
    Versus_Config2.style.display = "none";

    Versus_Data1.style.display = "none";
    Versus_Data2.style.display = "none";

    LoadingText.style.display = "block";
    LoadingParrot.style.display = "inline";

    await call_Ranked_GetMatches_Internal();
    versus_display_info();

    BackButton.style.display = "block";

    Versus_NameplatePlayer1.style.display = "block";
    Versus_NameplatePlayer2.style.display = "block";

    Versus_Config1.style.display = "inline-flex";
    Versus_Config2.style.display = "inline-flex";

    Versus_Data1.style.display = "block";
    Versus_Data2.style.display = "block";

    LoadingText.style.display = "none";
    LoadingParrot.style.display = "none";
}

async function accessVersusByURL(player1, player2) {
    randomiseParrot(0);
    loadingText.textContent = "Loading . .";
    loadingText.style.marginTop = "40%";

    LoadingText.style.display = "block";
    LoadingParrot.style.display = "inline";

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

    Versus_PlayerModel1.src = "https://starlightskins.lunareclipse.studio/render/default/" + player1 + "/face";
    Versus_PlayerModel2.src = "https://starlightskins.lunareclipse.studio/render/default/" + player2 + "/face";

    ign = player1;
    originalIGN = player1;
    previousName = player1;
    versusIGN = player2;
    previousVersusIGN = player2;

    call_Ranked_GetUser();
    await call_Ranked_GetMatches_Internal();

    call_Ranked_GetUser_Versus(Versus_PlayerName1, Versus_PbLabel1, Versus_WinRateLabel1, 0, player1);
    call_Ranked_GetUser_Versus(Versus_PlayerName2, Versus_PbLabel2, Versus_WinRateLabel2, 1, player2);
    
    await versus_call_Ranked_GetUserMatches();

    BackButton.style.display = "block";

    Versus_NameplatePlayer1.style.display = "block";
    Versus_NameplatePlayer2.style.display = "block";

    Versus_Config1.style.display = "inline-flex";
    Versus_Config2.style.display = "inline-flex";

    Versus_Data1.style.display = "block";
    Versus_Data2.style.display = "block";

    dataSection.style.display = "none";

    LoadingText.style.display = "none";
    LoadingParrot.style.display = "none";
}