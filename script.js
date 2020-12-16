const DOM = (function() {
    const click = document.querySelector('.gameboard').addEventListener('click', (e) => {
    //e.preventDefault();
    if (!e.target) { return; }
    if (e.target.matches('.tile')) {
        
        let v = e.target.getAttribute('data-value');
        let player = controller.getTurn();

        gameBoard.mark(player, v)
        //controller.toggleTurn();
        gameBoard.renderBoard()
        controller.checkWinner();
        cpuAi.checkAi();
    }
    });
    return {
        click
    }
})();

const gameBoard = (function() {
    'use strict';
    
    const board = [];

    const getBoard = () => {
        return board;
    }

    // create board from board array
    function tileTemplate(obj, num) {
        const boardContainer = document.querySelector('.gameboard')
        const newTile = document.createElement('div');
        newTile.setAttribute('class', 'tile');
            if (obj.mark === '') {
                newTile.textContent = '';
            } else if (obj.mark === 'x') {
                newTile.textContent = 'x';
            } else if (obj.mark === 'o') {
                newTile.textContent = 'o';
            } else {
                console.log('hmm');
            }
        newTile.setAttribute('data-value', num);
        boardContainer.appendChild(newTile);
        //console.log(obj.mark); //works
    }

    const createTiles = () => {
        if (board.length === 0) {
            for (let i = 0; i < 9; i++) {
                board.push(
                    {id: i,
                    mark: ''}
                );
                tileTemplate(board[i]);
            }
        } else {return}
    }

    const renderBoard = () => {
        createTiles();
        //takes all tiles renders from board array
        const tiles = document.querySelectorAll('.tile');
        //erase current board to populate from board
        tiles.forEach(tile => document.querySelector('.gameboard').removeChild(tile));
        for (let j = 0; j < board.length; j++) {
            //create dom element for each object in array
            tileTemplate((board[j]), j);
        }
        //Display turn and mark for clarity
        document.querySelector('.turn').textContent = (controller.getTurnPlayerName()+`'s turn! Place your "${(controller.getTurnPlayerMark().toUpperCase())}"`)
        if (controller.getPlayers()["playerTwo"].name === 'CPU' && controller.turnNumber() > 1) {
            document.querySelector('.turn').textContent = 'Still your turn, bud';
        }
    }

    const resetBoard = () => {
        board.length = 0;
        renderBoard();
    }

   const mark = (player, value) => {
        const boardObj = board[value].mark
        // toggle turn moved here from click action to only change turn on valid mark
        if (boardObj !== ''){return}
        else if (boardObj === '' && player === 'p1') {
            controller.toggleTurn();
            return board[value].mark = 'x';  
        } else if (player === 'CPU') {
            return board[value].mark = 'o';
        } else {
            controller.toggleTurn();
            return board[value].mark = 'o'; 
        }
    }

    return {
        getBoard,
        renderBoard,
        mark,
        resetBoard,
    }
})();

const cpuAi = (function() {
    const aiNumber = () => {
        let filter = [];
        let b = gameBoard.getBoard()

        for (let i = 0; i < b.length; i++) {
            if (b[i].mark === '') { filter.push(b[i].id)}
        }
        return filter[Math.floor(Math.random() * filter.length)];
    }

    const checkAi = () => {
        if (controller.getTurnPlayerName() !== 'CPU') {
            return;
        } else {
            let v = aiNumber();
            let player = 'CPU';
            gameBoard.mark(player, v)
            controller.toggleTurn();
            gameBoard.renderBoard()
            controller.checkWinner();
        }
    }
    return {
        checkAi,
    }
})();

