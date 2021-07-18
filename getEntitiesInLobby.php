<?php 
    if(isset($_GET['lobbyId'])){
        $lobbyId = $_GET["lobbyId"];
    }
    else {
        $lobbyId = "";
        echo "Must enter lobby ID";
    }
    $mysqli = new mysqli('mysql.matthewsand.info', 'tankz_admin', 'slee9hum3staw@BRI', 'tankz');
    $query = "SELECT * FROM entities WHERE lobbyId = '$lobbyId'";
    $result = $mysqli->query($query);
    $numRows = $result->num_rows;
    if($numRows == 0){
        echo "No entities in lobby";
    }
    else{
        $players = array();
        while($row = $result->fetch_assoc()){
            $tmpObject = new stdClass();
            $tmpObject->UEID = $row["UEID"];
            $tmpObject->entityType = $row["entityType"];
            $tmpObject->xPos = $row["xPos"];
            $tmpObject->yPos = $row["yPos"];
            $tmpObject->rotation = $row["rotation"];
            array_push($players, $tmpObject);
        }
        echo json_encode($players);
    }
?>