const gameBoard = (() => {
  let board = [" ", " ", " ",
               " ", " ", " ",
               " ", " ", " "];
  let boardDOM = Array.from(document.querySelectorAll(".field"));

  function display() {
    // Makes changes on the board visible in HTML
    for (let i = 0; i < board.length; i++) {
      boardDOM[i].innerText = board[i];
    }
  }

  function getWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const rowStartIndex = i * 3;
      if (board[rowStartIndex] === board[rowStartIndex + 1] && board[rowStartIndex + 1] === board[rowStartIndex + 2] && board[rowStartIndex] !== ' ') {
        return board[rowStartIndex];
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (board[j] === board[j + 3] && board[j + 3] === board[j + 6] && board[j] !== ' ') {
        return board[j];
      }
    }

    // Check diagonals
    if (board[0] === board[4] && board[4] === board[8] && board[0] !== ' ') {
      return board[0];
    }

    if (board[2] === board[4] && board[4] === board[6] && board[2] !== ' ') {
      return board[2];
    }

    let isTie = true;
    for (let k = 0; k < 9; k++) {
      if (board[k] === ' ') {
        isTie = false;
        break;
      }
    }
    if (isTie) {
      return 'tie';
    }

    // If no winner is found, return null
    return null;
  }

  function playRound(playerActive, playerWaiting) {
    for (let i = 0; i < boardDOM.length; i++) {
      boardDOM[i].addEventListener("click", (event) => {
        if (board[i] === " ") {
          board[i] = playerActive.sign;
          if (playerWaiting.bot === 0) switchPlayers();
          else board[playerWaiting.botMove(board)] = playerWaiting.sign;
        }
        display();
        console.log(getWinner());
      });
    }
    if (playerActive.bot !== 0) {
      board[playerActive.botMove(board)] = playerActive.sign;
      switchPlayers();
      display();
    }

    function switchPlayers() {
      let swapBuffer = playerActive;
      playerActive = playerWaiting;
      playerWaiting = swapBuffer;
    }
  }

  return { playRound, getWinner};
})();

const minimaxBotLogic = (() => {

  const scores = {
    X: 1,
    O: -1,
    tie: 0
  };

  function bestMove(board,ai,human) {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] === " ") {
        board[i] = ai;
        let score = minimax(board, 0, false, ai, human);
        board[i] = " ";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }
  
  function minimax(board, depth, isMaximizing, ai, human) {
    let result = gameBoard.getWinner();
    if (result !== null) {
      return scores[result];
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === " ") {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = " ";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = " ";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
  
  return { bestMove };
  
})();

const player = (sign, name, bot, ai, human) => {

function botMove(board) {
  
  if (bot === 1) {
    let available = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] == " ") available.push(i);
    }
    randomMove = available[Math.floor(Math.random() * available.length)];
    return randomMove;
  } else if (bot === 2) {
    return minimaxBotLogic.bestMove(board,ai,human);
  } else return null;
}

  return { sign, name, bot, botMove};
};

const game = (() => {
  const playerX = player("X", "not bot", 0, "X", "O");
  const playerO = player("O", "bot", 2, "O", "X");
 
  function gaming() {
    gameBoard.playRound(playerX, playerO);
  }

  return { gaming };
})();

game.gaming();