// This module contains the actual Tic-Tac-Toe game logic

const gameBoard = (() => {
	let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "]; // Represents the Tic-Tac-Toe game board
	let boardDOM = Array.from(document.querySelectorAll(".field")); // DOM elements representing each field on the game board
	let currentPlayer;
	let resultPopup = document.getElementById("result-popup");
	let resultMessage = document.getElementById("result-message");
	let rematchButton = document.querySelector(".rematch-btn");
	let quitButton = document.querySelector(".quit-btn");

	function display() {
		// Updates the HTML to reflect the changes on the game board
		for (let i = 0; i < board.length; i++) {
			boardDOM[i].innerText = board[i];
		}
	}

	function getWinner() {
		// Checks the game board to determine the winner or a tie

		// Checks rows for a win
		for (let i = 0; i < 3; i++) {
			const rowStartIndex = i * 3;
			if (
				board[rowStartIndex] === board[rowStartIndex + 1] &&
				board[rowStartIndex + 1] === board[rowStartIndex + 2] &&
				board[rowStartIndex] !== " "
			) {
				return board[rowStartIndex];
			}
		}

		// Checks columns for a win
		for (let j = 0; j < 3; j++) {
			if (
				board[j] === board[j + 3] &&
				board[j + 3] === board[j + 6] &&
				board[j] !== " "
			) {
				return board[j];
			}
		}

		// Checks diagonals for a win
		if (
			board[0] === board[4] &&
			board[4] === board[8] &&
			board[0] !== " "
		) {
			return board[0];
		}

		if (
			board[2] === board[4] &&
			board[4] === board[6] &&
			board[2] !== " "
		) {
			return board[2];
		}

		let isTie = true;
		// Checks if the game is a tie
		for (let k = 0; k < 9; k++) {
			if (board[k] === " ") {
				isTie = false;
				break;
			}
		}
		if (isTie) {
			return "tie";
		}

		// If no winner is found and the game is not a tie, returns null
		return null;
	}

	function endGame(winner) {
		// Displays the result popup with the winner and options to rematch or quit
		let message;
		if (winner === "tie") {
			message = "It's a tie!";
		} else {
			message = `${currentPlayer.name} is victorious!`;
		}
		resultMessage.textContent = message;
		resultPopup.style.display = "flex";
	}

	function playRound(playerActive, playerWaiting) {
		currentPlayer = playerActive;

		// Handles the game logic for each round of play
		for (let i = 0; i < boardDOM.length; i++) {
			// Adds a click event listener to each field on the game board
			boardDOM[i].addEventListener("click", (event) => {
				if (board[i] === " ") {
					board[i] = playerActive.sign;
					display(); // Updates the display after each move

					const winner = getWinner();
					if (winner) {
						endGame(winner);
					} else {
						switchPlayers();
					}
				}
			});
		}

		// If the active player is a bot, make its move and switch players
		if (playerActive.bot !== 0) {
			const moveIndex = playerActive.botMove(board);
			board[moveIndex] = playerActive.sign;
			display();
			const winner = getWinner();
			if (winner) {
				endGame(winner);
			} else {
				switchPlayers();
			}
		}

		function switchPlayers() {
			// Swaps the active player and waiting player
			let swapBuffer = playerActive;
			playerActive = playerWaiting;
			playerWaiting = swapBuffer;

			currentPlayer = playerActive;

			// If the active player is a bot, make its move and switch players recursively
			if (playerActive.bot !== 0) {
				const moveIndex = playerActive.botMove(board);
				board[moveIndex] = playerActive.sign;
				display();
				const winner = getWinner();
				if (winner) {
					endGame(winner);
				} else {
					switchPlayers();
				}
			}
		}
		rematchButton.addEventListener("click", () => {
			// Reset the game board while keeping player settings
			board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
			resultPopup.style.display = "none";
			if (playerActive.sign === "O") switchPlayers();
			display();
		});

		quitButton.addEventListener("click", () => {
			// Close the result popup and go back to player settings
			location.reload();
		});
	}

	return { playRound, getWinner };
})();

// This module contains the logic for a minimax-based AI bot for a tic-tac-toe game.

