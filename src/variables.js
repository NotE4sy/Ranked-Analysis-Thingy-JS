// Variables
let gamemode = 2; // 1 = casual, 2 = ranked, 3 = private
let gamemodeColorLock = false;
let gamemodeContentHover = false;
let gamemodeButtonHover = false;

let seedTypeButtonHover = false;
let seedTypeButtonColorLock = false;
let seedTypeContentHover = false;

let versus_gamemodeColorLock1 = false;
let versus_gamemodeColorLock2 = false;

let versus_gamemodeButtonHover1 = false;
let versus_gamemodeButtonHover2 = false;

let versus_gamemodeContentHover1 = false;
let versus_gamemodeContentHover2 = false;

const gamemodes = ["Casual", "Ranked", "Private"];

const defaultMatchCount = 20;
const matchCountLimit = 50;

let previousName = "";
let previousMatchCount = defaultMatchCount;
let matchCount = defaultMatchCount;

let ign = "";
let uuid = "";

let originalIGN = "";

let versusUUID = "";
let versusToggle = false;
let versusIGN = ""
let previousVersusIGN = "";

let versus_gamemode2 = 2;

let versus_matchCount2 = defaultMatchCount;
let versus_previousMatchCount1 = defaultMatchCount;
let versus_previousMatchCount2 = defaultMatchCount;

const parrots = [
    "gifs/BlueParrotDancing.gif",
    "gifs/CyanParrotDancing.gif",
    "gifs/GreyParrotDancing.gif",
    "gifs/RedParrotDancing.gif"
]

let overworlds = {
    "BURIED_TREASURE": [0, 0],
    "VILLAGE": [0, 0],
    "SHIPWRECK": [0, 0],
    "DESERT_TEMPLE": [0, 0],
    "RUINED_PORTAL": [0, 0],
}

let bastions = { // 0 = time, 1 = no. completed, 2 = no. entered, 3 = deaths, 4 = resets
    "BRIDGE": [0, 0, 0, 0, 0],
    "HOUSING": [0, 0, 0, 0, 0],
    "STABLES": [0, 0, 0, 0, 0],
    "TREASURE": [0, 0, 0, 0, 0]
}

