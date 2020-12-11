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
                break;
            } else if ( turns === 9 && winner !== true) {
                console.log('tie game')
                break;
            }
        }    
    }

    return {
        getBoard,
        renderBoard,
        mark,
        checkWinner,
    }
})();
gameBoard.renderBoard()


const controller = (() => {
    'use strict'


    const playerFactory = (player, name, mark) => {
        //const sayHello = () => console.log('hello!');
        return { 
            player,
            name, 
            mark, 
            //sayHello 
        };
    };
      
    const playerOne = playerFactory('p1', 'Human', 'x');
    const playerTwo = playerFactory('p2', 'CPU', 'o');
      
    
    const getPlayers = () => {
        return {playerOne, playerTwo}
    }

    let turn = playerOne;
    let turns = 0;

    const getTurn = () => {
        return turn.player;
    }

    const turnNumber = () => {
        return turns;
    }

    const toggleTurn = () => {
        //console.log(turn);
        turn !== playerTwo ? turn = playerTwo : turn = playerOne;
        turns++;
        //console.log(turn.name);

        return turn.mark;
    }

    return {
        playerFactory,
        getPlayers,
        toggleTurn,
        getTurn,
        turnNumber,
    }
})();






/*
        if (turn === playerOne) {
            turn = playerTwo;
        } else {
            turn = playerOne
        }
//trying to find the mark value pulling from gameboard
gameBoard.getBoard().forEach(function(item, index, array) {
    console.log(index, item.mark)
})
*/
