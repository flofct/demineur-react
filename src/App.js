import React, { useState } from 'react';

const App = () => {
  const [difficulty, setDifficulty] = useState('beginner');
  const [time, setTime] = useState(0);
  const [board, setBoard] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState([]);

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const startGame = () => {
    setGameStarted(true);
    setTime(0);
    setBoard(generateBoard());
  };

  const generateBoard = () => {
    let boardSize;
    let numBombs;
    switch (difficulty) {
      case 'beginner':
        boardSize = 9;
        numBombs = 10;
        break;
      case 'intermediate':
        boardSize = 16;
        numBombs = 40;
        break;
      case 'expert':
        boardSize = 22;
        numBombs = 100;
        break;
      case 'master':
        boardSize = 30;
        numBombs = 250;
        break;
      default:
        boardSize = 9;
        numBombs = 10;
    }

    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push([]);
      for (let j = 0; j < boardSize; j++) {
        board[i].push({
          isBomb: false,
          isFlagged: false,
          isRevealed: false,
          adjacentBombs: 0,
        });
      }      
    }

    // Placement des bombes
    let bombsPlaced = 0;
    while (bombsPlaced < numBombs) {
      const randomRow = Math.floor(Math.random() * boardSize);
      const randomCol = Math.floor(Math.random() * boardSize);
      const cell = board[randomRow][randomCol];
      if (!cell.isBomb) {
        cell.isBomb = true;
        bombsPlaced++;
      }
    }

    // Calcul des bombes adjacentes
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = board[i][j];
        if (!cell.isBomb) {
          let adjacentBombs = 0;

          // Vérification de la case à droite
          if (j < boardSize - 1) {
            const rightCell = board[i][j + 1];
            if (rightCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case à gauche
          if (j > 0) {
            const leftCell = board[i][j - 1];
            if (leftCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case du dessus
          if (i > 0) {
            const topCell = board[i - 1][j];
            if (topCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case du dessous
          if (i < boardSize - 1) {
            const bottomCell = board[i + 1][j];
            if (bottomCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case en haut à droite
          if (i > 0 && j < boardSize - 1) {
            const topRightCell = board[i - 1][j + 1];
            if (topRightCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case en haut à gauche
          if (i > 0 && j > 0) {
            const topLeftCell = board[i - 1][j - 1];
            if (topLeftCell.isBomb) {
              adjacentBombs++;
            }
          }
          // CVérification de la case en bas à droite
          if (i < boardSize - 1 && j < boardSize - 1) {
            const bottomRightCell = board[i + 1][j + 1];
            if (bottomRightCell.isBomb) {
              adjacentBombs++;
            }
          }
          // Vérification de la case en bas à gauche
          if (i < boardSize - 1 && j > 0) {
            const bottomLeftCell = board[i + 1][j - 1];
            if (bottomLeftCell.isBomb) {
              adjacentBombs++;
            }
          }
          cell.adjacentBombs = adjacentBombs;
        }
      }
    }
    return board;
  };

  // Gérer la case sur laquelle on clique
  const handleCellClick = (row, col) => {
    const cell = board[row][col];
    if (cell.isFlagged || cell.isRevealed) {
      return;
    }
    if (cell.isBomb) {
      setGameOver(true);
      setWin(false);
      revealBoard();
    } else {
      revealCell(row, col);
    }
  };

  // Révéler une case
  const revealCell = (row, col) => {
    const cell = board[row][col];
    cell.isRevealed = true;
    if (cell.adjacentBombs === 0) {
      // Vérification de la case à droite
      if (col < board.length - 1) {
        const rightCell = board[row][col + 1];
        if (!rightCell.isRevealed && !rightCell.isFlagged) {
          revealCell(row, col + 1);
        }
      }
      // Vérification de la case à gauche
      if (col > 0) {
        const leftCell = board[row][col - 1];
        if (!leftCell.isRevealed && !leftCell.isFlagged) {
          revealCell(row, col - 1);
        }
      }
      // Vérification de la case du dessus
      if (row > 0) {
        const topCell = board[row - 1][col];
        if (!topCell.isRevealed && !topCell.isFlagged) {
          revealCell(row - 1, col);
        }
      }
      // Vérification de la case du dessous
      if (row < board.length - 1) {
        const bottomCell = board[row + 1][col];
        if (!bottomCell.isRevealed && !bottomCell.isFlagged) {
          revealCell(row + 1, col);
        }
      }
      // Vérification de la case en haut à droite
      if (row > 0 && col < board.length - 1) {
        const topRightCell = board[row - 1][col + 1];
        if (!topRightCell.isRevealed && !topRightCell.isFlagged) {
          revealCell(row - 1, col + 1);
        }
      }
      // Vérification de la case en haut à gauche
      if (row > 0 && col > 0) {
        const topLeftCell = board[row - 1][col - 1];
        if (!topLeftCell.isRevealed && !topLeftCell.isFlagged) {
          revealCell(row - 1, col - 1);
        }
      }
      // Vérification de la case en bas à droite
      if (row < board.length - 1 && col < board.length - 1) {
        const bottomRightCell = board[row + 1][col + 1];
        if (!bottomRightCell.isRevealed && !bottomRightCell.isFlagged) {
          revealCell(row + 1, col + 1);
        }
      }
      // Vérification de la case en bas à gauche
      if (row < board.length - 1 && col > 0) {
        const bottomLeftCell = board[row + 1][col - 1];
        if (!bottomLeftCell.isRevealed && !bottomLeftCell.isFlagged) {
          revealCell(row + 1, col - 1);
        }
      }
    }
    setBoard([...board]);
  };

  const handleCellRightClick = (row, col) => {
    const cell = board[row][col];
    if (cell.isRevealed) {
      return;
    }
    cell.isFlagged = !cell.isFlagged;
    setBoard([...board]);
  };

  const revealBoard = () => {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.isRevealed = true;
      });
    });
    setBoard([...board]);
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmitScore = () => {
    const newScore = {
      name: playerName,
      time: time,
    };
    setScore([...score, newScore]);
  };

  

  return (
    <div>
      <h1>Démineur</h1>
      <div>
        <label>Difficulté :</label>
        <select onChange={handleDifficultyChange}>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="expert">Expert</option>
          <option value="master">Maître</option>
        </select>
      </div>
      <div>
        <button onClick={startGame}>Lancer la partie</button>
      </div>
      {gameStarted && (
        <div>
          <div>
            <h2>Temps : {time}</h2>
          </div>
          <div>
            {board.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleCellRightClick(rowIndex, colIndex);
                    }}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid black',
                      display: 'inline-block',
                      textAlign: 'center',
                      lineHeight: '30px',
                      backgroundColor: cell.isRevealed ? '#ccc' : '#fff',
                    }}
                  >
                    {cell.isFlagged && '🚩'}
                    {cell.isRevealed && cell.isBomb && '💣'}
                    {cell.isRevealed && !cell.isBomb && cell.adjacentBombs}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div>
          {win ? (
            <div>
              <h2>Gagné !</h2>
              <label>Entrez votre nom :</label>
              <input type="text" onChange={handlePlayerNameChange} />
              <button onClick={handleSubmitScore}>Enregistrer le score</button>
            </div>
          ) : (
            <h2>Perdu !</h2>
          )}
        </div>
      )}
      {score.length > 0 && (
        <div>
          <h2>Classement</h2>
          <ul>
            {score.map((entry, index) => (
              <li key={index}>
                {entry.name} : {entry.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
