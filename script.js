const gameBoard = (() => {
	let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
	let boardDOM = Array.from(document.querySelectorAll(".field"));
	let currentPlayer;
	let resultPopup = document.getElementById("result-popup");
	let resultMessage = document.getElementById("result-message");
	let rematchButton = document.querySelector(".rematch-btn");
	let quitButton = document.querySelector(".quit-btn");
	function display() {
		for (let i = 0; i < board.length; i++) {
			boardDOM[i].textContent = board[i];
		}
	}

	function getWinner() {
		for (let i = 0; i < 3; i++) {
			const rowStartIndex = i * 3;
			if (
				board[rowStartIndex] === board[rowStartIndex + 1] &&
				board[rowStartIndex + 1] === board[rowStartIndex + 2] &&
				board[rowStartIndex] !== " "
			) {
				return "winner";
			}
		}

		for (let i = 0; i < 3; i++) {
			if (
				board[i] === board[i + 3] &&
				board[i + 3] === board[i + 6] &&
				board[i] !== " "
			) {
				return "winner";
			}
		}

		if (
			board[0] === board[4] &&
			board[4] === board[8] &&
			board[0] !== " "
		) {
			return "winner";
		}

		if (
			board[2] === board[4] &&
			board[4] === board[6] &&
			board[2] !== " "
		) {
			return "winner";
		}

		let isTie = true;
		for (let k = 0; k < 9; k++) {
			if (board[k] === " ") {
				isTie = false;
				break;
			}
		}
		if (isTie) {
			return "tie";
		}

		return "no winner";
	}

	function playRound(playerActive, playerWaiting) {
		currentPlayer = playerActive;
		if (currentPlayer.bot != 0) {
			board[currentPlayer.botMove(board)] = currentPlayer.sign;
			switchPlayers();
			display();
		}

		for (let i = 0; i < boardDOM.length; i++) {
			boardDOM[i].addEventListener("click", (event) => {
				if (board[i] === " ") {
					board[i] = playerActive.sign;
					display();
					handleResult(playerWaiting);
				}
			});
		}

		function handleResult(playerWaiting) {
			if (getWinner() == "winner") {
				message = `${currentPlayer.name} is victorious!`;
				resultMessage.textContent = message;
				resultPopup.style.display = "flex";
			} else if (getWinner() == "no winner") {
				if (playerWaiting.bot != 0) {
					board[playerWaiting.botMove(board)] = playerWaiting.sign;
					if (getWinner() == "winner") {
						currentPlayer = playerWaiting;
						handleResult(playerWaiting);
					} else display();
				} else switchPlayers();
			} else if (getWinner() == "tie") {
				message = "It's a tie!";
				resultMessage.textContent = message;
				resultPopup.style.display = "flex";
			} else
				console.log("Something wen't wrong with winner determination");
		}

		rematchButton.addEventListener("click", () => {
			board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
			resultPopup.style.display = "none";
			if (playerActive.sign === "O") switchPlayers();
			display();
		});

		quitButton.addEventListener("click", () => {
			location.reload();
		});

		function switchPlayers() {
			let swapBuffer = playerActive;
			playerActive = playerWaiting;
			playerWaiting = swapBuffer;
			currentPlayer = playerActive;
		}
	}

	return { playRound, getWinner };
})();

const minimaxBotLogic = (() => {
	function bestMove(board, ai, human) {
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
		if (gameBoard.getWinner() === "winner") {
			if (isMaximizing === false) {
				return 10 - depth;
			} else if (isMaximizing === true) {
				return depth - 10;
			}
		} else if (gameBoard.getWinner() === "tie") return 0;
		if (isMaximizing) {
			let bestScore = -Infinity;
			for (let i = 0; i < 9; i++) {
				if (board[i] === " ") {
					board[i] = ai;
					let score = minimax(board, depth + 1, false, ai, human);
					board[i] = " ";
					bestScore = Math.max(score, bestScore);
				}
			}
			return bestScore;
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < 9; i++) {
				if (board[i] === " ") {
					board[i] = human;
					let score = minimax(board, depth + 1, true, ai, human);
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
			randomMove =
				available[Math.floor(Math.random() * available.length)];
			return randomMove;
		} else if (bot === 2) {
			return minimaxBotLogic.bestMove(board, ai, human);
		} else {
			return null;
		}
	}

	return { sign, name, bot, botMove };
};

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

		document.getElementById("player-popup").style.display = "none";

		playerX = player("X", playerXName, playerXBot, "X", "O");
		playerO = player("O", playerOName, playerOBot, "O", "X");
	}

	function gaming() {
		getPlayerSettings();
		gameBoard.playRound(playerX, playerO);
	}

	document.getElementById("start-game-btn").addEventListener("click", gaming);

	return { gaming };
})();
