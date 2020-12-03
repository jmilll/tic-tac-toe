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

const gameBoard = (function() {
    'use strict';
    //add 9 divs w/ class of 'tile' to .gameboard div
    let board = document.querySelector('.gameboard')

    function createTiles() {
        let i = 1;
        for (i = 1; i <= 9; i++) {
            const newTile = document.createElement('div');
            newTile.setAttribute('class', 'tile');
            newTile.setAttribute('value', i);
            board.appendChild(newTile);
    }


    }

    return {
        createTiles,
    }
})();