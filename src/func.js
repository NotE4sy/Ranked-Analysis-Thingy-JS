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

function versus_display_info() {
    Versus_OverworldSplit1.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1]) + " (" + timings[seedType[1]]["overworld"]["splits"][1] + ")";
    Versus_NetherSplit1.textContent = msToMinSecs(timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1]) + " (" + timings[seedType[1]]["nether"]["splits"][1] + ")";
    Versus_BastionSplit1.textContent = msToMinSecs(timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1]) + " (" + timings[seedType[1]]["bastion"]["splits"][1] + ")";
    Versus_FortressSplit1.textContent = msToMinSecs(timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1]) + " (" + timings[seedType[1]]["fortress"]["splits"][1] + ")";
    Versus_BlindSplit1.textContent = msToMinSecs(timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1]) + " (" + timings[seedType[1]]["blind"]["splits"][1] + ")";
    Versus_StrongholdSplit1.textContent = msToMinSecs(timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1]) + " (" + timings[seedType[1]]["stronghold"]["splits"][1] + ")";
    Versus_EndSplit1.textContent = msToMinSecs(timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1]) + " (" + timings[seedType[1]]["end"]["splits"][1] + ")";
    Versus_CompletionSplits1.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1]) + " (Splits)";
        
    Versus_OverworldDeaths1.textContent = percentageCalc(timings[seedType[1]]["overworld"]["deaths"], timings[seedType[1]]["overworld"]["splits"][1]);
    Versus_NetherDeaths1.textContent = percentageCalc(timings[seedType[1]]["nether"]["deaths"], timings[seedType[1]]["nether"]["timestamps"][1]);
    Versus_BastionDeaths1.textContent = percentageCalc(timings[seedType[1]]["bastion"]["deaths"], timings[seedType[1]]["bastion"]["timestamps"][1]);
    Versus_FortressDeaths1.textContent = percentageCalc(timings[seedType[1]]["fortress"]["deaths"], timings[seedType[1]]["fortress"]["timestamps"][1]);
    Versus_BlindDeaths1.textContent = percentageCalc(timings[seedType[1]]["blind"]["deaths"], timings[seedType[1]]["blind"]["timestamps"][1]);
    Versus_StrongholdDeaths1.textContent = percentageCalc(timings[seedType[1]]["stronghold"]["deaths"], timings[seedType[1]]["stronghold"]["timestamps"][1]);
    Versus_EndDeaths1.textContent = percentageCalc(timings[seedType[1]]["end"]["deaths"], timings[seedType[1]]["end"]["timestamps"][1]);

    Versus_OverworldResets1.textContent = percentageCalc(timings[seedType[1]]["overworld"]["resets"], timings[seedType[1]]["overworld"]["splits"][1]);
    Versus_NetherResets1.textContent = percentageCalc(timings[seedType[1]]["nether"]["resets"], timings[seedType[1]]["nether"]["timestamps"][1]);
    Versus_BastionResets1.textContent = percentageCalc(timings[seedType[1]]["bastion"]["resets"], timings[seedType[1]]["bastion"]["timestamps"][1]);
    Versus_FortressResets1.textContent = percentageCalc(timings[seedType[1]]["fortress"]["resets"], timings[seedType[1]]["fortress"]["timestamps"][1]);
    Versus_BlindResets1.textContent = percentageCalc(timings[seedType[1]]["blind"]["resets"], timings[seedType[1]]["blind"]["timestamps"][1]);
    Versus_StrongholdResets1.textContent = percentageCalc(timings[seedType[1]]["stronghold"]["resets"], timings[seedType[1]]["stronghold"]["timestamps"][1]);
    Versus_EndResets1.textContent = percentageCalc(timings[seedType[1]]["end"]["resets"], timings[seedType[1]]["end"]["timestamps"][1]);

    Versus_NetherTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1]) + " (" + timings[seedType[1]]["overworld"]["splits"][1] + ")";
    Versus_BastionTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1]) + " (" + timings[seedType[1]]["bastion"]["timestamps"][1] + ")";
    Versus_FortressTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1]) + " (" + timings[seedType[1]]["fortress"]["timestamps"][1] + ")";
    Versus_BlindTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1]) + " (" + timings[seedType[1]]["blind"]["timestamps"][1] + ")";
    Versus_StrongholdTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1]) + " (" + timings[seedType[1]]["stronghold"]["timestamps"][1] + ")";
    Versus_EndTimestamp1.textContent = msToMinSecs(timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1]) + " (" + timings[seedType[1]]["end"]["timestamps"][1] + ")";
    Versus_AverageCompletion1.textContent = msToMinSecs(timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1]) + " (" + timings[seedType[1]]["completions"][1] + ")";
        
    Versus_BuriedTreasure1.textContent = msToMinSecs(overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1]) + " (" + overworlds["BURIED_TREASURE"][1] + ")";
    Versus_Village1.textContent = msToMinSecs(overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1]) + " (" + overworlds["VILLAGE"][1] + ")";
    Versus_Shipwreck1.textContent = msToMinSecs(overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1]) + " (" + overworlds["SHIPWRECK"][1] + ")";
    Versus_DesertTemple1.textContent = msToMinSecs(overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1]) + " (" + overworlds["DESERT_TEMPLE"][1] + ")";
    Versus_RuinedPortal1.textContent = msToMinSecs(overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1]) + " (" + overworlds["RUINED_PORTAL"][1] + ")";
        
    Versus_Bridge1.textContent = msToMinSecs(bastions[seedType[1]]["BRIDGE"][0] / bastions[seedType[1]]["BRIDGE"][1]) + " (" + bastions[seedType[1]]["BRIDGE"][1] + ")";
    Versus_Housing1.textContent = msToMinSecs(bastions[seedType[1]]["HOUSING"][0] / bastions[seedType[1]]["HOUSING"][1]) + " (" + bastions[seedType[1]]["HOUSING"][1] + ")";
    Versus_Stables1.textContent = msToMinSecs(bastions[seedType[1]]["STABLES"][0] / bastions[seedType[1]]["STABLES"][1]) + " (" + bastions[seedType[1]]["STABLES"][1] + ")";
    Versus_Treasure1.textContent = msToMinSecs(bastions[seedType[1]]["TREASURE"][0] / bastions[seedType[1]]["TREASURE"][1]) + " (" + bastions[seedType[1]]["TREASURE"][1] + ")";

    Versus_BridgeDeaths1.textContent = percentageCalc(bastions[seedType[1]]["BRIDGE"][3], bastions[seedType[1]]["BRIDGE"][2]);
    Versus_HousingDeaths1.textContent = percentageCalc(bastions[seedType[1]]["HOUSING"][3], bastions[seedType[1]]["HOUSING"][2]);
    Versus_StablesDeaths1.textContent = percentageCalc(bastions[seedType[1]]["STABLES"][3], bastions[seedType[1]]["STABLES"][2]);
    Versus_TreasureDeaths1.textContent = percentageCalc(bastions[seedType[1]]["TREASURE"][3], bastions[seedType[1]]["TREASURE"][2]);

    Versus_BridgeResets1.textContent = percentageCalc(bastions[seedType[1]]["BRIDGE"][4], bastions[seedType[1]]["BRIDGE"][2]);
    Versus_HousingResets1.textContent = percentageCalc(bastions[seedType[1]]["HOUSING"][4], bastions[seedType[1]]["HOUSING"][2]);
    Versus_StablesResets1.textContent = percentageCalc(bastions[seedType[1]]["STABLES"][4], bastions[seedType[1]]["STABLES"][2]);
    Versus_TreasureResets1.textContent = percentageCalc(bastions[seedType[1]]["TREASURE"][4], bastions[seedType[1]]["TREASURE"][2]);
        
    Versus_OverworldSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1] + ")";
    Versus_NetherSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["nether"]["splits"][1] + ")";
    Versus_BastionSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1] + ")";
    Versus_FortressSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1] + ")";
    Versus_BlindSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["blind"]["splits"][1] + ")";
    Versus_StrongholdSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1] + ")";
    Versus_EndSplit2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["end"]["splits"][1] + ")";
    Versus_CompletionSplits2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1] + versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1] + versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1] + versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1] + versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1] + versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1] + versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1]) + " (Splits)";
        
    Versus_OverworldDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["overworld"]["deaths"], versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1]);
    Versus_NetherDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["nether"]["deaths"], versus_timings2[versus_seedType2[1]]["nether"]["timestamps"][1]);
    Versus_BastionDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["bastion"]["deaths"], versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1]);
    Versus_FortressDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["fortress"]["deaths"], versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1]);
    Versus_BlindDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["blind"]["deaths"], versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1]);
    Versus_StrongholdDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["stronghold"]["deaths"], versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1]);
    Versus_EndDeaths2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["end"]["deaths"], versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1]);

    Versus_OverworldResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["overworld"]["resets"], versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1]);
    Versus_NetherResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["nether"]["resets"], versus_timings2[versus_seedType2[1]]["nether"]["timestamps"][1]);
    Versus_BastionResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["bastion"]["resets"], versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1]);
    Versus_FortressResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["fortress"]["resets"], versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1]);
    Versus_BlindResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["blind"]["resets"], versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1]);
    Versus_StrongholdResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["stronghold"]["resets"], versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1]);
    Versus_EndResets2.textContent = percentageCalc(versus_timings2[versus_seedType2[1]]["end"]["resets"], versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1]);

    Versus_NetherTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1]) + " (" + versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1] + ")";
    Versus_BastionTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1]) + " (" + versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1] + ")";
    Versus_FortressTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1]) + " (" + versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1] + ")";
    Versus_BlindTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1]) + " (" + versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1] + ")";
    Versus_StrongholdTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1]) + " (" + versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1] + ")";
    Versus_EndTimestamp2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["end"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1]) + " (" + versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1] + ")";
    Versus_AverageCompletion2.textContent = msToMinSecs(versus_timings2[versus_seedType2[1]]["completions"][0] / versus_timings2[versus_seedType2[1]]["completions"][1]) + " (" + versus_timings2[versus_seedType2[1]]["completions"][1] + ")";
        
    Versus_BuriedTreasure2.textContent = msToMinSecs(versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1]) + " (" + versus_overworlds2["BURIED_TREASURE"][1] + ")";
    Versus_Village2.textContent = msToMinSecs(versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1]) + " (" + versus_overworlds2["VILLAGE"][1] + ")";
    Versus_Shipwreck2.textContent = msToMinSecs(versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1]) + " (" + versus_overworlds2["SHIPWRECK"][1] + ")";
    Versus_DesertTemple2.textContent = msToMinSecs(versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1]) + " (" + versus_overworlds2["DESERT_TEMPLE"][1] + ")";
    Versus_RuinedPortal2.textContent = msToMinSecs(versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1]) + " (" + versus_overworlds2["RUINED_PORTAL"][1] + ")";
        
    Versus_Bridge2.textContent = msToMinSecs(versus_bastions2[versus_seedType2[1]]["BRIDGE"][0] / versus_bastions2[versus_seedType2[1]]["BRIDGE"][1]) + " (" + versus_bastions2[versus_seedType2[1]]["BRIDGE"][1] + ")";
    Versus_Housing2.textContent = msToMinSecs(versus_bastions2[versus_seedType2[1]]["HOUSING"][0] / versus_bastions2[versus_seedType2[1]]["HOUSING"][1]) + " (" + versus_bastions2[versus_seedType2[1]]["HOUSING"][1] + ")";
    Versus_Stables2.textContent = msToMinSecs(versus_bastions2[versus_seedType2[1]]["STABLES"][0] / versus_bastions2[versus_seedType2[1]]["STABLES"][1]) + " (" + versus_bastions2[versus_seedType2[1]]["STABLES"][1] + ")";
    Versus_Treasure2.textContent = msToMinSecs(versus_bastions2[versus_seedType2[1]]["TREASURE"][0] / versus_bastions2[versus_seedType2[1]]["TREASURE"][1]) + " (" + versus_bastions2[versus_seedType2[1]]["TREASURE"][1] + ")";

    Versus_BridgeDeaths2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["BRIDGE"][3], versus_bastions2[versus_seedType2[1]]["BRIDGE"][2]);
    Versus_HousingDeaths2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["HOUSING"][3], versus_bastions2[versus_seedType2[1]]["HOUSING"][2]);
    Versus_StablesDeaths2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["STABLES"][3], versus_bastions2[versus_seedType2[1]]["STABLES"][2]);
    Versus_TreasureDeaths2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["TREASURE"][3], versus_bastions2[versus_seedType2[1]]["TREASURE"][2]);

    Versus_BridgeResets2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["BRIDGE"][4], versus_bastions2[versus_seedType2[1]]["BRIDGE"][2]);
    Versus_HousingResets2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["HOUSING"][4], versus_bastions2[versus_seedType2[1]]["HOUSING"][2]);
    Versus_StablesResets2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["STABLES"][4], versus_bastions2[versus_seedType2[1]]["STABLES"][2]);
    Versus_TreasureResets2.textContent = percentageCalc(versus_bastions2[versus_seedType2[1]]["TREASURE"][4], versus_bastions2[versus_seedType2[1]]["TREASURE"][2]);

    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1], Versus_OverworldSplitDiff1);
    calculateDiff(timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1], versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1], Versus_NetherSplitDiff1);
    calculateDiff(timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1], versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1], Versus_BastionSplitDiff1);
    calculateDiff(timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1], versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1], Versus_FortressSplitDiff1);
    calculateDiff(timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1], versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1], Versus_BlindSplitDiff1);
    calculateDiff(timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1], versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1], Versus_StrongholdSplitDiff1);
    calculateDiff(timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1], Versus_EndSplitDiff1);
    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1] + versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1] + versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1] + versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1] + versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1] + versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1] + versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1], Versus_CompletionSplitDiff1);

    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1], Versus_NetherEnterDiff1);
    calculateDiff(timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1], versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1], Versus_BastionEnterDiff1);
    calculateDiff(timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1], versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1], Versus_FortressEnterDiff1);
    calculateDiff(timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1], versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1], Versus_BlindEnterDiff1);
    calculateDiff(timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1], versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1], Versus_StrongholdEnterDiff1);
    calculateDiff(timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1], versus_timings2[versus_seedType2[1]]["end"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1], Versus_EndEnterDiff1);
    calculateDiff(timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1], versus_timings2[versus_seedType2[1]]["completions"][0] / versus_timings2[versus_seedType2[1]]["completions"][1], Versus_AvgCompletionDiff1);

    calculateDiff(overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1], versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1], Versus_BuriedTreasureDiff1);
    calculateDiff(overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1], versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1], Versus_VillageDiff1);
    calculateDiff(overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1], versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1], Versus_ShipwreckDiff1);
    calculateDiff(overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1], versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1], Versus_DesertTempleDiff1);
    calculateDiff(overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1], versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1], Versus_RuinedPortalDiff1);

    calculateDiff(bastions[versus_seedType2[1]]["BRIDGE"][0] / bastions[versus_seedType2[1]]["BRIDGE"][1], versus_bastions2[versus_seedType2[1]]["BRIDGE"][0] / versus_bastions2[versus_seedType2[1]]["BRIDGE"][1], Versus_BridgeDiff1);
    calculateDiff(bastions[versus_seedType2[1]]["HOUSING"][0] / bastions[versus_seedType2[1]]["HOUSING"][1], versus_bastions2[versus_seedType2[1]]["HOUSING"][0] / versus_bastions2[versus_seedType2[1]]["HOUSING"][1], Versus_HousingDiff1);
    calculateDiff(bastions[versus_seedType2[1]]["STABLES"][0] / bastions[versus_seedType2[1]]["STABLES"][1], versus_bastions2[versus_seedType2[1]]["STABLES"][0] / versus_bastions2[versus_seedType2[1]]["STABLES"][1], Versus_StablesDiff1);
    calculateDiff(bastions[versus_seedType2[1]]["TREASURE"][0] / bastions[versus_seedType2[1]]["TREASURE"][1], versus_bastions2[versus_seedType2[1]]["TREASURE"][0] / versus_bastions2[versus_seedType2[1]]["TREASURE"][1], Versus_TreasureDiff1);

    calculateDiff(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], Versus_OverworldSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1], timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1], Versus_NetherSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1], timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1], Versus_BastionSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1], timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1], Versus_FortressSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1], timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1], Versus_BlindSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1], timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1], Versus_StrongholdSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1], timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], Versus_EndSplitDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1] + versus_timings2[versus_seedType2[1]]["nether"]["splits"][0] / versus_timings2[versus_seedType2[1]]["nether"]["splits"][1] + versus_timings2[versus_seedType2[1]]["bastion"]["splits"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["splits"][1] + versus_timings2[versus_seedType2[1]]["fortress"]["splits"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["splits"][1] + versus_timings2[versus_seedType2[1]]["blind"]["splits"][0] / versus_timings2[versus_seedType2[1]]["blind"]["splits"][1] + versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["splits"][1] + versus_timings2[versus_seedType2[1]]["end"]["splits"][0] / versus_timings2[versus_seedType2[1]]["end"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], Versus_CompletionSplitDiff2);

    calculateDiff(versus_timings2[versus_seedType2[1]]["overworld"]["splits"][0] / versus_timings2[versus_seedType2[1]]["overworld"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], Versus_NetherEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["bastion"]["timestamps"][1], timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1], Versus_BastionEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["fortress"]["timestamps"][1], timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1], Versus_FortressEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["blind"]["timestamps"][1], timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1], Versus_BlindEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["stronghold"]["timestamps"][1], timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1], Versus_StrongholdEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["end"]["timestamps"][0] / versus_timings2[versus_seedType2[1]]["end"]["timestamps"][1], timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1], Versus_EndEnterDiff2);
    calculateDiff(versus_timings2[versus_seedType2[1]]["completions"][0] / versus_timings2[versus_seedType2[1]]["completions"][1], timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1], Versus_AvgCompletionDiff2);

    calculateDiff(versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1], overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1], Versus_BuriedTreasureDiff2);
    calculateDiff(versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1], overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1], Versus_VillageDiff2);
    calculateDiff(versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1], overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1], Versus_ShipwreckDiff2);
    calculateDiff(versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1], overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1], Versus_DesertTempleDiff2);
    calculateDiff(versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1], overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1], Versus_RuinedPortalDiff2);

    calculateDiff(versus_bastions2[versus_seedType2[1]]["BRIDGE"][0] / versus_bastions2[versus_seedType2[1]]["BRIDGE"][1], bastions[versus_seedType2[1]]["BRIDGE"][0] / bastions[versus_seedType2[1]]["BRIDGE"][1], Versus_BridgeDiff2);
    calculateDiff(versus_bastions2[versus_seedType2[1]]["HOUSING"][0] / versus_bastions2[versus_seedType2[1]]["HOUSING"][1], bastions[versus_seedType2[1]]["HOUSING"][0] / bastions[versus_seedType2[1]]["HOUSING"][1], Versus_HousingDiff2);
    calculateDiff(versus_bastions2[versus_seedType2[1]]["STABLES"][0] / versus_bastions2[versus_seedType2[1]]["STABLES"][1], bastions[versus_seedType2[1]]["STABLES"][0] / bastions[versus_seedType2[1]]["STABLES"][1], Versus_StablesDiff2);
    calculateDiff(versus_bastions2[versus_seedType2[1]]["TREASURE"][0] / versus_bastions2[versus_seedType2[1]]["TREASURE"][1], bastions[versus_seedType2[1]]["TREASURE"][0] / bastions[versus_seedType2[1]]["TREASURE"][1], Versus_TreasureDiff2);
}

