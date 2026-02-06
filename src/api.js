async function call_Ranked_GetMatch(matchID) {
    try {
        const response = await fetch("https://api.mcsrranked.com/matches/" + matchID);
        const statusCode = response.status;

        if (statusCode != 200) {
            PageTitle.textContent = "Error code: " + statusCode + " | Ranked Analysis"; 
            switch (statusCode) {
                case 400:
                    loadingText.textContent = "Invalid IGN!";
                    break;
                case 429:
                    loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                    break;
            }
            return;
        }

        const data = await response.json();
        const timelines = data["data"]["timelines"];
        const overworldType = data["data"]["seed"]["overworld"];
        const bastionType = data["data"]["seed"]["nether"];

        let latestReset = 0;
        let finished = false;
        let finalTime = 0;
        let latestSplit = "overworld";

        let timestamps = {
            "enter_nether": 0,
            "enter_bastion": 0,
            "enter_fortress": 0,
            "blind": 0,
            "enter_stronghold": 0,
            "enter_end": 0
        };

        for (let i = 0; i < data["data"]["completions"].length; i++) {
            const c = data["data"]["completions"][i];
            if (c["uuid"] == uuid) {
                finalTime = c["time"];
                finished = true;
                timings["ALL"]["completions"][0] += c["time"];
                timings["ALL"]["completions"][1] += 1;
                timings[overworldType]["completions"][0] += c["time"];
                timings[overworldType]["completions"][1] += 1;
                break;
            }
        }

        for (let i = timelines.length - 1; i >= 0; i--) { // Start in ow, end in completion
            const timeline = timelines[i];

            if (timeline["uuid"] != uuid) continue;

            switch (timeline["type"]) {
                case "projectelo.timeline.reset":
                    latestReset = timeline["time"];
                    timings["ALL"][latestSplit]["resets"] += 1;
                    timings[overworldType][latestSplit]["resets"] += 1;
                    if (latestSplit == "bastion") {
                        bastions["ALL"][bastionType][4] += 1;
                        bastions[overworldType][bastionType][4] += 1;
                    }
                    break;

                case "projectelo.timeline.death":
                    timings["ALL"][latestSplit]["deaths"] += 1;
                    timings[overworldType][latestSplit]["deaths"] += 1;
                    if (latestSplit == "bastion") {
                        bastions["ALL"][bastionType][3] += 1;
                        bastions[overworldType][bastionType][3] += 1;
                    }
                    break;
                
                case "story.enter_the_nether":
                    timestamps["enter_nether"] = timeline["time"];
                    timings["ALL"]["overworld"]["splits"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["overworld"]["splits"][1] += 1;
                    timings["ALL"]["nether"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["nether"]["timestamps"][1] += 1;
                    timings[overworldType]["overworld"]["splits"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["overworld"]["splits"][1] += 1;
                    timings[overworldType]["nether"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["nether"]["timestamps"][1] += 1;
                    latestSplit = "nether";
                    if (overworldType != null) {
                        overworlds[overworldType][0] += timeline["time"] - latestReset;
                        overworlds[overworldType][1] += 1;
                    }
                    break;
                
                case "nether.find_bastion":
                    timestamps["enter_bastion"] = timeline["time"];
                    timings["ALL"]["bastion"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["bastion"]["timestamps"][1] += 1;
                    timings["ALL"]["nether"]["splits"][0] += timeline["time"] - timestamps["enter_nether"];
                    timings["ALL"]["nether"]["splits"][1] += 1;
                    timings[overworldType]["bastion"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["bastion"]["timestamps"][1] += 1;
                    timings[overworldType]["nether"]["splits"][0] += timeline["time"] - timestamps["enter_nether"];
                    timings[overworldType]["nether"]["splits"][1] += 1;
                    latestSplit = "bastion";
                    if (bastionType != null) {
                        bastions["ALL"][bastionType][2] += 1;
                        bastions[overworldType][bastionType][2] += 1;
                        console.log(overworldType);
                    }
                    break;
                
                case "nether.find_fortress":
                    timestamps["enter_fortress"] = timeline["time"];
                    timings["ALL"]["fortress"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["fortress"]["timestamps"][1] += 1;
                    timings["ALL"]["bastion"]["splits"][0] += timeline["time"] - timestamps["enter_bastion"];
                    timings["ALL"]["bastion"]["splits"][1] += 1;
                    timings[overworldType]["fortress"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["fortress"]["timestamps"][1] += 1;
                    timings[overworldType]["bastion"]["splits"][0] += timeline["time"] - timestamps["enter_bastion"];
                    timings[overworldType]["bastion"]["splits"][1] += 1;
                    latestSplit = "fortress";
                    if (bastionType != null) {
                        bastions["ALL"][bastionType][0] += timeline["time"] - timestamps["enter_bastion"];
                        bastions["ALL"][bastionType][1] += 1;
                        bastions[overworldType][bastionType][0] += timeline["time"] - timestamps["enter_bastion"];
                        bastions[overworldType][bastionType][1] += 1;
                    }
                    break;

                case "projectelo.timeline.blind_travel":
                    timestamps["blind"] = timeline["time"];
                    timings["ALL"]["blind"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["blind"]["timestamps"][1] += 1;
                    timings["ALL"]["fortress"]["splits"][0] += timeline["time"] - timestamps["enter_fortress"];
                    timings["ALL"]["fortress"]["splits"][1] += 1;
                    timings[overworldType]["blind"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["blind"]["timestamps"][1] += 1;
                    timings[overworldType]["fortress"]["splits"][0] += timeline["time"] - timestamps["enter_fortress"];
                    timings[overworldType]["fortress"]["splits"][1] += 1;
                    latestSplit = "blind";
                    break;

                case "story.follow_ender_eye":
                    timestamps["enter_stronghold"] = timeline["time"];
                    timings["ALL"]["stronghold"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["stronghold"]["timestamps"][1] += 1;
                    timings["ALL"]["blind"]["splits"][0] += timeline["time"] - timestamps["blind"];
                    timings["ALL"]["blind"]["splits"][1] += 1;
                    timings[overworldType]["stronghold"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["stronghold"]["timestamps"][1] += 1;
                    timings[overworldType]["blind"]["splits"][0] += timeline["time"] - timestamps["blind"];
                    timings[overworldType]["blind"]["splits"][1] += 1;
                    latestSplit = "stronghold";
                    break;

                case "story.enter_the_end":
                    timestamps["enter_end"] = timeline["time"];
                    timings["ALL"]["end"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings["ALL"]["end"]["timestamps"][1] += 1;
                    timings["ALL"]["stronghold"]["splits"][0] += timeline["time"] - timestamps["enter_stronghold"];
                    timings["ALL"]["stronghold"]["splits"][1] += 1;
                    timings[overworldType]["end"]["timestamps"][0] += timeline["time"] - latestReset;
                    timings[overworldType]["end"]["timestamps"][1] += 1;
                    timings[overworldType]["stronghold"]["splits"][0] += timeline["time"] - timestamps["enter_stronghold"];
                    timings[overworldType]["stronghold"]["splits"][1] += 1;  
                    latestSplit = "end";
                    break;
            }
        }
        console.log(bastions);
        if (finished) {
            timings["ALL"]["end"]["splits"][0] += finalTime - timestamps["enter_end"];
            timings["ALL"]["end"]["splits"][1] += 1;
            timings[overworldType]["end"]["splits"][0] += finalTime - timestamps["enter_end"];
            timings[overworldType]["end"]["splits"][1] += 1;
        }
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetMatch': ", error);
    }
}

async function versus_call_Ranked_GetMatch2(matchID) {
    try {
        const response = await fetch("https://api.mcsrranked.com/matches/" + matchID);
        const statusCode = response.status;

        if (statusCode != 200) {
            PageTitle.textContent = "Error code: " + statusCode + " | Ranked Analysis"; 
            switch (statusCode) {
                case 400:
                    loadingText.textContent = "Invalid IGN!";
                    break;
                case 429:
                    loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                    break;
            }
            return;
        }

        const data = await response.json();
        const timelines = data["data"]["timelines"];
        const overworldType = data["data"]["seed"]["overworld"];
        const bastionType = data["data"]["seed"]["nether"];

        let latestReset = 0;
        let finished = false;
        let finalTime = 0;
        let latestSplit = "overworld";

        let timestamps = {
            "enter_nether": 0,
            "enter_bastion": 0,
            "enter_fortress": 0,
            "blind": 0,
            "enter_stronghold": 0,
            "enter_end": 0
        };

        for (let i = 0; i < data["data"]["completions"].length; i++) {
            const c = data["data"]["completions"][i];
            if (c["uuid"] == versusUUID) {
                finalTime = c["time"];
                finished = true;
                versus_timings2["completions"][0] += c["time"];
                versus_timings2["completions"][1] += 1;
                break;
            }
        }

        for (let i = timelines.length - 1; i >= 0; i--) { // Start in ow, end in completion
            const timeline = timelines[i];

            if (timeline["uuid"] != versusUUID) continue;

            switch (timeline["type"]) {
                case "projectelo.timeline.reset":
                    latestReset = timeline["time"];
                    versus_timings2[latestSplit]["resets"] += 1;
                    if (latestSplit == "bastion") {
                        versus_bastions2[bastionType][4] += 1;
                    }
                    break;

                case "projectelo.timeline.death":
                    versus_timings2[latestSplit]["deaths"] += 1;
                    if (latestSplit == "bastion") {
                        versus_bastions2[bastionType][3] += 1;
                    }
                    break;
                
                case "story.enter_the_nether":
                    timestamps["enter_nether"] = timeline["time"];
                    versus_timings2["overworld"]["splits"][0] += timeline["time"] - latestReset;
                    versus_timings2["overworld"]["splits"][1] += 1;
                    versus_timings2["nether"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["nether"]["timestamps"][1] += 1;
                    latestSplit = "nether";
                    if (overworldType != null) {
                        versus_overworlds2[overworldType][0] += timeline["time"] - latestReset;
                        versus_overworlds2[overworldType][1] += 1;
                    }
                    break;
                
                case "nether.find_bastion":
                    timestamps["enter_bastion"] = timeline["time"];
                    versus_timings2["bastion"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["bastion"]["timestamps"][1] += 1;
                    versus_timings2["nether"]["splits"][0] += timeline["time"] - timestamps["enter_nether"];
                    versus_timings2["nether"]["splits"][1] += 1;
                    latestSplit = "bastion";
                    if (bastionType != null) {
                        versus_bastions2[bastionType][2] += 1;
                    }
                    break;
                
                case "nether.find_fortress":
                    timestamps["enter_fortress"] = timeline["time"];
                    versus_timings2["fortress"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["fortress"]["timestamps"][1] += 1;
                    versus_timings2["bastion"]["splits"][0] += timeline["time"] - timestamps["enter_bastion"];
                    versus_timings2["bastion"]["splits"][1] += 1;
                    latestSplit = "fortress";
                    if (bastionType != null) {
                        versus_bastions2[bastionType][0] += timeline["time"] - timestamps["enter_bastion"];
                        versus_bastions2[bastionType][1] += 1;
                    }
                    break;

                case "projectelo.timeline.blind_travel":
                    timestamps["blind"] = timeline["time"];
                    versus_timings2["blind"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["blind"]["timestamps"][1] += 1;
                    versus_timings2["fortress"]["splits"][0] += timeline["time"] - timestamps["enter_fortress"];
                    versus_timings2["fortress"]["splits"][1] += 1;
                    latestSplit = "blind";
                    break;

                case "story.follow_ender_eye":
                    timestamps["enter_stronghold"] = timeline["time"];
                    versus_timings2["stronghold"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["stronghold"]["timestamps"][1] += 1;
                    versus_timings2["blind"]["splits"][0] += timeline["time"] - timestamps["blind"];
                    versus_timings2["blind"]["splits"][1] += 1;
                    latestSplit = "stronghold";
                    break;

                case "story.enter_the_end":
                    timestamps["enter_end"] = timeline["time"];
                    versus_timings2["end"]["timestamps"][0] += timeline["time"] - latestReset;
                    versus_timings2["end"]["timestamps"][1] += 1;
                    versus_timings2["stronghold"]["splits"][0] += timeline["time"] - timestamps["enter_stronghold"];
                    versus_timings2["stronghold"]["splits"][1] += 1;    
                    latestSplit = "end";
                    break;
            }
        }

        if (finished) {
            versus_timings2["end"]["splits"][0] += finalTime - timestamps["enter_end"];
            versus_timings2["end"]["splits"][1] += 1;
            console.log("S");
        }
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetMatch': ", error);
    }
}

async function call_Ranked_GetMatches_Internal() {
    const response = await fetch("https://api.mcsrranked.com/users/" + ign + "/matches?type=" + gamemode + "&count=" + matchCount);
    const statusCode = response.status;

    promises = [];

    overworlds = {
        "BURIED_TREASURE": [0, 0],
        "VILLAGE": [0, 0],
        "SHIPWRECK": [0, 0],
        "DESERT_TEMPLE": [0, 0],
        "RUINED_PORTAL": [0, 0],
    }

    bastions = {
        "ALL": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        },
        "BURIED_TREASURE": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        },
        "VILLAGE": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        },
        "SHIPWRECK": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        },
        "DESERT_TEMPLE": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        },
        "RUINED_PORTAL": {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        }
    }

    timings = {
        "ALL": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        },
        "BURIED_TREASURE": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        },
        "VILLAGE": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        },
        "SHIPWRECK": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        },
        "DESERT_TEMPLE": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        },
        "RUINED_PORTAL": {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        }
    }

    if (statusCode != 200) {
        PageTitle.textContent = "Error code: " + statusCode + " | Ranked Analysis"; 
        switch (statusCode) {
            case 400:
                loadingText.textContent = "Invalid IGN!";
                break;
            case 429:
                loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                break;
        }
        return;
    }

    const data = await response.json();

    for (const match of data["data"]) {
        const matchID = match["id"];
        promises.push(call_Ranked_GetMatch(matchID));
    }

    await Promise.all(promises);
        
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
    
    BuriedTreasure.textContent = msToMinSecs(overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1]) + " (" + overworlds["BURIED_TREASURE"][1] + ")";
    Village.textContent = msToMinSecs(overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1]) + " (" + overworlds["VILLAGE"][1] + ")";
    Shipwreck.textContent = msToMinSecs(overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1]) + " (" + overworlds["SHIPWRECK"][1] + ")";
    DesertTemple.textContent = msToMinSecs(overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1]) + " (" + overworlds["DESERT_TEMPLE"][1] + ")";
    RuinedPortal.textContent = msToMinSecs(overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1]) + " (" + overworlds["RUINED_PORTAL"][1] + ")";
    
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

async function call_Ranked_GetUserMatches_External() {
    try {
        randomiseParrot(0);
        loadingText.textContent = "Loading . .";

        dataSection.style.display = "none";
        configUI.style.display = "none";
        LoadingText.style.display = "block";
        LoadingParrot.style.display = "inline";

        await call_Ranked_GetMatches_Internal();

        loadingText.style.display = "none";
        LoadingParrot.style.display = "none";
        dataSection.style.display = "block";
        configUI.style.display = "flex";

        playerModel.style.visibility = "visible";
        PlayerNameContainer.style.display = "inline";
        playerInfoContainer.style.display = "inline";
        NameplateLoading.style.display = "none";
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetUserMatches_External': ", error);
    }
}

async function call_Ranked_GetUser() {
    try {
        randomiseParrot(1);

        playerModel.style.visibility = "hidden";
        PlayerNameContainer.style.display = "none";
        playerInfoContainer.style.display = "none";
        NameplateLoading.style.display = "inline";

        const response = await fetch("https://api.mcsrranked.com/users/" + ign);
        const statusCode = response.status;

        if (statusCode != 200) {
            playerModel.style.visibility = "visible";
            PlayerNameContainer.style.display = "inline";
            playerInfoContainer.style.display = "inline";
            NameplateLoading.style.display = "none";
            PbLabel.textContent = "PB: N/A";
            WinRateLabel.textContent = "W/L%: N/A";
            PageTitle.textContent = "Error code: " + statusCode + " | Ranked Analysis"; 
            switch (statusCode) {
                case 400:
                    loadingText.textContent = "Invalid IGN!";
                    break;
                case 429:
                    loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                    break;
            }
            return;
        }

        const data = await response.json();
        const pb = data["data"]["statistics"]["season"]["bestTime"]["ranked"];
        const wins = data["data"]["statistics"]["season"]["wins"]["ranked"];
        const losses = data["data"]["statistics"]["season"]["loses"]["ranked"];

        PageTitle.textContent = data["data"]["nickname"] + " | Ranked Analysis";
        WinRateLabel.textContent = "W/L%: " + percentageCalc(wins, wins + losses);
        uuid = data["data"]["uuid"];
        PbLabel.textContent = "PB: " + msToMinSecs(pb);
        PlayerName.textContent = data["data"]["nickname"];
        ign = data["data"]["nickname"];

        if (pb == null) PbLabel.textContent = "PB: N/A";
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetUser': ", error);
    }
}

async function call_Ranked_GetUser_Versus(versusPlayerName, versusPbLabel, versusWinRateLabel, playerNum, playerName) {
    try {
        const response = await fetch("https://api.mcsrranked.com/users/" + playerName);
        const statusCode = response.status;

        if (statusCode != 200) {
            versusPbLabel.textContent = "PB: N/A";
            versusWinRateLabel.textContent = "W/L%: N/A";
            BackButton.style.display = "block";
            switch (statusCode) {
                case 400:
                    loadingText.textContent = "Invalid IGN!";
                    break;
                case 429:
                    loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                    break;
            }
            return;
        }

        const data = await response.json();
        const pb = data["data"]["statistics"]["season"]["bestTime"]["ranked"];
        const wins = data["data"]["statistics"]["season"]["wins"]["ranked"];
        const losses = data["data"]["statistics"]["season"]["loses"]["ranked"];

        versusWinRateLabel.textContent = "W/L%: " + percentageCalc(wins, wins + losses);
        versusPbLabel.textContent = "PB: " + msToMinSecs(pb);
        versusPlayerName.placeholder = data["data"]["nickname"];
        versusPlayerName.value = "";

        if (playerNum == 1) {
            versusUUID = data["data"]["uuid"];
            versusIGN = data["data"]["nickname"];
            previousVersusIGN = versusIGN;
            PageTitle.textContent = ign + " vs " + data["data"]["nickname"] + " | Ranked Analysis";
        } else {
            uuid = data["data"]["uuid"];
        }

        if (pb == null) versusPbLabel.textContent = "PB: N/A";
    } catch (error) {
        console.error("ERROR IN 'call_Ranked_GetUser': ", error);
    }
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
        
    Versus_Bridge1.textContent = msToMinSecs(bastions["BRIDGE"][0] / bastions["BRIDGE"][1]) + " (" + bastions["BRIDGE"][1] + ")";
    Versus_Housing1.textContent = msToMinSecs(bastions["HOUSING"][0] / bastions["HOUSING"][1]) + " (" + bastions["HOUSING"][1] + ")";
    Versus_Stables1.textContent = msToMinSecs(bastions["STABLES"][0] / bastions["STABLES"][1]) + " (" + bastions["STABLES"][1] + ")";
    Versus_Treasure1.textContent = msToMinSecs(bastions["TREASURE"][0] / bastions["TREASURE"][1]) + " (" + bastions["TREASURE"][1] + ")";

    Versus_BridgeDeaths1.textContent = percentageCalc(bastions["BRIDGE"][3], bastions["BRIDGE"][2]);
    Versus_HousingDeaths1.textContent = percentageCalc(bastions["HOUSING"][3], bastions["HOUSING"][2]);
    Versus_StablesDeaths1.textContent = percentageCalc(bastions["STABLES"][3], bastions["STABLES"][2]);
    Versus_TreasureDeaths1.textContent = percentageCalc(bastions["TREASURE"][3], bastions["TREASURE"][2]);

    Versus_BridgeResets1.textContent = percentageCalc(bastions["BRIDGE"][4], bastions["BRIDGE"][2]);
    Versus_HousingResets1.textContent = percentageCalc(bastions["HOUSING"][4], bastions["HOUSING"][2]);
    Versus_StablesResets1.textContent = percentageCalc(bastions["STABLES"][4], bastions["STABLES"][2]);
    Versus_TreasureResets1.textContent = percentageCalc(bastions["TREASURE"][4], bastions["TREASURE"][2]);
        
    Versus_OverworldSplit2.textContent = msToMinSecs(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1]) + " (" + versus_timings2["overworld"]["splits"][1] + ")";
    Versus_NetherSplit2.textContent = msToMinSecs(versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1]) + " (" + versus_timings2["nether"]["splits"][1] + ")";
    Versus_BastionSplit2.textContent = msToMinSecs(versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1]) + " (" + versus_timings2["bastion"]["splits"][1] + ")";
    Versus_FortressSplit2.textContent = msToMinSecs(versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1]) + " (" + versus_timings2["fortress"]["splits"][1] + ")";
    Versus_BlindSplit2.textContent = msToMinSecs(versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1]) + " (" + versus_timings2["blind"]["splits"][1] + ")";
    Versus_StrongholdSplit2.textContent = msToMinSecs(versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1]) + " (" + versus_timings2["stronghold"]["splits"][1] + ")";
    Versus_EndSplit2.textContent = msToMinSecs(versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1]) + " (" + versus_timings2["end"]["splits"][1] + ")";
    Versus_CompletionSplits2.textContent = msToMinSecs(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1] + versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1] + versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1] + versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1] + versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1] + versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1] + versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1]) + " (Splits)";
        
    Versus_OverworldDeaths2.textContent = percentageCalc(versus_timings2["overworld"]["deaths"], versus_timings2["overworld"]["splits"][1]);
    Versus_NetherDeaths2.textContent = percentageCalc(versus_timings2["nether"]["deaths"], versus_timings2["nether"]["timestamps"][1]);
    Versus_BastionDeaths2.textContent = percentageCalc(versus_timings2["bastion"]["deaths"], versus_timings2["bastion"]["timestamps"][1]);
    Versus_FortressDeaths2.textContent = percentageCalc(versus_timings2["fortress"]["deaths"], versus_timings2["fortress"]["timestamps"][1]);
    Versus_BlindDeaths2.textContent = percentageCalc(versus_timings2["blind"]["deaths"], versus_timings2["blind"]["timestamps"][1]);
    Versus_StrongholdDeaths2.textContent = percentageCalc(versus_timings2["stronghold"]["deaths"], versus_timings2["stronghold"]["timestamps"][1]);
    Versus_EndDeaths2.textContent = percentageCalc(versus_timings2["end"]["deaths"], versus_timings2["end"]["timestamps"][1]);

    Versus_OverworldResets2.textContent = percentageCalc(versus_timings2["overworld"]["resets"], versus_timings2["overworld"]["splits"][1]);
    Versus_NetherResets2.textContent = percentageCalc(versus_timings2["nether"]["resets"], versus_timings2["nether"]["timestamps"][1]);
    Versus_BastionResets2.textContent = percentageCalc(versus_timings2["bastion"]["resets"], versus_timings2["bastion"]["timestamps"][1]);
    Versus_FortressResets2.textContent = percentageCalc(versus_timings2["fortress"]["resets"], versus_timings2["fortress"]["timestamps"][1]);
    Versus_BlindResets2.textContent = percentageCalc(versus_timings2["blind"]["resets"], versus_timings2["blind"]["timestamps"][1]);
    Versus_StrongholdResets2.textContent = percentageCalc(versus_timings2["stronghold"]["resets"], versus_timings2["stronghold"]["timestamps"][1]);
    Versus_EndResets2.textContent = percentageCalc(versus_timings2["end"]["resets"], versus_timings2["end"]["timestamps"][1]);

    Versus_NetherTimestamp2.textContent = msToMinSecs(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1]) + " (" + versus_timings2["overworld"]["splits"][1] + ")";
    Versus_BastionTimestamp2.textContent = msToMinSecs(versus_timings2["bastion"]["timestamps"][0] / versus_timings2["bastion"]["timestamps"][1]) + " (" + versus_timings2["bastion"]["timestamps"][1] + ")";
    Versus_FortressTimestamp2.textContent = msToMinSecs(versus_timings2["fortress"]["timestamps"][0] / versus_timings2["fortress"]["timestamps"][1]) + " (" + versus_timings2["fortress"]["timestamps"][1] + ")";
    Versus_BlindTimestamp2.textContent = msToMinSecs(versus_timings2["blind"]["timestamps"][0] / versus_timings2["blind"]["timestamps"][1]) + " (" + versus_timings2["blind"]["timestamps"][1] + ")";
    Versus_StrongholdTimestamp2.textContent = msToMinSecs(versus_timings2["stronghold"]["timestamps"][0] / versus_timings2["stronghold"]["timestamps"][1]) + " (" + versus_timings2["stronghold"]["timestamps"][1] + ")";
    Versus_EndTimestamp2.textContent = msToMinSecs(versus_timings2["end"]["timestamps"][0] / versus_timings2["end"]["timestamps"][1]) + " (" + versus_timings2["end"]["timestamps"][1] + ")";
    Versus_AverageCompletion2.textContent = msToMinSecs(versus_timings2["completions"][0] / versus_timings2["completions"][1]) + " (" + versus_timings2["completions"][1] + ")";
        
    Versus_BuriedTreasure2.textContent = msToMinSecs(versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1]) + " (" + versus_overworlds2["BURIED_TREASURE"][1] + ")";
    Versus_Village2.textContent = msToMinSecs(versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1]) + " (" + versus_overworlds2["VILLAGE"][1] + ")";
    Versus_Shipwreck2.textContent = msToMinSecs(versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1]) + " (" + versus_overworlds2["SHIPWRECK"][1] + ")";
    Versus_DesertTemple2.textContent = msToMinSecs(versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1]) + " (" + versus_overworlds2["DESERT_TEMPLE"][1] + ")";
    Versus_RuinedPortal2.textContent = msToMinSecs(versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1]) + " (" + versus_overworlds2["RUINED_PORTAL"][1] + ")";
        
    Versus_Bridge2.textContent = msToMinSecs(versus_bastions2["BRIDGE"][0] / versus_bastions2["BRIDGE"][1]) + " (" + versus_bastions2["BRIDGE"][1] + ")";
    Versus_Housing2.textContent = msToMinSecs(versus_bastions2["HOUSING"][0] / versus_bastions2["HOUSING"][1]) + " (" + versus_bastions2["HOUSING"][1] + ")";
    Versus_Stables2.textContent = msToMinSecs(versus_bastions2["STABLES"][0] / versus_bastions2["STABLES"][1]) + " (" + versus_bastions2["STABLES"][1] + ")";
    Versus_Treasure2.textContent = msToMinSecs(versus_bastions2["TREASURE"][0] / versus_bastions2["TREASURE"][1]) + " (" + versus_bastions2["TREASURE"][1] + ")";

    Versus_BridgeDeaths2.textContent = percentageCalc(versus_bastions2["BRIDGE"][3], versus_bastions2["BRIDGE"][2]);
    Versus_HousingDeaths2.textContent = percentageCalc(versus_bastions2["HOUSING"][3], versus_bastions2["HOUSING"][2]);
    Versus_StablesDeaths2.textContent = percentageCalc(versus_bastions2["STABLES"][3], versus_bastions2["STABLES"][2]);
    Versus_TreasureDeaths2.textContent = percentageCalc(versus_bastions2["TREASURE"][3], versus_bastions2["TREASURE"][2]);

    Versus_BridgeResets2.textContent = percentageCalc(versus_bastions2["BRIDGE"][4], versus_bastions2["BRIDGE"][2]);
    Versus_HousingResets2.textContent = percentageCalc(versus_bastions2["HOUSING"][4], versus_bastions2["HOUSING"][2]);
    Versus_StablesResets2.textContent = percentageCalc(versus_bastions2["STABLES"][4], versus_bastions2["STABLES"][2]);
    Versus_TreasureResets2.textContent = percentageCalc(versus_bastions2["TREASURE"][4], versus_bastions2["TREASURE"][2]);

    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1], Versus_OverworldSplitDiff1);
    calculateDiff(timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1], versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1], Versus_NetherSplitDiff1);
    calculateDiff(timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1], versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1], Versus_BastionSplitDiff1);
    calculateDiff(timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1], versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1], Versus_FortressSplitDiff1);
    calculateDiff(timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1], versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1], Versus_BlindSplitDiff1);
    calculateDiff(timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1], versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1], Versus_StrongholdSplitDiff1);
    calculateDiff(timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1], Versus_EndSplitDiff1);
    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1] + versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1] + versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1] + versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1] + versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1] + versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1] + versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1], Versus_CompletionSplitDiff1);

    calculateDiff(timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1], Versus_NetherEnterDiff1);
    calculateDiff(timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1], versus_timings2["bastion"]["timestamps"][0] / versus_timings2["bastion"]["timestamps"][1], Versus_BastionEnterDiff1);
    calculateDiff(timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1], versus_timings2["fortress"]["timestamps"][0] / versus_timings2["fortress"]["timestamps"][1], Versus_FortressEnterDiff1);
    calculateDiff(timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1], versus_timings2["blind"]["timestamps"][0] / versus_timings2["blind"]["timestamps"][1], Versus_BlindEnterDiff1);
    calculateDiff(timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1], versus_timings2["stronghold"]["timestamps"][0] / versus_timings2["stronghold"]["timestamps"][1], Versus_StrongholdEnterDiff1);
    calculateDiff(timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1], versus_timings2["end"]["timestamps"][0] / versus_timings2["end"]["timestamps"][1], Versus_EndEnterDiff1);
    calculateDiff(timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1], versus_timings2["completions"][0] / versus_timings2["completions"][1], Versus_AvgCompletionDiff1);

    calculateDiff(overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1], versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1], Versus_BuriedTreasureDiff1);
    calculateDiff(overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1], versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1], Versus_VillageDiff1);
    calculateDiff(overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1], versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1], Versus_ShipwreckDiff1);
    calculateDiff(overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1], versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1], Versus_DesertTempleDiff1);
    calculateDiff(overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1], versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1], Versus_RuinedPortalDiff1);

    calculateDiff(bastions["BRIDGE"][0] / bastions["BRIDGE"][1], versus_bastions2["BRIDGE"][0] / versus_bastions2["BRIDGE"][1], Versus_BridgeDiff1);
    calculateDiff(bastions["HOUSING"][0] / bastions["HOUSING"][1], versus_bastions2["HOUSING"][0] / versus_bastions2["HOUSING"][1], Versus_HousingDiff1);
    calculateDiff(bastions["STABLES"][0] / bastions["STABLES"][1], versus_bastions2["STABLES"][0] / versus_bastions2["STABLES"][1], Versus_StablesDiff1);
    calculateDiff(bastions["TREASURE"][0] / bastions["TREASURE"][1], versus_bastions2["TREASURE"][0] / versus_bastions2["TREASURE"][1], Versus_TreasureDiff1);

    calculateDiff(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], Versus_OverworldSplitDiff2);
    calculateDiff(versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1], timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1], Versus_NetherSplitDiff2);
    calculateDiff(versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1], timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1], Versus_BastionSplitDiff2);
    calculateDiff(versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1], timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1], Versus_FortressSplitDiff2);
    calculateDiff(versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1], timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1], Versus_BlindSplitDiff2);
    calculateDiff(versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1], timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1], Versus_StrongholdSplitDiff2);
    calculateDiff(versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1], timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], Versus_EndSplitDiff2);
    calculateDiff(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1] + versus_timings2["nether"]["splits"][0] / versus_timings2["nether"]["splits"][1] + versus_timings2["bastion"]["splits"][0] / versus_timings2["bastion"]["splits"][1] + versus_timings2["fortress"]["splits"][0] / versus_timings2["fortress"]["splits"][1] + versus_timings2["blind"]["splits"][0] / versus_timings2["blind"]["splits"][1] + versus_timings2["stronghold"]["splits"][0] / versus_timings2["stronghold"]["splits"][1] + versus_timings2["end"]["splits"][0] / versus_timings2["end"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1] + timings[seedType[1]]["nether"]["splits"][0] / timings[seedType[1]]["nether"]["splits"][1] + timings[seedType[1]]["bastion"]["splits"][0] / timings[seedType[1]]["bastion"]["splits"][1] + timings[seedType[1]]["fortress"]["splits"][0] / timings[seedType[1]]["fortress"]["splits"][1] + timings[seedType[1]]["blind"]["splits"][0] / timings[seedType[1]]["blind"]["splits"][1] + timings[seedType[1]]["stronghold"]["splits"][0] / timings[seedType[1]]["stronghold"]["splits"][1] + timings[seedType[1]]["end"]["splits"][0] / timings[seedType[1]]["end"]["splits"][1], Versus_CompletionSplitDiff2);

    calculateDiff(versus_timings2["overworld"]["splits"][0] / versus_timings2["overworld"]["splits"][1], timings[seedType[1]]["overworld"]["splits"][0] / timings[seedType[1]]["overworld"]["splits"][1], Versus_NetherEnterDiff2);
    calculateDiff(versus_timings2["bastion"]["timestamps"][0] / versus_timings2["bastion"]["timestamps"][1], timings[seedType[1]]["bastion"]["timestamps"][0] / timings[seedType[1]]["bastion"]["timestamps"][1], Versus_BastionEnterDiff2);
    calculateDiff(versus_timings2["fortress"]["timestamps"][0] / versus_timings2["fortress"]["timestamps"][1], timings[seedType[1]]["fortress"]["timestamps"][0] / timings[seedType[1]]["fortress"]["timestamps"][1], Versus_FortressEnterDiff2);
    calculateDiff(versus_timings2["blind"]["timestamps"][0] / versus_timings2["blind"]["timestamps"][1], timings[seedType[1]]["blind"]["timestamps"][0] / timings[seedType[1]]["blind"]["timestamps"][1], Versus_BlindEnterDiff2);
    calculateDiff(versus_timings2["stronghold"]["timestamps"][0] / versus_timings2["stronghold"]["timestamps"][1], timings[seedType[1]]["stronghold"]["timestamps"][0] / timings[seedType[1]]["stronghold"]["timestamps"][1], Versus_StrongholdEnterDiff2);
    calculateDiff(versus_timings2["end"]["timestamps"][0] / versus_timings2["end"]["timestamps"][1], timings[seedType[1]]["end"]["timestamps"][0] / timings[seedType[1]]["end"]["timestamps"][1], Versus_EndEnterDiff2);
    calculateDiff(versus_timings2["completions"][0] / versus_timings2["completions"][1], timings[seedType[1]]["completions"][0] / timings[seedType[1]]["completions"][1], Versus_AvgCompletionDiff2);

    calculateDiff(versus_overworlds2["BURIED_TREASURE"][0] / versus_overworlds2["BURIED_TREASURE"][1], overworlds["BURIED_TREASURE"][0] / overworlds["BURIED_TREASURE"][1], Versus_BuriedTreasureDiff2);
    calculateDiff(versus_overworlds2["VILLAGE"][0] / versus_overworlds2["VILLAGE"][1], overworlds["VILLAGE"][0] / overworlds["VILLAGE"][1], Versus_VillageDiff2);
    calculateDiff(versus_overworlds2["SHIPWRECK"][0] / versus_overworlds2["SHIPWRECK"][1], overworlds["SHIPWRECK"][0] / overworlds["SHIPWRECK"][1], Versus_ShipwreckDiff2);
    calculateDiff(versus_overworlds2["DESERT_TEMPLE"][0] / versus_overworlds2["DESERT_TEMPLE"][1], overworlds["DESERT_TEMPLE"][0] / overworlds["DESERT_TEMPLE"][1], Versus_DesertTempleDiff2);
    calculateDiff(versus_overworlds2["RUINED_PORTAL"][0] / versus_overworlds2["RUINED_PORTAL"][1], overworlds["RUINED_PORTAL"][0] / overworlds["RUINED_PORTAL"][1], Versus_RuinedPortalDiff2);

    calculateDiff(versus_bastions2["BRIDGE"][0] / versus_bastions2["BRIDGE"][1], bastions["BRIDGE"][0] / bastions["BRIDGE"][1], Versus_BridgeDiff2);
    calculateDiff(versus_bastions2["HOUSING"][0] / versus_bastions2["HOUSING"][1], bastions["HOUSING"][0] / bastions["HOUSING"][1], Versus_HousingDiff2);
    calculateDiff(versus_bastions2["STABLES"][0] / versus_bastions2["STABLES"][1], bastions["STABLES"][0] / bastions["STABLES"][1], Versus_StablesDiff2);
    calculateDiff(versus_bastions2["TREASURE"][0] / versus_bastions2["TREASURE"][1], bastions["TREASURE"][0] / bastions["TREASURE"][1], Versus_TreasureDiff2);
}

