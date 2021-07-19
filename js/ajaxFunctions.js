// Get entities in lobby by pinging getPlayersInLobby.php and passing in lobbyID 
function getPlayersInLobby(lobbyId) {
    $.ajax({
        type: "GET",
        url: "getPlayersInLobby.php",
        data: {
            lobbyId: lobbyId
        },
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    });
}

function getEntitiesInLobby(lobbyId) {
    $.ajax({
        type: "GET",
        url: "getEntitiesInLobby.php",
        data: {
            lobbyId: lobbyId
        },
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    });
}

function createLobby(callback) {
    console.log("AM HERE");
    $.ajax({
        type: "GET",
        url: "createLobby.php",
        success: function (data) {
            callback ? callback(data) : null;
        }
    });
}

getPlayersInLobby("6A3FBM")

createLobby();



// setInterval(function () {
//     getPlayersInLobby("6A3FBM")
// }, 33.33);