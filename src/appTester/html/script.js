const board = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');
const svg = document.getElementById('lines');
const cells = [];
let currentPlayer = 1; // Spieler 1 startet
const playerColors = ['red', 'blue']; // Farben für Spieler 1 und 2
let totalPlacedStones = 0;
let maxStonesRedPlayer = 9;//Hier anpassen falls kürzereRunden gewollt
let maxStonesBluePlayer = 9;
let currentPhase = 1;//Aktuelle Spielphase
let selectedCellIndex = null;
let millFormed = false;

//Globale Variablen   ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// Positionen und Nachbarschaften
const positions = [
    { x: 5, y: 5 }, { x: 250, y: 5 }, { x: 495, y: 5 },
    { x: 495, y: 250 }, { x: 495, y: 495 }, { x: 250, y: 495 },
    { x: 5, y: 495 }, { x: 5, y: 250 },
    { x: 95, y: 95 }, { x: 250, y: 95 }, { x: 405, y: 95 },
    { x: 405, y: 250 }, { x: 405, y: 405 }, { x: 250, y: 405 },
    { x: 95, y: 405 }, { x: 95, y: 250 },
    { x: 160, y: 160 }, { x: 250, y: 160 }, { x: 340, y: 160 },
    { x: 340, y: 250 }, { x: 340, y: 340 }, { x: 250, y: 340 },
    { x: 160, y: 340 }, { x: 160, y: 250 }
];
//Nachbarn jedesFeldes
const neighbors = {
    0: [1, 7], 
    1: [0, 2, 9], 
    2: [1, 3],
    3: [2, 4, 11], 
    4: [3, 5], 
    5: [4, 6, 13],
    6: [5, 7], 
    7: [0, 6, 15], 
    8: [9, 15],
    9: [1, 8, 10, 17], 
    10: [9, 11],
    11: [3, 10, 12, 19], 
    12: [11, 13],
    13: [5, 12, 14, 21], 
    14: [13, 15],
    15: [7, 8, 14, 23], 
    16: [17, 23],
    17: [9, 16, 18], 
    18: [17, 19],
    19: [11, 18, 20], 
    20: [19, 21],
    21: [13, 20, 22], 
    22: [21, 23],
    23: [15, 16, 22]
};
// Alle möglichen Mühlen
const mills = [
    [0, 1, 2],[8, 9, 10], [16, 17, 18],//Horizontal untere 3
    [7, 15, 23], [19, 11, 3],//Horizontal mitte links,rechts
    [22, 21, 20], [14, 13, 12], [6, 5, 4],//Horizontal untere 3 
    [0, 7, 6], [8, 15, 14], [16, 23, 22], //Vertikal linke 3
    [1, 9, 17], [21, 13, 5],//Vertikal mitte oben,unten
    [18, 19, 20], [10, 11, 12], [2, 3, 4] //Vertikal rechte 3
];

//Spielfeld erstellen   ----------------------------------------------------------------------------------------------------------------------------------------------------------------

positions.forEach((pos, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;

    cell.style.left = `${pos.x}px`;
    cell.style.top = `${pos.y}px`;

    cell.addEventListener('click', () => handleCellClick(index));

    cells.push({ player: null, element: cell });
    board.appendChild(cell);
});

// Linien zwischen Nachbarn zeichnen
function drawLines() {
    for (const [index, neighborsList] of Object.entries(neighbors)) {
        const startPos = positions[index];
        neighborsList.forEach(neighbor => {
            const endPos = positions[neighbor];
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startPos.x + 15);
            line.setAttribute('y1', startPos.y + 15);
            line.setAttribute('x2', endPos.x + 15);
            line.setAttribute('y2', endPos.y + 15);
            svg.appendChild(line);
        });
    }
}

drawLines(); // Spielfeldlinien zeichnen

//Spielfunktionen   ----------------------------------------------------------------------------------------------------------------------------------------------------------------