const minimaxBotLogic = (() => {
	// Function to find the best move for the AI player using the minimax algorithm.
	function bestMove(board, ai, human) {
		// Initialize the bestScore as negative infinity and move as null.
		let bestScore = -Infinity;
		let move = null;

		// Iterate through each cell on the board.
		for (let i = 0; i < 9; i++) {
			// Check if the cell is empty, if yes, try the move.
			if (board[i] === " ") {
				// Temporarily place AI's symbol on the board.
				board[i] = ai;

				// Use the minimax function to calculate the score for this move.
				let score = minimax(board, 0, false, ai, human);

				// Reset the cell back to empty after calculating the score.
				board[i] = " ";

				// If the current score is better than the bestScore, update the bestScore and move.
				if (score > bestScore) {
					bestScore = score;
					move = i;
				}
			}
		}
		// Return the index of the best move for the AI player.
		return move;
	}

	// Recursive minimax function to evaluate the board and find the optimal score for the AI player.
	function minimax(board, depth, isMaximizing, ai, human) {
		// Check if there is a winner or the depth limit has been reached.
		let result = gameBoard.getWinner();
		if (result !== null) {
			// If AI wins, return a high score (10 - depth).
			if (result === ai) {
				return 10 - depth;
			}
			// If human wins, return a low score (depth - 10).
			else if (result === human) {
				return depth - 10;
			}
			// If it's a tie, return 0.
			return 0;
		}

		if (isMaximizing) {
			// If AI's turn, find the highest possible score.
			let bestScore = -Infinity;
			for (let i = 0; i < 9; i++) {
				if (board[i] === " ") {
					// Temporarily place AI's symbol on the board.
					board[i] = ai;

					// Recursive call to minimax with isMaximizing set to false (human's turn).
					let score = minimax(board, depth + 1, false, ai, human);

					// Reset the cell back to empty after calculating the score.
					board[i] = " ";

					// Update the bestScore with the maximum of the current score and the bestScore.
					bestScore = Math.max(score, bestScore);
				}
			}
			// Return the best score found for the AI player.
			return bestScore;
		} else {
			// If human's turn, find the lowest possible score.
			let bestScore = Infinity;
			for (let i = 0; i < 9; i++) {
				if (board[i] === " ") {
					// Temporarily place human's symbol on the board.
					board[i] = human;

					// Recursive call to minimax with isMaximizing set to true (AI's turn).
					let score = minimax(board, depth + 1, true, ai, human);

					// Reset the cell back to empty after calculating the score.
					board[i] = " ";

					// Update the bestScore with the minimum of the current score and the bestScore.
					bestScore = Math.min(score, bestScore);
				}
			}
			// Return the best score found for the human player.
			return bestScore;
		}
	}

	// Return the public methods of the module.
	return { bestMove };
})();

const player = (sign, name, bot, ai, human) => {
	function botMove(board) {
		// Determines the bot's move based on the selected bot strategy
		if (bot === 1) {
			// Random move strategy
			let available = [];
			for (let i = 0; i < 9; i++) {
				if (board[i] == " ") available.push(i);
			}
			randomMove =
				available[Math.floor(Math.random() * available.length)];
			return randomMove;
		} else if (bot === 2) {
			// Minimax algorithm strategy
			return minimaxBotLogic.bestMove(board, ai, human);
		} else {
			// No bot move
			return null;
		}
	}

	return { sign, name, bot, botMove };
};

// This module contains the player settings and Tic-Tac-Toe game initiation

const game = (() => {
	let playerX, playerO;

	function getPlayerSettings() {
		const playerXName = document.getElementById("playerX").value;
		const playerOName = document.getElementById("playerO").value;
		const playerXBot = parseInt(
			document.getElementById("playerXBot").value
		);
		const playerOBot = parseInt(
			document.getElementById("playerOBot").value
		);

		// Prevent both players from being bots
		if (playerXBot !== 0 && playerOBot !== 0) {
			alert(
				"Cannot select both players as bots. Please choose at least one human player."
			);
			return;
		}

		// Prevents players from having the same name
		if (playerXName === playerOName) {
			alert(
				"Players cannot have the same name. Please choose different names."
			);
			return;
		}

		document.getElementById("player-popup").style.display = "none";

		playerX = player("X", playerXName, playerXBot, "X", "O");
		playerO = player("O", playerOName, playerOBot, "O", "X");
	}

	function gaming() {
		// Starts the game and initiates the playRound function
		getPlayerSettings();
		gameBoard.playRound(playerX, playerO);
	}

	document.getElementById("start-game-btn").addEventListener("click", gaming);

	return { gaming };
})();
