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
    
    function playRound(playerActive, playerWaiting){
      if (playerActive.bot != 0) {
        board[playerActive.botMove(board)] = playerActive.sign;
        switchPlayers();
        display();
      }
      else{
        for (let i = 0; i < boardDOM.length; i++) {
          boardDOM[i].addEventListener("click", (event) => {
                  if (board[i] === " ") { 
                    board[i] = playerActive.sign;
                    if(playerWaiting.bot === 0) switchPlayers();
                    else board[playerWaiting.botMove(board)] = playerWaiting.sign;
                  }
              display();
              console.log(getWinner());
          });
        }
      }
      function switchPlayers() {
        let swapBuffer = playerActive
        playerActive = playerWaiting;
        playerWaiting = swapBuffer;
      }
    }

    return{playRound}
    
})();

const player = (sign, name, bot, turn) => {
  // bot = 0 --> not a bot
  // bot = 1 --> random input bot
  // but = 2 --> minimax bot
  function botMove(board){
   if(bot === 1){
      let available = [];
      for (let i = 0; i < 9; i++) {
        if(board[i] == " ") available.push(i);
      }
      randomMove = available[[Math.floor(Math.random()*available.length)]];
      return randomMove;
    }
    else if(bot === 2){
      let available = [];
    }
    else return null;
  } 
  return{sign, name, bot, turn, botMove}
}



const game = (() => {

    const playerX = player("X","amongus", 1, true);
    const playerO = player("O","sugoma", 0, false);

    function gaming(){
        gameBoard.playRound(playerX,playerO);
    }

    return{gaming}
})();

game.gaming();