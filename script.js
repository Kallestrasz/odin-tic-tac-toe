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

    function playRound(playerX, playerO, round){
        for (let i = 0; i < boardDOM.length; i++) {
            boardDOM[i].addEventListener("click", (event) => {
                    if (board[i] = " ") { 
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