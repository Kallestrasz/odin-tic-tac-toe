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
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] & board[0][i] === board[2][i]) {
                return board[0][i];
            } else if (board[i][0] === board[i][1] & board[i][0] === board[i][2]) {
                return board[i][0];
            }
        }
        if (board[0][0] === board[1][1] & board[0][0] === board[2][2]){
            return board[0][0];
        } else if (board[0][2] === board[1][1] & board[0][2] === board[2][0]) {
            return board[0][2];
        }
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