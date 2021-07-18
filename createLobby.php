<?php
$mysqli = new mysqli('mysql.matthewsand.info', 'tankz_admin', 'slee9hum3staw@BRI', 'tankz');
$query = "CALL createLobby(@lobbyID)";
$mysqli->query($query);
$query = "select @lobbyID";
$result = $mysqli->query($query)->fetch_assoc()['@lobbyID'];
echo $result;