async function versus_call_Ranked_GetUserMatches() {
    try {
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

        const response = await fetch("https://api.mcsrranked.com/users/" + versusIGN + "/matches?type=" + versus_gamemode2 + "&count=" + versus_matchCount2);
        const statusCode = response.status;

        promises = [];

        versus_overworlds2 = {
            "BURIED_TREASURE": [0, 0],
            "VILLAGE": [0, 0],
            "SHIPWRECK": [0, 0],
            "DESERT_TEMPLE": [0, 0],
            "RUINED_PORTAL": [0, 0],
        }

        versus_bastions2 = {
            "BRIDGE": [0, 0, 0, 0, 0],
            "HOUSING": [0, 0, 0, 0, 0],
            "STABLES": [0, 0, 0, 0, 0],
            "TREASURE": [0, 0, 0, 0, 0]
        }

        versus_timings2 = {
            "overworld": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "nether": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "bastion": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "fortress": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "blind": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "stronghold": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "end": {
                "splits": [0, 0],
                "timestamps": [0, 0],
                "deaths": 0,
                "resets": 0
            },
            "completions": [0, 0]
        };

        if (statusCode != 200) {
            PageTitle.textContent = "Error code: " + statusCode + " | Ranked Analysis";
            switch (statusCode) {
                case 400:
                    loadingText.textContent = "Invalid IGN!";
                    break;
                case 429:
                    loadingText.textContent = "Too many requests being made! Please wait a few minutes before proceeding!";
                    break;
            }
            return;
        }

        const data = await response.json();

        for (const match of data["data"]) {
            const matchID = match["id"];
            promises.push(versus_call_Ranked_GetMatch2(matchID));
        }

        await Promise.all(promises);

        BackButton.style.display = "block";

        Versus_NameplatePlayer1.style.display = "block";
        Versus_NameplatePlayer2.style.display = "block";

        Versus_Config1.style.display = "inline-flex";
        Versus_Config2.style.display = "inline-flex";

        Versus_Data1.style.display = "block";
        Versus_Data2.style.display = "block";

        LoadingText.style.display = "none";
        LoadingParrot.style.display = "none";

        versus_display_info();
    } catch (error) {
        console.error("ERROR IN 'versus_call_Ranked_GetUserMatches': ", error);
    }
}