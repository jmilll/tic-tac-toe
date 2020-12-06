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
        console.log('tile')
        // changes the div to have text/mark
        e.target.innerText = 'x'
        console.log(e.target.getAttribute('data-value'))
    }
});

const gameBoard = (function() {
    'use strict';
    
    const tile = {
        mark: ''
    }
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
        tiles.forEach(tile => document.querySelector('.gameboard').removeChild(tile));
        for (let j = 0; j < board.length; j++) {
            //create dom element for each object in array
            tileTemplate((board[j]), j);
        }
    }

    const mark = () => {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.addEventListener('click', console.log('tile')));
    }

    return {
        createTiles,
        getBoard,
        renderBoard,
        mark,
    }
})();
gameBoard.renderBoard()