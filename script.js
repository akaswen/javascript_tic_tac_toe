const player = (name, symbol) => {
    return {name, symbol};
};

const game = () => {
    let player1 = player('Kasia', 'X');
    let player2 = player('Aaron', 'O');
    let winner;
    let boardArray = [];
    for (i=0; i<9; i++) {
        boardArray.push(undefined);
    }
    let board = document.getElementById('board');

    let currentTurn = {
        number: 1,
        player: player1,

        toggle: () => {
            if (currentTurn.player === player1) {
                currentTurn.player = player2;
            } else {
                currentTurn.player = player1;
            }
        }
    };

    const draw = (symbol, square) => {
        square.textContent = symbol;
    };

    const endGame = (winningRow) => {
        board.removeEventListener('click', makeMove);
        let heading = document.createElement('H1');
        let container = document.querySelector('div.container');
        if (winner === undefined) {
            heading.textContent = "Cat's game...";
        } else {
            heading.textContent = `${currentTurn.player.name} wins!`;
        }
        container.appendChild(heading);
    };

    const checkEndGame = () => {
        let winPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        if (currentTurn.number > 9) {
            console.log('game should be over');
            endGame();
        } else {
            winPositions.forEach((array) => {
                let values = [];
                array.forEach((n) => {
                    values.push(boardArray[n]);
                });
                if (values.every(x => x === 'X') || values.every(x => x === 'O')) {
                    console.log('someone won');
                    winner = currentTurn.player;
                    endGame(array);
                }
            });
        }
    };
   
    const makeMove = (e) => {
        let square = e.target;

        if (square.textContent === "") {
            let index = square.id
            let symbol = currentTurn.player.symbol;

            boardArray[index] = currentTurn.player.symbol;

            draw(symbol, square);
            currentTurn.number ++;
            checkEndGame();
            currentTurn.toggle();
        }
    };

    board.addEventListener('click', makeMove);
    return {player1, player2, currentTurn};
};

let newGame = game();

newGame;
