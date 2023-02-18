const gameBoard = (() => {
    let board = [" "," "," ",
                 " "," "," ",
                 " "," "," "]
    let boardDOM = Array.from(document.querySelectorAll(".field"));
                
    function display(){
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
    
    function playRound(playerX, playerO, round){
        for (let i = 0; i < boardDOM.length; i++) {
            boardDOM[i].addEventListener("click", (event) => {
                    if (board[i] === " ") { 
                        if(playerX.turn){
                            board[i] = playerX.sign;
                            playerX.turn = false;
                            playerO.turn = true;
                        }
                        else {
                            board[i] = playerO.sign;
                            playerO.turn = false;
                            playerX.turn = true;
                        }
                    }
                display();
                console.log(getWinner());
            });
        }
    }

    return{getWinner, board, playRound}
    
})();

const player = (sign, name, bot, turn) => {
    return{sign, name, bot, turn}
}

const game = (() => {

    const playerX = player("X","amongus", false, true);
    const playerO = player("O","sugoma", false, false);

    function gaming(){
        gameBoard.playRound(playerX,playerO,0);
    }

    return{gaming}
})();

game.gaming();