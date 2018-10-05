const Player = (name, symbol) => {
    return {name, symbol};
};

const Computer = (difficulty) => {

    const {name, symbol} = Player('The Computer', 'O');;

    const makeRandomMove = (board) => {
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

    const getPossibleMoves = (board) => {
        let possibleMoves = [];
        board.forEach((square, index) => {
            if (!square) {
                let move = { index, score: 0 };
                possibleMoves.push(move);
            }
        });
        return possibleMoves;
    };

    const score = (move, board, player, opponent, turn) => {
        let score = 0;
        board[move.index] = player.symbol;
        
        if (game.checkEndGame(board)) {
            score += 10;
        }

        return score;
    };

    const findBestMove = (board, player, opponent, turn) => {
        let bestMove;
        let possibleMoves = getPossibleMoves(board);

        possibleMoves.forEach((move) => {
            let sampleBoard = board.slice(0);
            move.score += score(move, sampleBoard, player, opponent, i);

            for (i = turn + 1; i < 10; i++) {
                let opponentMove = findBestMove(sampleBoard, opponent, player, i);
                move.score -= opponentMove.score
                i++;
                if (i > 9) {
                    break;
                }
                let nextMove = findBestMove(sampleBoard, player, opponent, i);
                move.score += nextMove;
            }
        });

        let randomPossibleMoves = [];

        possibleMoves.forEach((move) => {
            let randomNumber = Math.random() * 10;
            if (randomNumber > 5) {
                randomPossibleMoves.unshift(move);
            } else {
                randomPossibleMoves.push(move);
            }
        });

        randomPossibleMoves.forEach((move) => {
            if (!bestMove) {
                bestMove = move;
            } else {
                if (bestMove.score < move.score) {
                    bestMove = move;
                }
            }
        });

        return bestMove;
    };

    const makeHardMove = (board, player, opponent, turn) => {
        let move = findBestMove(board.boardArray, player, opponent, turn);
        let moveIndex = move.index;
        let square = document.getElementById(moveIndex);
        board.draw(symbol,square);
    };

    const makeMove = (board, player, opponent, turn) => {
        if (difficulty === "easy") {
            makeRandomMove(board);
        } else {
            makeHardMove(board, player, opponent, turn);
        }
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
                gameOver = array;
            }
        });
        return gameOver;
    };

    const checkForDraw = (turnNumber) => {
        if (turnNumber > 9) {
            return true;
        } else {
            return false;
        }
    };

    const postTurn = () => {
        currentTurn.number ++;
        line = checkEndGame(newBoard.boardArray);
        if (line) {
            newBoard.drawLine(line);
            winner = currentTurn.player;
            newBoard.finishBoard(winner); 
        } else {
            if (checkForDraw(currentTurn.number)) {
            newBoard.finishBoard(winner);
            } else {
                if (ai) {
                    currentTurn.toggle();
                    player2.makeMove(newBoard, player2, player1, currentTurn.number);
                    currentTurn.number++;
                    line = checkEndGame(newBoard.boardArray);
                    if (line) {
                        newBoard.drawLine(line);
                        winner = currentTurn.player;
                        newBoard.finishBoard(winner); 
                    }
                    currentTurn.toggle();
                } else {
                currentTurn.toggle();
                }
            }
        }
    };

    const makeMove = (e) => {
        let square = e.target;
        console.log(square.tagName);
        if (square.textContent === "" && !(square.tagName === 'IMG')) {
            let symbol = currentTurn.player.symbol;
            newBoard.draw(symbol, square);
            postTurn();
        }
    };

    const start = (e) => {
        let button = e.target;
        let oldButton = document.querySelector('.active');
        if (button.tagName === 'BUTTON') {
            if (oldButton) {
                oldButton.classList.remove('active');
            }
            button.classList.add('active');
            newBoard = Board();
            newBoard.init();
            player1 = Player(prompt('Please enter your name'), 'X');
            if (button.id === 'one-player') {
                ai = true;
                player2 = Computer(button.getAttribute('difficulty'));
            } else {
                player2 = Player(prompt('Player 2, please enter your name'), 'O');
            }
            winner = undefined;
            currentTurn.number = 1;
            currentTurn.player = player1;
        }
    };
    
    return {start, makeMove, player1, newBoard, checkEndGame, checkForDraw};
    
})();

let button = document.querySelector('#info .row');

button.addEventListener('click', game.start);
