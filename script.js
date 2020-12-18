const DOM = (() => {
    return document.querySelector('.gameboard').addEventListener('click', (e) => {
        //e.preventDefault();
        if (!e.target) { return; }
        if (e.target.matches('.tile')) {
            
            let v = e.target.getAttribute('data-value');
            let player = controller.getTurn();

            gameBoard.mark(player, v)
            gameBoard.renderBoard()
            controller.checkWinner();
            if (controller.getGameOver() === true){return};
            cpuAi.checkAi();
        }
    });
})();

const gameBoard = (() => {
    'use strict';
    
    const _board = [];

    const getBoard = () => {
        return _board;
    }

    // create board from board array
    const tileTemplate = (obj, num) => {
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
    }

    const _createTiles = () => {
        if (_board.length === 0) {
            for (let i = 0; i < 9; i++) {
                _board.push(
                    {id: i,
                    mark: ''}
                );
                tileTemplate(_board[i]);
            }
        } else {return};
    }

    const renderBoard = () => {
        _createTiles();
        const tiles = document.querySelectorAll('.tile');
        //erase current board to populate from board
        tiles.forEach(tile => document.querySelector('.gameboard').removeChild(tile));
        for (let j = 0; j < _board.length; j++) {
            //create dom element for each object in array
            tileTemplate((_board[j]), j);
        }
        //Display turn and mark for clarity
        document.querySelector('.turn').textContent = (controller.getTurnPlayerName()+`'s turn! Place your "${(controller.getTurnPlayerMark().toUpperCase())}"`)
        if (controller.getPlayers()["_playerTwo"].name === 'CPU' && controller.turnNumber() > 1) {
            document.querySelector('.turn').textContent = 'Still your turn, bud';
        }
    }

    const resetBoard = () => {
        _board.length = 0;
        renderBoard();
    }

   const mark = (player, value) => {
        const boardObj = _board[value].mark
        // toggle turn moved here from click action to only change turn on valid mark
        if (boardObj !== ''){return}
        else if (boardObj === '' && player === 'p1') {
            controller.toggleTurn();
            return _board[value].mark = 'x';  
        } else if (player === 'CPU') {
            return _board[value].mark = 'o';
        } else {
            controller.toggleTurn();
            return _board[value].mark = 'o'; 
        }
    }

    return {
        getBoard,
        renderBoard,
        mark,
        resetBoard,
    }
})();

const cpuAi = (() => {
    const _aiNumber = () => {
        let filter = [];
        let b = gameBoard.getBoard();

        for (let i = 0; i < b.length; i++) {
            if (b[i].mark === '') { filter.push(b[i].id)};
        }
        return filter[Math.floor(Math.random() * filter.length)];
    }

    const checkAi = () => {
        if (controller.getTurnPlayerName() !== 'CPU') {
            return;
        } else {
            let v = _aiNumber();
            let player = 'CPU';
            gameBoard.mark(player, v)
            controller.toggleTurn();
            gameBoard.renderBoard();
            controller.checkWinner();
        }
    }
    return {
        checkAi,
    }
})();

const controller = (() => {
    'use strict'
    const _setUp = document.querySelector('.setup');
    const _pTwoHuman = document.getElementById('p2-human');
    const _pTwoCpu = document.getElementById('p2-cpu');
    const _restartButton = document.querySelector('.restart');

    //----------HANDLES GAME SETUP SECTION ----------
    document.querySelector('.setup').addEventListener('click', (e) => {
        //e.preventDefault();
        if (!e.target) { return; }
        if (e.target.matches('#p2-human')){
            _playerTwo = playerFactory('p2', 'Player Two', 'o');
            e.target.classList.toggle('active');
            _pTwoCpu.classList.remove('active');

            //Create start button so it can't be accessed w/o selecting players. Also prevents starting game prematurely by toggling display in DOM manipulation
            if (_setUp.contains(document.querySelector('.start'))) {
                return;
            } else {
                createStart();
            };
        } else if (e.target.matches('#p2-cpu')){
            _playerTwo = playerFactory('p2', 'CPU', 'o')
            e.target.classList.toggle('active')
            _pTwoHuman.classList.remove('active')
            if (_setUp.contains(document.querySelector('.start'))) { return; } 
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
    
    _restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.cover').classList.toggle('hidden');
        e.target.classList.add('hidden');
        _winner = false;
        if(_playerTwo.name === 'CPU') {_turn = _playerOne};
        _turns = 0;
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
      
    let _playerOne = playerFactory('p1', 'Player One', 'x');
    let _playerTwo = {};
    
    const getPlayers = () => {
        return {_playerOne, _playerTwo}
    }

    let _turn = _playerOne;
    let _turns = 0;

    const getTurn = () => {
        return _turn.player;
    }
    const getTurnPlayerName = () => {
        return _turn.name;
    }
    const getTurnPlayerMark = () => {
        return _turn.mark;
    }
    const turnNumber = () => {
        return _turns;
    }
    const toggleTurn = () => {
        _turn !== _playerTwo ? _turn = _playerTwo : _turn = _playerOne;
        _turns++;
        return _turn.mark;
    }

    let _winner = false;

    const getGameOver = () => {
        return _winner;
    }

    const _winCon = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        const tiles = document.querySelectorAll('.tile');
        
        let xx = 0;
        let yy = 0;
        let zz = 0;

        for(let i = 0; i < _winCon.length; i++) {
            
            xx = _winCon[i][0];
            yy = _winCon[i][1];
            zz = _winCon[i][2];
        
            if ((board[xx].mark !== '') && (board[xx].mark === board[yy].mark) && (board[yy].mark === board[zz].mark)) {
                
                _winner = true;

                //Highlight the winning 3
                tiles[xx].classList.add('win');
                tiles[yy].classList.add('win');
                tiles[zz].classList.add('win');

                //opposite winner of turn since they won before toggle turn
                if (controller.getTurnPlayerName() === 'Player One') {
                    document.querySelector('.turn').textContent = 'Player Two Wins!';
                } else {
                    document.querySelector('.turn').textContent = 'Player One Wins!';
                };
                document.querySelector('.restart').classList.remove('hidden');
                document.querySelector('.cover').classList.toggle('hidden');
                return;
            } 
        } 
        if (_winner === false && _turns === 9) {
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
        getGameOver,
    }
})();