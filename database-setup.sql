USE tankz;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS entities;
DROP TABLE IF EXISTS lobbies;
DROP PROCEDURE IF EXISTS addEntity;
DROP PROCEDURE IF EXISTS addPlayer;
DROP PROCEDURE IF EXISTS createLobby;
-- Table Setup
CREATE TABLE lobbies(
lobbyID VARCHAR(256),
expirationTime DATETIME,
PRIMARY KEY (lobbyID)
);

CREATE TABLE players(
	UUID varchar(256),
    UEID varchar(256),
    nickname varchar(256),
	lobbyID varchar(256),
    score int,
    PRIMARY KEY (UUID),
    FOREIGN KEY (lobbyID) REFERENCES lobbies(lobbyID)
);


CREATE TABLE entities(
	lobbyID varchar(256),
    UEID varchar(256),
    xPos float,
    yPos float,
    rotation float,
    entityType ENUM("player","bullet","powerup"),
    PRIMARY KEY (UEID),
    FOREIGN KEY (lobbyID) REFERENCES lobbies(lobbyID)
);


SELECT * FROM players WHERE lobbyId = '5';

-- Procedure stuff 
DELIMITER $
CREATE PROCEDURE addEntity(
IN lobbyID varchar(256),
IN xPos float,
IN yPos float,
IN rotation float,
IN entityType varchar(256),
OUT outUEID varchar(256)
)
BEGIN
SET @tempUEID = NULL;
  SELECT MAX(UEID) INTO @tempUEID from entities;
  IF @tempUEID IS NULL THEN
	  SET @tempUEID = 1;
  ELSE
	  SET @tempUEID = @tempUEID + 1;
	END IF;
    SET outUEID = @tempUEID;
	INSERT INTO entities VALUES (lobbyID,@tempUEID,xPos,yPos,rotation,entityType);
END
$


CREATE PROCEDURE addPlayer(
IN lobbyID varchar(256),
IN nickname varchar(256),
OUT outUUID varchar(256)
)
BEGIN
SET @tempUUID = NULL;
  SELECT MAX(UUID) INTO @tempUUID from players;
  IF @tempUUID IS NULL THEN
	  SET @tempUUID = 1;
  ELSE
	  SET @tempUUID = @tempUUID + 1;
	END IF;
	CALL addEntity(lobbyID, 0,0,0,"player",@UEID);
    INSERT INTO players VALUES (@tempUUID,@UEID,nickname,lobbyID,0);
    set outUUID = @tempUUID; 
END
$

CREATE PROCEDURE createLobby(OUT outLobbyID varchar(256))
BEGIN
SET @tempLobbyID = SUBSTRING(CONV(FLOOR(RAND() * 99999999999999), 10, 36),1,6);
INSERT INTO lobbies VALUES(@tempLobbyID,"10/10/10");
SET outLobbyID = @tempLobbyID;
END
$
DELIMITER ;

CALL createLobby(@lobbyID);
SELECT * FROM lobbies;


-- SELECT * FROM players;