function displayStatsBySeedType() {
    OverworldSplit.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1]) + " (" + timings[seedType[1]]["overworld"]["splits"][1] + ")";
    NetherSplit.textContent = msToMinSecs(timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1]) + " (" + timings[seedType[1]]["nether"]["splits"][1] + ")";
    BastionSplit.textContent = msToMinSecs(timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1]) + " (" + timings[seedType[1]]["bastion"]["splits"][1] + ")";
    FortressSplit.textContent = msToMinSecs(timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1]) + " (" + timings[seedType[1]]["fortress"]["splits"][1] + ")";
    BlindSplit.textContent = msToMinSecs(timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1]) + " (" + timings[seedType[1]]["blind"]["splits"][1] + ")";
    StrongholdSplit.textContent = msToMinSecs(timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1]) + " (" + timings[seedType[1]]["stronghold"]["splits"][1] + ")";
    EndSplit.textContent = msToMinSecs(timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1]) + " (" + timings[seedType[1]]["end"]["splits"][1] + ")";
    CompletionSplits.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1]) + " (Splits)";
    
    OverworldDeaths.textContent = percentageCalc(timings[seedType[1]]["overworld"]["deaths"], timings[seedType[1]]["overworld"]["splits"][1]);
    NetherDeaths.textContent = percentageCalc(timings[seedType[1]]["nether"]["deaths"], timings[seedType[1]]["nether"]["timestamps"][1]);
    BastionDeaths.textContent = percentageCalc(timings[seedType[1]]["bastion"]["deaths"], timings[seedType[1]]["bastion"]["timestamps"][1]);
    FortressDeaths.textContent = percentageCalc(timings[seedType[1]]["fortress"]["deaths"], timings[seedType[1]]["fortress"]["timestamps"][1]);
    BlindDeaths.textContent = percentageCalc(timings[seedType[1]]["blind"]["deaths"], timings[seedType[1]]["blind"]["timestamps"][1]);
    StrongholdDeaths.textContent = percentageCalc(timings[seedType[1]]["stronghold"]["deaths"], timings[seedType[1]]["stronghold"]["timestamps"][1]);
    EndDeaths.textContent = percentageCalc(timings[seedType[1]]["end"]["deaths"], timings[seedType[1]]["end"]["timestamps"][1]);

    OverworldResets.textContent = percentageCalc(timings[seedType[1]]["overworld"]["resets"], timings[seedType[1]]["overworld"]["splits"][1]);
    NetherResets.textContent = percentageCalc(timings[seedType[1]]["nether"]["resets"], timings[seedType[1]]["nether"]["timestamps"][1]);
    BastionResets.textContent = percentageCalc(timings[seedType[1]]["bastion"]["resets"], timings[seedType[1]]["bastion"]["timestamps"][1]);
    FortressResets.textContent = percentageCalc(timings[seedType[1]]["fortress"]["resets"], timings[seedType[1]]["fortress"]["timestamps"][1]);
    BlindResets.textContent = percentageCalc(timings[seedType[1]]["blind"]["resets"], timings[seedType[1]]["blind"]["timestamps"][1]);
    StrongholdResets.textContent = percentageCalc(timings[seedType[1]]["stronghold"]["resets"], timings[seedType[1]]["stronghold"]["timestamps"][1]);
    EndResets.textContent = percentageCalc(timings[seedType[1]]["end"]["resets"], timings[seedType[1]]["end"]["timestamps"][1]);

    NetherTimestamp.textContent = msToMinSecs(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1]) + " (" + timings[seedType[1]]["overworld"]["splits"][1] + ")";
    BastionTimestamp.textContent = msToMinSecs(timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1]) + " (" + timings[seedType[1]]["bastion"]["timestamps"][1] + ")";
    FortressTimestamp.textContent = msToMinSecs(timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1]) + " (" + timings[seedType[1]]["fortress"]["timestamps"][1] + ")";
    BlindTimestamp.textContent = msToMinSecs(timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1]) + " (" + timings[seedType[1]]["blind"]["timestamps"][1] + ")";
    StrongholdTimestamp.textContent = msToMinSecs(timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1]) + " (" + timings[seedType[1]]["stronghold"]["timestamps"][1] + ")";
    EndTimestamp.textContent = msToMinSecs(timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1]) + " (" + timings[seedType[1]]["end"]["timestamps"][1] + ")";
    AverageCompletion.textContent = msToMinSecs(timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1]) + " (" + timings[seedType[1]]["completions"][1] + ")";

    Bridge.textContent = msToMinSecs(bastions[seedType[1]]["BRIDGE"][0] / bastions[seedType[1]]["BRIDGE"][1]) + " (" + bastions[seedType[1]]["BRIDGE"][1] + ")";
    Housing.textContent = msToMinSecs(bastions[seedType[1]]["HOUSING"][0] / bastions[seedType[1]]["HOUSING"][1]) + " (" + bastions[seedType[1]]["HOUSING"][1] + ")";
    Stables.textContent = msToMinSecs(bastions[seedType[1]]["STABLES"][0] / bastions[seedType[1]]["STABLES"][1]) + " (" + bastions[seedType[1]]["STABLES"][1] + ")";
    Treasure.textContent = msToMinSecs(bastions[seedType[1]]["TREASURE"][0] / bastions[seedType[1]]["TREASURE"][1]) + " (" + bastions[seedType[1]]["TREASURE"][1] + ")";

    BridgeDeaths.textContent = percentageCalc(bastions[seedType[1]]["BRIDGE"][3], bastions[seedType[1]]["BRIDGE"][2]);
    HousingDeaths.textContent = percentageCalc(bastions[seedType[1]]["HOUSING"][3], bastions[seedType[1]]["HOUSING"][2]);
    StablesDeaths.textContent = percentageCalc(bastions[seedType[1]]["STABLES"][3], bastions[seedType[1]]["STABLES"][2]);
    TreasureDeaths.textContent = percentageCalc(bastions[seedType[1]]["TREASURE"][3], bastions[seedType[1]]["TREASURE"][2]);

    BridgeResets.textContent = percentageCalc(bastions[seedType[1]]["BRIDGE"][4], bastions[seedType[1]]["BRIDGE"][2]);
    HousingResets.textContent = percentageCalc(bastions[seedType[1]]["HOUSING"][4], bastions[seedType[1]]["HOUSING"][2]);
    StablesResets.textContent = percentageCalc(bastions[seedType[1]]["STABLES"][4], bastions[seedType[1]]["STABLES"][2]);
    TreasureResets.textContent = percentageCalc(bastions[seedType[1]]["TREASURE"][4], bastions[seedType[1]]["TREASURE"][2]);
}