function setMainScreen(screen) {
    $(".screen").hide();
    $("#" + screen).show();
}



function createLobbyAction() {
    setMainScreen("waitingRoom");
    createLobby(createLobbyCallback)
}

function createLobbyCallback(lobbyCode) {
    $("#lobbyCode").text(lobbyCode);
}



setMainScreen("titleScreen")