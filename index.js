let gamemode = 0;

const RankedButton = document.getElementById("Ranked");
const PrivateButton = document.getElementById("Private");

RankedButton.style.backgroundColor = "#507699";

RankedButton.addEventListener("click", function() {
    gamemode = 0;
    RankedButton.style.backgroundColor = "#507699";
    if (PrivateButton.style.backgroundColor == "#507699") {
        PrivateButton.style.backgroundColor = "#202F3D";
    }
})

PrivateButton.addEventListener("click", function() {
    gamemode = 1;
    PrivateButton.style.backgroundColor = "#507699";
    if (RankedButton.style.backgroundColor == "#507699") {
        console.log("W");
        RankedButton.style.backgroundColor = "#202F3D";
    }
})

console.log(RankedButton.style.backgroundColor);