let timings = {
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

let versus_overworlds2 = {
    "BURIED_TREASURE": [0, 0],
    "VILLAGE": [0, 0],
    "SHIPWRECK": [0, 0],
    "DESERT_TEMPLE": [0, 0],
    "RUINED_PORTAL": [0, 0],
}

let versus_bastions2 = { // The same as the normal bastions bs
    "BRIDGE": [0, 0, 0, 0, 0],
    "HOUSING": [0, 0, 0, 0, 0],
    "STABLES": [0, 0, 0, 0, 0],
    "TREASURE": [0, 0, 0, 0, 0]
}

let versus_timings2 = {
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

// Elements
const PageTitle = document.getElementById("pageTitle");

const Nameplate = document.getElementById("nameplate");

const PlayerName = document.getElementById("playerName");
const PbLabel = document.getElementById("pbLabel");
const WinRateLabel = document.getElementById("winRateLabel");
const PlayerModel = document.getElementById("playerModel");
const NameplateParrot = document.getElementById("nameplateParrot");

const PlayerNameContainer = document.getElementById("playerNameContainer");
const PlayerModelContainer = document.getElementById("playerModelContainer");
const PlayerInfoContainer = document.getElementById("playerInfoContainer");
const NameplateLoading = document.getElementById("nameplateLoading");

const BackButton = document.getElementById("back");

const configUI = document.getElementById("configUI");

const GamemodeDiv = document.getElementById("gamemodeDiv");

const GamemodeButton = document.getElementById("gamemodeButton");
const GamemodeContent = document.getElementById("gamemodeContent");
const GamemodeItems = GamemodeContent.querySelectorAll(".gamemodeItem");

const MatchCountChanger = document.getElementById("matchCountChanger");

const MatchCount = document.getElementById("MatchCount");
const MatchCountSlider = document.getElementById("matchCountSlider");

const SeedTypeDiv = document.getElementById("seedTypeDiv");
const SeedTypeButton = document.getElementById("seedTypeButton");
const SeedTypeContent = document.getElementById("seedTypeContent");
const SeedTypeItems = SeedTypeContent.querySelectorAll(".seedTypeItem");

// Versus Elements
const VersusButton = document.getElementById("versusButton");
const VersusSearch = document.getElementById("versusSearch");
const VersusSearchText = document.getElementById("versusSearchText");

const Versus_NameplatePlayer1 = document.getElementById("nameplatePlayer1");
const Versus_WinRateLabel1 = document.getElementById("versus_winRateLabel1");
const Versus_PbLabel1 = document.getElementById("versus_pbLabel1");
const Versus_PlayerName1 = document.getElementById("versus_playerName1");
const Versus_PlayerModel1 = document.getElementById("versus_playerModel1");

const Versus_GamemodeButton1 = document.getElementById("versus_gamemodeButton1");
const Versus_GamemodeContent1 = document.getElementById("versus_gamemodeContent1");
const Versus_GamemodeItems1 = Versus_GamemodeContent1.querySelectorAll(".gamemodeItem");

const Versus_GamemodeButton2 = document.getElementById("versus_gamemodeButton2");
const Versus_GamemodeContent2 = document.getElementById("versus_gamemodeContent2");
const Versus_GamemodeItems2 = Versus_GamemodeContent2.querySelectorAll(".gamemodeItem");

const Versus_MatchCount1 = document.getElementById("versus_matchCount1");
const Versus_MatchCount2 = document.getElementById("versus_matchCount2");
const Versus_MatchCountSlider1 = document.getElementById("versus_matchCountSlider1");
const Versus_MatchCountSlider2 = document.getElementById("versus_matchCountSlider2");

const Versus_NameplatePlayer2 = document.getElementById("nameplatePlayer2");
const Versus_WinRateLabel2 = document.getElementById("versus_winRateLabel2");
const Versus_PbLabel2 = document.getElementById("versus_pbLabel2");
const Versus_PlayerName2 = document.getElementById("versus_playerName2");
const Versus_PlayerModel2 = document.getElementById("versus_playerModel2");

const Versus_Config1 = document.getElementById("versus_config1");
const Versus_Config2 = document.getElementById("versus_config2");

const LoadingText = document.getElementById("loadingText");
const LoadingParrot = document.getElementById("loadingParrot");

const dataSection = document.getElementById("data");

const OverworldSplit = document.getElementById("overworldSplit");
const NetherSplit = document.getElementById("netherSplit");
const BastionSplit = document.getElementById("bastionSplit");
const FortressSplit = document.getElementById("fortressSplit");
const BlindSplit = document.getElementById("blindSplit");
const StrongholdSplit = document.getElementById("strongholdSplit");
const EndSplit = document.getElementById("endSplit");
const CompletionSplits = document.getElementById("completionSplits");

const OverworldDeaths = document.getElementById("overworldDeaths");
const NetherDeaths = document.getElementById("netherDeaths");
const BastionDeaths = document.getElementById("bastionDeaths");
const FortressDeaths = document.getElementById("fortressDeaths");
const BlindDeaths = document.getElementById("blindDeaths");
const StrongholdDeaths = document.getElementById("strongholdDeaths");
const EndDeaths = document.getElementById("endDeaths");

const OverworldResets = document.getElementById("overworldResets");
const NetherResets = document.getElementById("netherResets");
const BastionResets = document.getElementById("bastionResets");
const FortressResets = document.getElementById("fortressResets");
const BlindResets = document.getElementById("blindResets");
const StrongholdResets = document.getElementById("strongholdResets");
const EndResets = document.getElementById("endResets");

const NetherTimestamp = document.getElementById("netherTimestamp");
const BastionTimestamp = document.getElementById("bastionTimestamp");
const FortressTimestamp = document.getElementById("fortressTimestamp");
const BlindTimestamp = document.getElementById("blindTimestamp");
const StrongholdTimestamp = document.getElementById("strongholdTimestamp");
const EndTimestamp = document.getElementById("endTimestamp");
const AverageCompletion = document.getElementById("avgCompletion");

const BuriedTreasure = document.getElementById("bt");
const Village = document.getElementById("village");
const Shipwreck = document.getElementById("shipwreck");
const DesertTemple = document.getElementById("dt");
const RuinedPortal = document.getElementById("rp");

const Bridge = document.getElementById("bridge");
const Housing = document.getElementById("housing");
const Stables = document.getElementById("stables");
const Treasure = document.getElementById("treasure");

const BridgeDeaths = document.getElementById("bridgeDeaths");
const HousingDeaths = document.getElementById("housingDeaths");
const StablesDeaths = document.getElementById("stablesDeaths");
const TreasureDeaths = document.getElementById("treasureDeaths");

const BridgeResets = document.getElementById("bridgeResets");
const HousingResets = document.getElementById("housingResets");
const StablesResets = document.getElementById("stablesResets");
const TreasureResets = document.getElementById("treasureResets");

const Versus_Data1 = document.getElementById("versus_data1");
const Versus_Data2 = document.getElementById("versus_data2");

const Versus_OverworldSplit1 = document.getElementById("versus_overworldSplit1");
const Versus_NetherSplit1 = document.getElementById("versus_netherSplit1");
const Versus_BastionSplit1 = document.getElementById("versus_bastionSplit1");
const Versus_FortressSplit1 = document.getElementById("versus_fortressSplit1");
const Versus_BlindSplit1 = document.getElementById("versus_blindSplit1");
const Versus_StrongholdSplit1 = document.getElementById("versus_strongholdSplit1");
const Versus_EndSplit1 = document.getElementById("versus_endSplit1");
const Versus_CompletionSplits1 = document.getElementById("versus_completionSplits1");

const Versus_OverworldSplitDiff1 = document.getElementById("versus_overworldSplitDiff1");
const Versus_NetherSplitDiff1 = document.getElementById("versus_netherSplitDiff1");
const Versus_BastionSplitDiff1 = document.getElementById("versus_bastionSplitDiff1");
const Versus_FortressSplitDiff1 = document.getElementById("versus_fortressSplitDiff1");
const Versus_BlindSplitDiff1 = document.getElementById("versus_blindSplitDiff1");
const Versus_StrongholdSplitDiff1 = document.getElementById("versus_strongholdSplitDiff1");
const Versus_EndSplitDiff1 = document.getElementById("versus_endSplitDiff1");
const Versus_CompletionSplitDiff1 = document.getElementById("versus_completionSplitsDiff1");

const Versus_OverworldSplitDiff2 = document.getElementById("versus_overworldSplitDiff2");
const Versus_NetherSplitDiff2 = document.getElementById("versus_netherSplitDiff2");
const Versus_BastionSplitDiff2 = document.getElementById("versus_bastionSplitDiff2");
const Versus_FortressSplitDiff2 = document.getElementById("versus_fortressSplitDiff2");
const Versus_BlindSplitDiff2 = document.getElementById("versus_blindSplitDiff2");
const Versus_StrongholdSplitDiff2 = document.getElementById("versus_strongholdSplitDiff2");
const Versus_EndSplitDiff2 = document.getElementById("versus_endSplitDiff2");
const Versus_CompletionSplitDiff2 = document.getElementById("versus_completionSplitsDiff2");

const Versus_OverworldDeaths1 = document.getElementById("versus_overworldDeaths1");
const Versus_NetherDeaths1 = document.getElementById("versus_netherDeaths1");
const Versus_BastionDeaths1 = document.getElementById("versus_bastionDeaths1");
const Versus_FortressDeaths1 = document.getElementById("versus_fortressDeaths1");
const Versus_BlindDeaths1 = document.getElementById("versus_blindDeaths1");
const Versus_StrongholdDeaths1 = document.getElementById("versus_strongholdDeaths1");
const Versus_EndDeaths1 = document.getElementById("versus_endDeaths1");

const Versus_OverworldResets1 = document.getElementById("versus_overworldResets1");
const Versus_NetherResets1 = document.getElementById("versus_netherResets1");
const Versus_BastionResets1 = document.getElementById("versus_bastionResets1");
const Versus_FortressResets1 = document.getElementById("versus_fortressResets1");
const Versus_BlindResets1 = document.getElementById("versus_blindResets1");
const Versus_StrongholdResets1 = document.getElementById("versus_strongholdResets1");
const Versus_EndResets1 = document.getElementById("versus_endResets1");

const Versus_NetherTimestamp1 = document.getElementById("versus_netherTimestamp1");
const Versus_BastionTimestamp1 = document.getElementById("versus_bastionTimestamp1");
const Versus_FortressTimestamp1 = document.getElementById("versus_fortressTimestamp1");
const Versus_BlindTimestamp1 = document.getElementById("versus_blindTimestamp1");
const Versus_StrongholdTimestamp1 = document.getElementById("versus_strongholdTimestamp1");
const Versus_EndTimestamp1 = document.getElementById("versus_endTimestamp1");
const Versus_AverageCompletion1 = document.getElementById("versus_avgCompletion1");

const Versus_NetherEnterDiff1 = document.getElementById("versus_netherEnterDiff1");
const Versus_BastionEnterDiff1 = document.getElementById("versus_bastionEnterDiff1");
const Versus_FortressEnterDiff1 = document.getElementById("versus_fortressEnterDiff1");
const Versus_BlindEnterDiff1 = document.getElementById("versus_blindEnterDiff1");
const Versus_StrongholdEnterDiff1 = document.getElementById("versus_strongholdEnterDiff1");
const Versus_EndEnterDiff1 = document.getElementById("versus_endEnterDiff1");
const Versus_AvgCompletionDiff1 = document.getElementById("versus_avgCompletionDiff1");

const Versus_NetherEnterDiff2 = document.getElementById("versus_netherEnterDiff2");
const Versus_BastionEnterDiff2 = document.getElementById("versus_bastionEnterDiff2");
const Versus_FortressEnterDiff2 = document.getElementById("versus_fortressEnterDiff2");
const Versus_BlindEnterDiff2 = document.getElementById("versus_blindEnterDiff2");
const Versus_StrongholdEnterDiff2 = document.getElementById("versus_strongholdEnterDiff2");
const Versus_EndEnterDiff2 = document.getElementById("versus_endEnterDiff2");
const Versus_AvgCompletionDiff2 = document.getElementById("versus_avgCompletionDiff2");

const Versus_BuriedTreasure1 = document.getElementById("versus_bt1");
const Versus_Village1 = document.getElementById("versus_village1");
const Versus_Shipwreck1 = document.getElementById("versus_shipwreck1");
const Versus_DesertTemple1 = document.getElementById("versus_dt1");
const Versus_RuinedPortal1 = document.getElementById("versus_rp1");

const Versus_BuriedTreasureDiff1 = document.getElementById("versus_btDiff1");
const Versus_VillageDiff1 = document.getElementById("versus_villageDiff1");
const Versus_ShipwreckDiff1 = document.getElementById("versus_shipwreckDiff1");
const Versus_DesertTempleDiff1 = document.getElementById("versus_dtDiff1");
const Versus_RuinedPortalDiff1 = document.getElementById("versus_rpDiff1");

const Versus_BuriedTreasureDiff2 = document.getElementById("versus_btDiff2");
const Versus_VillageDiff2 = document.getElementById("versus_villageDiff2");
const Versus_ShipwreckDiff2 = document.getElementById("versus_shipwreckDiff2");
const Versus_DesertTempleDiff2 = document.getElementById("versus_dtDiff2");
const Versus_RuinedPortalDiff2 = document.getElementById("versus_rpDiff2");

const Versus_Bridge1 = document.getElementById("versus_bridge1");
const Versus_Housing1 = document.getElementById("versus_housing1");
const Versus_Stables1 = document.getElementById("versus_stables1");
const Versus_Treasure1 = document.getElementById("versus_treasure1");

const Versus_BridgeDeaths1 = document.getElementById("versus_bridgeDeaths1");
const Versus_HousingDeaths1 = document.getElementById("versus_housingDeaths1");
const Versus_StablesDeaths1 = document.getElementById("versus_stablesDeaths1");
const Versus_TreasureDeaths1 = document.getElementById("versus_treasureDeaths1");

const Versus_BridgeResets1 = document.getElementById("versus_bridgeResets1");
const Versus_HousingResets1 = document.getElementById("versus_housingResets1");
const Versus_StablesResets1 = document.getElementById("versus_stablesResets1");
const Versus_TreasureResets1 = document.getElementById("versus_treasureResets1");

const Versus_BridgeDiff1 = document.getElementById("versus_bridgeDiff1");
const Versus_HousingDiff1 = document.getElementById("versus_housingDiff1");
const Versus_StablesDiff1 = document.getElementById("versus_stablesDiff1");
const Versus_TreasureDiff1 = document.getElementById("versus_treasureDiff1");

const Versus_BridgeDiff2 = document.getElementById("versus_bridgeDiff2");
const Versus_HousingDiff2 = document.getElementById("versus_housingDiff2");
const Versus_StablesDiff2 = document.getElementById("versus_stablesDiff2");
const Versus_TreasureDiff2 = document.getElementById("versus_treasureDiff2");

const Versus_OverworldSplit2 = document.getElementById("versus_overworldSplit2");
const Versus_NetherSplit2 = document.getElementById("versus_netherSplit2");
const Versus_BastionSplit2 = document.getElementById("versus_bastionSplit2");
const Versus_FortressSplit2 = document.getElementById("versus_fortressSplit2");
const Versus_BlindSplit2 = document.getElementById("versus_blindSplit2");
const Versus_StrongholdSplit2 = document.getElementById("versus_strongholdSplit2");
const Versus_EndSplit2 = document.getElementById("versus_endSplit2");
const Versus_CompletionSplits2 = document.getElementById("versus_completionSplits2");

const Versus_OverworldDeaths2 = document.getElementById("versus_overworldDeaths2");
const Versus_NetherDeaths2 = document.getElementById("versus_netherDeaths2");
const Versus_BastionDeaths2 = document.getElementById("versus_bastionDeaths2");
const Versus_FortressDeaths2 = document.getElementById("versus_fortressDeaths2");
const Versus_BlindDeaths2 = document.getElementById("versus_blindDeaths2");
const Versus_StrongholdDeaths2 = document.getElementById("versus_strongholdDeaths2");
const Versus_EndDeaths2 = document.getElementById("versus_endDeaths2");

const Versus_OverworldResets2 = document.getElementById("versus_overworldResets2");
const Versus_NetherResets2 = document.getElementById("versus_netherResets2");
const Versus_BastionResets2 = document.getElementById("versus_bastionResets2");
const Versus_FortressResets2 = document.getElementById("versus_fortressResets2");
const Versus_BlindResets2 = document.getElementById("versus_blindResets2");
const Versus_StrongholdResets2 = document.getElementById("versus_strongholdResets2");
const Versus_EndResets2 = document.getElementById("versus_endResets2");

const Versus_NetherTimestamp2 = document.getElementById("versus_netherTimestamp2");
const Versus_BastionTimestamp2 = document.getElementById("versus_bastionTimestamp2");
const Versus_FortressTimestamp2 = document.getElementById("versus_fortressTimestamp2");
const Versus_BlindTimestamp2 = document.getElementById("versus_blindTimestamp2");
const Versus_StrongholdTimestamp2 = document.getElementById("versus_strongholdTimestamp2");
const Versus_EndTimestamp2 = document.getElementById("versus_endTimestamp2");
const Versus_AverageCompletion2 = document.getElementById("versus_avgCompletion2");

const Versus_BuriedTreasure2 = document.getElementById("versus_bt2");
const Versus_Village2 = document.getElementById("versus_village2");
const Versus_Shipwreck2 = document.getElementById("versus_shipwreck2");
const Versus_DesertTemple2 = document.getElementById("versus_dt2");
const Versus_RuinedPortal2 = document.getElementById("versus_rp2");

const Versus_Bridge2 = document.getElementById("versus_bridge2");
const Versus_Housing2 = document.getElementById("versus_housing2");
const Versus_Stables2 = document.getElementById("versus_stables2");
const Versus_Treasure2 = document.getElementById("versus_treasure2");

const Versus_BridgeDeaths2 = document.getElementById("versus_bridgeDeaths2");
const Versus_HousingDeaths2 = document.getElementById("versus_housingDeaths2");
const Versus_StablesDeaths2 = document.getElementById("versus_stablesDeaths2");
const Versus_TreasureDeaths2 = document.getElementById("versus_treasureDeaths2");

const Versus_BridgeResets2 = document.getElementById("versus_bridgeResets2");
const Versus_HousingResets2 = document.getElementById("versus_housingResets2");
const Versus_StablesResets2 = document.getElementById("versus_stablesResets2");
const Versus_TreasureResets2 = document.getElementById("versus_treasureResets2");