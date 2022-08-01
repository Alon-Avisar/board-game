var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';
var canMove = true;
var countBall = 0
var countRenderedCells = 0
var stuckMessage = document.querySelector('.stuck-message')



var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;

function initGame() {
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    setInterval(addBall, 4000);
    setInterval(addGlue, 5000);
    renderBoard(gBoard);
    getEmptyCells(gBoard)
}

function RestartGame(event) {
    initGame()
}

function addBall() {
    var i = getRandomInt(2, 8)
    var j = getRandomInt(2, 8)
    gBoard[i][j].gameElement = BALL;
    renderCell({ i, j }, BALL_IMG)
    countRenderedCells++
    console.log('CountRenderedCell:', countRenderedCells)
    if (countRenderedCells + 2 === countBall) {
        alert('Victory! , the game is over .')
        clearInterval(addBall);
    }
}

function addGlue() {
    var i = getRandomInt(2, 8)
    var j = getRandomInt(2, 8)
    gBoard[i][j].gameElement = 'GLUE';
    if (countRenderedCells + 2 === countBall) {
        clearInterval(addGlue);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)

}
// expected output: 0, 1 or 2
function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)

    board[8][6].gameElement = BALL;

    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };
            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }
            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    board[0][5].type = FLOOR
    board[9][5].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR

        // Place the gamer at selected position
        board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)

    board[6][4].gameElement = BALL;
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;

    console.log(board);
    return board;

}



// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j, isPortal) {

    var targetCell = gBoard[i][j];
    if (targetCell.type === WALL) return;

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || isPortal) {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!');
            countBall++
            playSound()
            var elcollect = document.querySelector(".collected-balls")
            elcollect.innerText = countBall
        }
        if(targetCell.gameElement === GLUE) {
            canMove = false
            stuckMessage.classList.add('display')
            setTimeout(() => {
                canMove = true
                stuckMessage.classList.remove('display')
            }, 3000)
        }
        console.log('countBall:', countBall)


        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
    if(canMove) {
        var i = gGamerPos.i;
        var j = gGamerPos.j;
        switch (event.key) {
            case 'ArrowLeft':
                if(i == 5 && j == 0) {
                    moveTo(5, 11, true);
                } else {
                    moveTo(i, j - 1);
                }
                break;
            case 'ArrowRight':
                if(i == 5 && j == 11) {
                    moveTo(5, 0, true);
                } else {
                    moveTo(i, j + 1);
                }
                break;
            case 'ArrowUp':
                if(i == 0 && j == 5) {
                    moveTo(9, 5, true);
                } else {
                    moveTo(i - 1, j);
                }
                break;
            case 'ArrowDown':
                if(i == 9 && j == 5) {
                    moveTo(0, 5, true);
                } else {
                    moveTo(i + 1, j);
                }
                break;

        }
    }
}


function getEmptyCells() {
    var emptyCell = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === null) {
                var cellLocation = { i, j }
                emptyCell.push(cellLocation)
            }
        }
    }
    return emptyCell
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function playSound() {
    var sound = new Audio("sound1/swa.mp3");
    sound.play();
}
