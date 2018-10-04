const Player = (name, symbol) => {
    return {name, symbol};
};

const Computer = () => {
    const {name, symbol} = Player('The Computer', 'O');;

    const makeMove = (board) => {
        possibleMoves = [];
        board.boardArray.forEach((square, index) => {
            if (!square) {
                possibleMoves.push(index);
            }
        });
        let number = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        let square = document.getElementById(number);
        board.draw(symbol, square);
    };
    return {name, symbol, makeMove};
};

const Board = () => {
    let boardArray = [];
    let board = document.getElementById('board');

    const init = () => {
        for (i=0; i<9; i++) {
            boardArray.push(undefined);
            document.getElementById(i).textContent = "";
        }
        document.getElementById('line').style.visibility = 'hidden';
        let message = document.querySelector('#info h1')
        if (message) { message.remove(); }
        board.addEventListener('click', game.makeMove);
    };

    const draw = (symbol, square) => {
        let index = square.id
        let image = document.createElement('IMG');
        boardArray[index] = symbol;
        image.setAttribute('src', `assets/${symbol}.png`);
        square.appendChild(image);
    };

    const drawLine = array => {
        let line = document.getElementById('line');
        line.style.visibility = 'visible';
        const drawVertical = (left) => {
            line.style.transform = 'rotate(90deg)';
            line.style.top = '240px';
            line.style.left = left;
        };
        const drawHorizontal = (transform) => {
            line.style.left = '20px';
            line.style.top = '240px';
            line.style.transform = transform;
        };
        switch(array.join()) {
            case "3,4,5":
                line.style.top = '240px'; 
                break;
            case "6,7,8":
                line.style.top = '340px';
                break;
            case "0,3,6":
                drawVertical('-95px');
                break;
            case "1,4,7":
                drawVertical('25px');
                break;
            case "2,5,8":
                drawVertical('150px');
                break;
            case "0,4,8":
                drawHorizontal('rotate(40deg)');
                break;
            case "2,4,6":
                drawHorizontal('rotate(-40deg)');
                break;
            default:
                break;
        }
    };

    const finishBoard = winner => {
        board.removeEventListener('click', game.makeMove);
        let heading = document.createElement('H1');
        let container = document.getElementById('info');
        if (winner) {
            heading.textContent = winner.name + " wins!";
            heading.classList.add('text-success');
        } else {
            heading.textContent = "Cat's game...";
            heading.classList.add('text-danger');
        }
        container.prepend(heading);
    };

    return {init, draw, finishBoard, board, boardArray, drawLine};
};

const game = ( () => {
    let winner;
    let player1;
    let player2;
    let newBoard = Board();
    let ai = false;
    let currentTurn = {
        number: 1,
        player: undefined,

        toggle: () => {
            if (currentTurn.player === player1) {
                currentTurn.player = player2;
            } else {
                currentTurn.player = player1;
            }
        }
    }
    
    const checkEndGame = (boardArray) => {
        let winPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        let gameOver = false;
        winPositions.forEach((array) => {
            let values = [];
            array.forEach((n) => {
                values.push(boardArray[n]);
            });
            if (values.every(x => x === 'X') || values.every(x => x === 'O')) {
                console.log(array);
                gameOver = array;
            }
        });
        return gameOver;
    };

    const checkForDraw = () => {
        if (currentTurn.number > 9) {
            newBoard.finishBoard(winner);
        }
    };

    const postTurn = () => {
        currentTurn.number ++;
        line = checkEndGame(newBoard.boardArray)
        if (line) {
            newBoard.drawLine(line);
            winner = currentTurn.player;
            newBoard.finishBoard(winner); 
        } else {
            checkForDraw();
            if (ai) {
                player2.makeMove(newBoard);
            } else {
            currentTurn.toggle();
            }
        }
    };

    const makeMove = (e) => {
        let square = e.target;
        if (square.textContent === "") {
            let symbol = currentTurn.player.symbol;
            newBoard.draw(symbol, square);
            postTurn();
        }
    };

    const start = (e) => {
        let button = e.target;
        if (button.tagName === 'BUTTON') {
            newBoard = Board();
            newBoard.init();
            player1 = Player(prompt('Please enter your name'), 'X');
            if (button.id === 'one-player') {
                ai = true;
                player2 = Computer();
            } else {
                player2 = Player(prompt('Player 2, please enter your name'), 'O');
            }
            winner = undefined;
            currentTurn.number = 1;
            currentTurn.player = player1;
        }
    };
                
    return {start, makeMove, player1, newBoard};
    
})();

let button = document.querySelector('#info .row');

button.addEventListener('click', game.start);

