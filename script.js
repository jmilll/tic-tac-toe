//MODULE EXAMPLE
var myModule = (function() {
    'use strict';

  var _privateProperty = 'Hello World';
  var publicProperty = 'I am a public property';

  function _privateMethod() {
    console.log(_privateProperty);
  }

  function publicMethod() {
    _privateMethod();
  }

// whatever is available publically goes here
  return {
    publicMethod: publicMethod,
    publicProperty: publicProperty
  };
  })();//immmediatly called on, can pass variables thru as well
/*
myModule.publicMethod(); // outputs 'Hello World'
console.log(myModule.publicProperty); // outputs 'I am a public property'
console.log(myModule._privateProperty); // is undefined protected by the module closure
myModule._privateMethod(); // is TypeError protected by the module closure
*/

//--DYNAMICALLY SELECT BUTTONS INCLUDING ONES THAT ARE NOT CREATED--
document.querySelector('.gameboard').addEventListener('click', (e) => {
    //e.preventDefault();
    if (!e.target) { return; }
    if (e.target.matches('.tile')) {
        //this.textContent = 'x'
        //console.log('tile')


        //console.log(e.target.getAttribute('data-value'))
        let v = e.target.getAttribute('data-value');


        //let player = 'playerOne';

        let player = controller.getTurn();

        // changes the div to have text/mark 
        //e.target.innerText = 'x'

        //gameBoard.mark(v) //before adding player
        gameBoard.mark(player, v)
        controller.toggleTurn();
        gameBoard.renderBoard()
        gameBoard.checkWinner()
    }
});

/*
// --for mark function reference --
    const mark = (player, value) => {
        const boardObj = board[value].mark
        if (!boardObj === ''){return};
        if (boardObj === '' && player === 'p1') {
            return board[value].mark = 'x';  
        } else {
            return board[value].mark = 'o'; 
        }
    }
*/

const gameBoard = (function() {
    'use strict';
    
    //const tile = {
    //    mark: ''
    //}
    const board = [];

    const getBoard = () => {
        return board;
    }

    /*
    //works, but doesnt pull from board array
    function createTiles2() {
        const boardContainer= document.querySelector('.gameboard')
        
        for (let i = 1; i <= 9; i++) {
            //create dom element
            const newTile = document.createElement('div');
            newTile.setAttribute('class', 'tile');
            newTile.setAttribute('value', i);
            boardContainer.appendChild(newTile);
            //push to board array
            board.push(tile);
        }
    }
    */

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
        console.log(board);
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

    }

    const resetBoard = () => {
        board.length = 0;
        renderBoard();
    }

    //when adding players, might have to pass mark(player, mark)
    /*function mark(v) {
        let boardObj = board[v].mark

        if (boardObj === '') {
            return board[v].mark = 'x';  
        } 
        console.log('access');
    }
    */
    const mark = (player, value) => {
        const boardObj = board[value].mark
        // !boardobj doesnt stop o from overwriting x for some reason
        if (!boardObj === ''){return};
        if (boardObj === '' && player === 'p1') {
            return board[value].mark = 'x';  
        } else if (boardObj === '' && player === 'p2') {
            return board[value].mark = 'o'; 
        }
    }

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
        
        let winner = false;

        for(let i = 0; i < winCon.length; i++) {
            //const board = gameBoard.getBoard(); //to work outside gameboard method
            const turns = controller.turnNumber();
            xx = winCon[i][0]
            yy = winCon[i][1]
            zz = winCon[i][2]
    
            //console.log( xx , yy , zz)
        
            if ( board[xx].mark !== '' && board[xx].mark == board[yy].mark && board[yy].mark == board[zz].mark) {
                console.log('winner = ', board[xx].mark )
                winner = true;
                document.querySelector('.restart').classList.remove('hidden');
                //opposite winner of turn since they won last turn
                if (controller.getTurnPlayerName() === 'Player One') {
                    document.querySelector('.turn').textContent = 'Player Two Wins!';
                } else {document.querySelector('.turn').textContent = 'Player One Wins!';};
                document.querySelector('.cover').classList.toggle('hidden');
                break;
              // use % of 9 instead of turns === 9 in case of choosing to play again needs to remain constaint case  
            } else if ( turns % 9 === 0 && winner !== true) {
                console.log('tie game')
                document.querySelector('.restart').classList.remove('hidden');
                document.querySelector('.cover').classList.toggle('hidden');
                break;
            }
        }    
    }

    return {
        getBoard,
        renderBoard,
        mark,
        checkWinner,
        resetBoard,
    }
})();
//gameBoard.renderBoard()


const controller = (() => {
    'use strict'
    const setUp = document.querySelector('.setup');
    const pTwoHuman = document.getElementById('p2-human');
    const pTwoCpu = document.getElementById('p2-cpu');
    const restartButton = document.querySelector('.restart');
    //const startButton = document.querySelector('.start');

    //-- HANDLES GAME SETUP SECTION --
    document.querySelector('.setup').addEventListener('click', (e) => {
        //e.preventDefault();
        if (!e.target) { return; }
        if (e.target.matches('#p2-human')){
            playerTwo = playerFactory('p2', 'Player Two', 'o')
            e.target.classList.toggle('active')
            pTwoCpu.classList.remove('active')
            //startButton.setAttribute('class', .start')

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
            //startButton.setAttribute('class', .start')
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
        gameBoard.resetBoard();
        document.querySelector('.cover').classList.toggle('hidden');
        e.target.classList.add('hidden');
    });
    /*
    startButton.addEventListener('click', (e) => {
        //e.preventDefault();
        if (!e.target) { return; }

        //playerOne = playerFactory('p1', 'Human', 'x')
        //playerTwo = playerFactory('p2', 'CPU', 'o')
        //console.log(.start')
        gameBoard.renderBoard() 
        startButton.parentElement.classList.toggle('hidden')
        
        
    });
    */
    const playerFactory = (player, name, mark) => {
        //const sayHello = () => console.log('hello!');
        return { 
            player,
            name, 
            mark, 
            //sayHello 
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
        //console.log(turn);
        turn !== playerTwo ? turn = playerTwo : turn = playerOne;
        turns++;
        //console.log(turn.name);
       // document.querySelector('.turn').textContent = (controller.getTurnPlayerName()+`'s turn! Place your "${(turn.mark.toUpperCase())}"`)

        return turn.mark;
    }

    return {
        //playerFactory,
        getPlayers,
        toggleTurn,
        getTurn,
        turnNumber,
        getTurnPlayerName,
        getTurnPlayerMark,

    }
})();






/*
//trying to find the mark value pulling from gameboard
gameBoard.getBoard().forEach(function(item, index, array) {
    console.log(index, item.mark)
})
*/
