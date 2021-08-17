const Gameboard = (() => {
  const _board = new Array(9);

  const markField = (sign, index) => {
    _board[index] = sign;
  };

  const getField = (index) => _board[index];

  const reset = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
  };
  return { markField, getField, reset };
})();

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const boardController = (() => {
  const gameSquares = document.querySelectorAll(".game-square");
  const currentPlayer = document.getElementById("current_player");
  const resetButton = document.getElementById("reset_button");
  const pageMask = document.getElementById("page-mask");

  gameSquares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (Gameboard.getField(e.target.dataset.index) || gameController.isOver())
        return;
      gameController.playRound(e.target.dataset.index);
      updateGameboard();
    });
  });

  const updateGameboard = () => {
    for (let i = 0; i < gameSquares.length; i++) {
      gameSquares[i].textContent = Gameboard.getField(i);
    }
  };

  const setWinnersMessage = (winner) => {
    pageMask.style.display = "block";
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    currentPlayer.textContent = message;
  };

  resetButton.addEventListener("click", (e) => {
    pageMask.style.display = "contents";
    gameController.resetGame();
    Gameboard.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
  });

  return { setWinnersMessage, setMessageElement };
})();

const gameController = (() => {
  const player1 = Player("X");
  const player2 = Player("O");
  let round = 1;
  let finished = false;

  const playRound = (fieldIndex) => {
    Gameboard.markField(nextPlayer(), fieldIndex);

    if (!finished) {
      if (checkForWin(Gameboard)) {
        boardController.setWinnersMessage(nextPlayer());
        finished = true;
        return;
      }

      if (round === 9) {
        boardController.setWinnersMessage("Draw");
        finished = true;
        return;
      }
      round++;
      boardController.setMessageElement(`Player ${nextPlayer()}'s turn`);
    }
  };

  const nextPlayer = () => {
    return round % 2 === 1 ? player1.getSign() : player2.getSign();
  };

  const resetGame = () => {
    round = 1;
    finished = false;
  };

  const _checkForRows = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(board.getField(j));
      }

      if (
        row.every((field) => field == "X") ||
        row.every((field) => field == "O")
      ) {
        return true;
      }
    }
    return false;
  };

  const _checkForColumns = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = [];
      for (let j = 0; j < 3; j++) {
        column.push(board.getField(i + 3 * j));
      }
      if (
        column.every((field) => field == "X") ||
        column.every((field) => field == "O")
      ) {
        return true;
      }
    }
    return false;
  };

  const _checkForDiagonal = (board) => {
    diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
    diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
    if (
      diagonal1.every((field) => field == "X") ||
      diagonal1.every((field) => field == "O")
    ) {
      return true;
    } else if (
      diagonal2.every((field) => field == "X") ||
      diagonal2.every((field) => field == "O")
    ) {
      return true;
    }
  };

  const checkForWin = (board) => {
    if (
      _checkForRows(board) ||
      _checkForColumns(board) ||
      _checkForDiagonal(board)
    ) {
      return true;
    }
    return false;
  };

  const isOver = () => {
    return finished;
  };

  return { playRound, resetGame, isOver };
})();