function handleCellClick(index) {
    if (currentPhase !== 1) {
        console.log('Steine können nur in Phase 1 platziert werden.');
        return;
    }
    if (millFormed) {
        handleStoneRemoval(index);
    } else if (totalPlacedStones < maxStonesRedPlayer + maxStonesBluePlayer) {
        placeStone(index);
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    gameStatus.textContent = `Spieler ${currentPlayer} ist am Zug`;
}

// Funktion zum Platzieren eines Steins
function placeStone(index) {
    if (currentPhase !== 1) {
        console.log('Steine können nur in Phase 1 platziert werden.');
        return;
    }
    const cell = cells[index];

    if (cell.player !== null) {
        alert('Dieses Feld ist bereits besetzt!');
        return;
    }

    cell.player = currentPlayer;
    cell.element.style.backgroundColor = playerColors[currentPlayer - 1];
    cell.element.classList.add('occupied');
    totalPlacedStones++;

    if (checkMill(currentPlayer, index)) {
        gameStatus.textContent = `Spieler ${currentPlayer} hat eine Mühle gebildet! Entferne einen gegnerischen Stein.`;
        millFormed = true;
        highlightRemovableStones();
    } else {
        switchPlayer();
    }
}

// Überprüfe, ob eine Mühle gebildet wurde
function checkMill(player, currentIndex) {
    return mills.some(mill => mill.includes(currentIndex) && mill.every(idx => cells[idx].player === player));
}

//Schaut, sich alle exestierenden Mühlen an
function isInMill(index) {  
    const player = cells[index].player;
    if (player === null) return false; // Kein Stein auf diesem Feld
    // Prüfen, ob der Stein Teil einer Mühle ist
    return mills.some(mill => mill.includes(index) && mill.every(idx => cells[idx].player === player));
}

// Entferne Stein
function handleStoneRemoval(index) {
    const cell = cells[index];
    if (!cell.element.classList.contains('removable')) return;

    cell.player = null;
    cell.element.style.backgroundColor = '';
    cell.element.classList.remove('occupied', 'removable');

    // Highlights entfernen und zur normalen Phase zurückkehren
    totalPlacedStones--;
    clearRemovableHighlights();
    millFormed = false;
    checkPlayerStoneCount(); //Check nach sieg
    switchPlayer();
}

function highlightRemovableStones() {
    let nonMillStonesAvailable = false;

    // Prüfe, ob es Steine gibt, die nicht in einer Mühle sind
    cells.forEach((cell, index) => {
        if (cell.player !== null && cell.player !== currentPlayer) {
            if (!isInMill(index)) {
                nonMillStonesAvailable = true; // Mindestens ein Stein ist nicht in einer Mühle
            }
        }
    });

    // Markiere Steine zum Entfernen
    cells.forEach((cell, index) => {
        if (cell.player !== null && cell.player !== currentPlayer) {
            // Nur Steine markieren, die nicht in einer Mühle sind
            if (nonMillStonesAvailable) {
                if (!isInMill(index)) {
                    cell.element.classList.add('removable');
                }
            } else {
                // Falls alle Steine in einer Mühle sind, alle markierbar machen
                cell.element.classList.add('removable');
            }
        }
    });
}

// Entfernt das Highlight von allen Steinen
function clearRemovableHighlights() {
    cells.forEach(cell => {
        cell.element.classList.remove('removable');
    });
}

// Funktion zum Zählen der Steine eines Spielers
function countPlayerStones(player) {
    return cells.filter(cell => cell.player === player).length;
}

// Check, ob ein Spieler weniger als 3 Steine hat
function checkPlayerStoneCount() {
    const redPlayerStones = countPlayerStones(1);
    const bluePlayerStones = countPlayerStones(2);

    if (redPlayerStones < 3) {
        alert('Spieler 1 hat weniger als 3 Steine! Spieler 2 gewinnt!');
        resetGame();
    } else if (bluePlayerStones < 3) {
        alert('Spieler 2 hat weniger als 3 Steine! Spieler 1 gewinnt!');
        resetGame();
    }
}

// Phase 2 & 3: Stein bewegen
let selectedStoneIndex = null; // Zum Speichern des ausgewählten Steins

function handleCellClickPhase2(index) {
    const cell = cells[index];
    checkPlayerStoneCount(); // Prüfe Steine nach Bewegung
    if (millFormed) {
        handleStoneRemoval(index);
    }
    else if (selectedStoneIndex === null) {
        // Auswahl eines eigenen Steins
        if (cell.player === currentPlayer) {
            selectedStoneIndex = index;
            cell.element.classList.add('selected');
            highlightMovableCells(index);
        } /*else {
            alert('Wähle einen eigenen Stein aus!');
        }*/
    } else if (selectedStoneIndex === index) {
        // Abwählen des Steins
        cell.element.classList.remove('selected');
        selectedStoneIndex = null;
        clearMoveHighlights();
    } else {
        // Zielposition für den Stein auswählen
        if (cell.player === null && (isNeighbor(selectedStoneIndex, index) || canJumpPhase3())) {
            moveStone(selectedStoneIndex, index);
            selectedStoneIndex = null;
            clearMoveHighlights();
        } else {
            alert('Ungültiger Zug! Wähle ein benachbartes Feld oder springe, falls erlaubt.');
        }
    }
}

// Highlight mögliche Züge
function highlightMovableCells(index) {
    const playerStoneCount = countPlayerStones(currentPlayer);
    if (playerStoneCount === 3) {
        // Highlight alle freien Felder in Phase 3
        cells.forEach((cell, i) => {
            if (cell.player === null) {
                cell.element.classList.add('movable');
            }
        });
    } else {
        // Highlight nur benachbarte Felder in Phase 2
        const neighborsList = neighbors[index];
        neighborsList.forEach(neighborIndex => {
            if (cells[neighborIndex].player === null) {
                cells[neighborIndex].element.classList.add('movable');
            }
        });
    }
}

// Entferne Move-Highlights
function clearMoveHighlights() {
    cells.forEach(cell => cell.element.classList.remove('movable', 'selected'));
}

// Stein bewegen
function moveStone(fromIndex, toIndex) {
    const fromCell = cells[fromIndex];
    const toCell = cells[toIndex];

    // Stein bewegen
    toCell.player = currentPlayer;
    toCell.element.style.backgroundColor = playerColors[currentPlayer - 1];
    toCell.element.classList.add('occupied');

    fromCell.player = null;
    fromCell.element.style.backgroundColor = '';
    fromCell.element.classList.remove('occupied');

    // Mühlen-Check nach Bewegung
    if (checkMill(currentPlayer, toIndex)) {
        gameStatus.textContent = `Spieler ${currentPlayer} hat eine Mühle gebildet! Entferne einen gegnerischen Stein.`;
        millFormed = true;
        highlightRemovableStones();
    } else {
        switchPlayer();
        checkPlayerStoneCount(); // Prüfe Steine nach Spielerwechsel
    }
}

// Prüfen, ob ein Index Nachbar eines anderen ist
function isNeighbor(fromIndex, toIndex) {
    return neighbors[fromIndex].includes(toIndex);
}

// Prüfen, ob der Spieler in Phase 3 springen kann
function canJumpPhase3() {
    return countPlayerStones(currentPlayer) === 3;
}

// Spiel zur Phase 2 wechseln
function startPhase2() {
    currentPhase = 2;//Diabled die funktionen aus phase 1
    gameStatus.textContent = `Phase 2: Spieler ${currentPlayer} ist am Zug - Bewege deine Steine.`;
    cells.forEach((cell, index) => {
        cell.element.removeEventListener('click', () => handleCellClick(index));
        cell.element.addEventListener('click', () => handleCellClickPhase2(index));
    });
}

// Spiel resetten (optional)
function resetGame() {
    location.reload();
}

// Beispiel: Start der Phase 2, nachdem alle Steine platziert wurden
function checkPhaseTransition() {
    if (totalPlacedStones === maxStonesRedPlayer + maxStonesBluePlayer) {
        startPhase2();
    }
}

// Aufruf der Phasenüberprüfung nach jedem Zug
function placeStone(index) {
    const cell = cells[index];

    if (cell.player !== null) {
        alert('Dieses Feld ist bereits besetzt!');
        return;
    }

    cell.player = currentPlayer;
    cell.element.style.backgroundColor = playerColors[currentPlayer - 1];
    cell.element.classList.add('occupied');
    totalPlacedStones++;

    if (checkMill(currentPlayer, index)) {
        gameStatus.textContent = `Spieler ${currentPlayer} hat eine Mühle gebildet! Entferne einen gegnerischen Stein.`;
        millFormed = true;
        highlightRemovableStones();
    } else {
        switchPlayer();
        checkPhaseTransition(); // Phase 2 starten, wenn alle Steine platziert sind
    }
}