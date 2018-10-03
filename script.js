const player = (name, symbol) => {
    return {name, symbol};
};

const board = (() => {
    let boardArray = [];
    let board = document.getElementById('board');

    const init = () => {
        boardArray = [];
        for (i=0; i<9; i++) {
            boardArray.push(undefined);
        }
        board.addEventListener('click', game.makeMove);
    };

    const draw = (symbol, square) => {
        let index = square.id
        boardArray[index] = symbol;
        square.textContent = symbol;
    };

    const checkEndGame = () => {
        let winPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        let gameOver = false;
        winPositions.forEach((array) => {
            let values = [];
            array.forEach((n) => {
                values.push(boardArray[n]);
            });
            if (values.every(x => x === 'X') || values.every(x => x === 'O')) {
                //drawLine(array);
                gameOver = true;
            }
        });
        return gameOver;
    };

    const endGame = winner => {
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
        container.appendChild(heading);
    };

    return {init, draw, checkEndGame, endGame, board};
})();

const game = (() => {
    let winner;
    let player1 = player('name', 'X');
    let player2 = player('other name', 'O');
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
    }

    const checkForDraw = () => {
        if (currentTurn.number > 9) {
            board.endGame(winner);
        }
    };

    const postTurn = () => {
        currentTurn.number ++;
        if (board.checkEndGame()) {
            winner = currentTurn.player;
            board.endGame(winner); 
        } else {
            checkForDraw();
            currentTurn.toggle();
        }
    };

    const makeMove = (e) => {
        let square = e.target;
        if (square.textContent === "") {
            let symbol = currentTurn.player.symbol;
            board.draw(symbol, square);
            postTurn();
        }
    };

    const start = () => {
        board.init();
    };
                
    return {start, makeMove};
})();

game.start();