const controller = (() => {
    'use strict'
    const setUp = document.querySelector('.setup');
    const pTwoHuman = document.getElementById('p2-human');
    const pTwoCpu = document.getElementById('p2-cpu');
    const restartButton = document.querySelector('.restart');

    //----------HANDLES GAME SETUP SECTION ----------
    document.querySelector('.setup').addEventListener('click', (e) => {
        //e.preventDefault();
        if (!e.target) { return; }
        if (e.target.matches('#p2-human')){
            playerTwo = playerFactory('p2', 'Player Two', 'o')
            e.target.classList.toggle('active')
            pTwoCpu.classList.remove('active')

            //Create start button so it can't be accessed w/o selecting players. Also prevents starting game prematurely by toggling display in DOM manipulation
            if (setUp.contains(document.querySelector('.start'))) {
                return
            } else {
                createStart();
            };
        } else if (e.target.matches('#p2-cpu')){
            playerTwo = playerFactory('p2', 'CPU', 'o')
            e.target.classList.toggle('active')
            pTwoHuman.classList.remove('active')
            if (setUp.contains(document.querySelector('.start'))) { return; } 
                else { createStart(); };
        } else if (e.target.matches('.start')) {
            gameBoard.renderBoard() 
            e.target.parentElement.classList.toggle('hidden')
        }
    });

    const createStart = () => {
        const setupDiv = document.querySelector('.setup');
        const newStartButton = document.createElement('button');
        newStartButton.setAttribute('type', 'button');
        newStartButton.setAttribute('class', 'start');
        newStartButton.textContent = 'Play';
        setupDiv.appendChild(newStartButton);
    }
    
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.cover').classList.toggle('hidden');
        e.target.classList.add('hidden');
        winner = false;
        if(playerTwo.name === 'CPU') {turn = playerOne};
        turns = 0;
        gameBoard.resetBoard();
    });
    //----------END GAME SETUP SECTION ----------

    const playerFactory = (player, name, mark) => {
        return { 
            player,
            name, 
            mark, 
        };
    };
      
    //const playerOne = playerFactory('p1', 'Human', 'x');
    //const playerTwo = playerFactory('p2', 'CPU', 'o');
      
    let playerOne = playerFactory('p1', 'Player One', 'x');
    let playerTwo = {};
    
    const getPlayers = () => {
        return {playerOne, playerTwo}
    }

    let turn = playerOne;
    let turns = 0;

    const getTurn = () => {
        return turn.player;
    }
    const getTurnPlayerName = () => {
        return turn.name;
    }
    const getTurnPlayerMark = () => {
        return turn.mark;
    }
    const turnNumber = () => {
        return turns;
    }
    const toggleTurn = () => {
        turn !== playerTwo ? turn = playerTwo : turn = playerOne;
        turns++;
        return turn.mark;
    }

    let winner = false;

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        
        //win case when playing vs AI bc auto checks
        if (winner === true) {
            document.querySelector('.turn').textContent = 'You beat the CPU!';
            return;
        };
        // Had a cool short loop that worked well, it only had a problem identifying winning 2 different ways at once. 
        // Commented out if you want to look and give feedback :)
        if (board[0].mark !== '' && board[0].mark == board[3].mark && board[3].mark == board[6].mark ||
            board[0].mark !== '' && board[0].mark == board[1].mark && board[1].mark == board[2].mark ||
            board[6].mark !== '' && board[6].mark == board[7].mark && board[7].mark == board[8].mark ||
            board[2].mark !== '' && board[2].mark == board[5].mark && board[5].mark == board[8].mark ||
            board[3].mark !== '' && board[3].mark == board[4].mark && board[4].mark == board[5].mark ||
            board[1].mark !== '' && board[1].mark == board[4].mark && board[4].mark == board[7].mark ||
            board[2].mark !== '' && board[2].mark == board[4].mark && board[4].mark == board[6].mark ||
            board[0].mark !== '' && board[0].mark == board[4].mark && board[4].mark == board[8].mark) {

            winner = true;
            
            //opposite winner of turn since they won before toggle turn
            if (controller.getTurnPlayerName() === 'Player One') {
                document.querySelector('.turn').textContent = 'Player Two Wins!';
            } else {
                document.querySelector('.turn').textContent = 'Player One Wins!';
            };
            document.querySelector('.restart').classList.remove('hidden');
            document.querySelector('.cover').classList.toggle('hidden');
            return;

        } else if (winner === false && turns === 9) {
            document.querySelector('.turn').textContent = 'Tie Game!'
            document.querySelector('.restart').classList.remove('hidden');
            document.querySelector('.cover').classList.toggle('hidden');
            return;
        }
            
    }

    return {
        getPlayers,
        toggleTurn,
        getTurn,
        turnNumber,
        getTurnPlayerName,
        getTurnPlayerMark,
        checkWinner,
    }
})();

 /* 
     const winCon = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
 //find a winner. Loops thru wincons and applys them, checking if marks match
    const checkWinner = () => {
        
        let xx = 0;
        let yy = 0;
        let zz = 0;
        
        for(let i = 0; i < winCon.length; i++) {
            const board = gameBoard.getBoard(); //to work outside gameboard method
            
            xx = winCon[i][0]
            yy = winCon[i][1]
            zz = winCon[i][2]

            //win case when playing vs AI
            if (winner === true) {
                document.querySelector('.turn').textContent = 'WIN against CPU!';
                return;
            };
        
            if ((board[xx].mark !== '' && board[xx].mark === board[yy].mark && board[yy].mark === board[zz].mark)) {
                console.log('winner = ', board[xx].mark )
                winner = true;
                document.querySelector('.restart').classList.remove('hidden');
                //opposite winner of turn since they won last turn
                if (controller.getTurnPlayerName() === 'Player One') {
                    document.querySelector('.turn').textContent = 'Player Two Wins!';
                } else {document.querySelector('.turn').textContent = 'Player One Wins!';};
                document.querySelector('.cover').classList.toggle('hidden');
                break;
            } else if (winner === false && turns === 9) {
                document.querySelector('.turn').textContent = 'Tie Game!'
                document.querySelector('.restart').classList.remove('hidden');
                document.querySelector('.cover').classList.toggle('hidden');
                break;
            }
        }    
    } */