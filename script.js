const gameBoard = (() => {
    let board = [" "," "," ",
                 " "," "," ",
                 " "," "," "]
    let boardDOM = Array.from(document.querySelectorAll(".field"));
                
    function display(){
        //makes changes on the board visible in html
        for (let i = 0; i < board.length; i++) {
            boardDOM[i].innerText = board[i]; 
        }
    } 

    function getWinner() {
         // Check rows
         for (let i = 0; i < 3; i++) {
           const rowStartIndex = i * 3;
           if (board[rowStartIndex] === board[rowStartIndex + 1] && board[rowStartIndex + 1] === board[rowStartIndex + 2] && board[rowStartIndex] !== '') {
             return board[rowStartIndex];
           }
         }
        
         // Check columns
         for (let j = 0; j < 3; j++) {
           if (board[j] === board[j + 3] && board[j + 3] === board[j + 6] && board[j] !== '') {
             return board[j];
           }
         }
        
         // Check diagonals
         if (board[0] === board[4] && board[4] === board[8] && board[0] !== '') {
           return board[0];
         }
        
         if (board[2] === board[4] && board[4] === board[6] && board[2] !== '') {
           return board[2];
         }
        
         // If no winner is found, return null
         return null;
    }
    
    function playRound(playerX, playerO){
        for (let i = 0; i < boardDOM.length; i++) {
            boardDOM[i].addEventListener("click", (event) => {
                    if (board[i] === " ") { 
                       if(playerX.turn){
                         board[i] = playerX.sign;
                         let swap = playerX.turn
                         if(playerO.bot != 0) board[playerO.botMove()] = playerO.sign;
                         else{
                          playerX.turn = playerO.turn;
                          playerO.turn = swap;
                         }
                        }
                        else {
                          if(playerX.bot != 0) {
                          board[playerX.botMove()] = playerX.sign;
                          board[i] = playerO.sign;
                          }
                          else {
                            board[i] = playerO.sign;
                            let swap = playerX.turn
                            playerX.turn = playerO.turn;
                            playerO.turn = swap;
                          }
                        }
                    }
                display();
                console.log(getWinner());
            });
        }
    }

    return{playRound, board}
    
})();

const player = (sign, name, bot, turn) => {
  // bot = 0 --> not a bot
  // bot = 1 --> random input bot
  // but = 2 --> minimax bot
  function botMove(){
   if(bot === 1){
      let available = [];
      for (let i = 0; i < 9; i++) {
        if(gameBoard.board[i] == " ") available.push(i);
      }
      randomMove = available[[Math.floor(Math.random()*available.length)]];
      return randomMove;
    }
    // else if(bot === 2){

    // }
    // else return null;
  } 
  return{sign, name, bot, turn, botMove}
}



const game = (() => {

    const playerX = player("X","amongus", 0, true);
    const playerO = player("O","sugoma", 1, false);

    function gaming(){
        gameBoard.playRound(playerX,playerO,0);
    }

    return{gaming}
})();

game.gaming();