import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import './App.css';
import sprite from './media/sprite.png';
import player from './media/player.png';

const App = () => {
  const [board, setBoard] = useState(0);
  const [positions, setPositions] = useState({});
  const [currentPosition, setCurrentPosition] = useState([]);
  const [moves, countMoves] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = React.useRef();

  React.useEffect(() => {
    getStripePositions();
    blur();
  }, [board]);

  const handleChange = (event) => {
    const { value } = event.target;
    if (value > 3) {
      setBoard(value);
    }else{
      resetGame();
    }
  };

  const blur = () => inputRef.current.blur();

  /**
   * Renders a cell in a particular position on the board
   * @param {*} position
   */
  const renderCell = (position) => {
    const pos = positions[position];
    const isPlayer = pos
      ? pos[0] === currentPosition[0] && pos[1] === currentPosition[1]
      : null;
    return (
      <td className="cell">
        {pos && isPlayer ? (
          <img src={player} className="sprite" alt="player" />
        ) : null}
        {pos && !isPlayer ? (
          <img src={sprite} className="sprite" alt="sprite" />
        ) : null}
      </td>
    );
  };

  /**
   * Generates all the rows that make up a board
   */
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < board; i++) {
      const row = [];
      for (let j = 0; j < board; j++) {
        const cell = renderCell(JSON.stringify([i, j]));
        row.push(cell);
      }
      rows.push(<tr>{row}</tr>);
    }
    return rows;
  };

  /**
   * Render the entire game board
   */
  const renderGame = () => {
    return (
      <table>
        <tbody>{renderRows()}</tbody>
      </table>
    );
  };

  /**
   * Generates the initial positions of the stripes and the player
   */
  const getStripePositions = () => {
    const pos = {};
    const playerPos = [Math.floor(board / 2), Math.floor(board / 2)];
    pos[JSON.stringify(playerPos)] = playerPos;

    for (let i = 0; i < board; i++) {
      const newPosition = generatePosition(pos, playerPos);
      pos[newPosition] = JSON.parse(newPosition);
    }
    setPositions({ ...pos });
    setCurrentPosition(playerPos);
  };

  /**
   * Computes the random position of the stripe
   * @param {*} pos
   * @param {*} playerPos
   */
  const generatePosition = (pos, playerPos) => {
    const x = Math.floor(Math.random() * Math.floor(board - 1));
    const y = Math.floor(Math.random() * Math.floor(board - 1));
    const currentPos = pos[JSON.stringify([x, y])];
    if (!currentPos && playerPos[0] !== x && playerPos[1] !== y) {
      return JSON.stringify([x, y]);
    }
    return generatePosition(pos, playerPos);
  };

  /**
   * Computes the new position of the player on the board
   * @param {*} curPosition
   * @param {*} newPosition
   */
  const getPlayerMove = (curPosition, newPosition) => {
    delete positions[JSON.stringify(curPosition)];
    setCurrentPosition(newPosition);
    setPositions({
      ...positions,
      ...{ [JSON.stringify(newPosition)]: newPosition },
    });
    countMoves(moves + 1);
    if (Object.keys(positions).length === 1) {
      setDone(true);
    }
  };

  const handleKeyEvent = (key) => {
    console.log(`do something upon keydown event of ${key}`);
    let newPosition = [];
    switch (key) {
      case 'up':
        newPosition = [currentPosition[0] - 1, currentPosition[1]];
        if (newPosition[0] >= 0) getPlayerMove(currentPosition, newPosition);
        return;
      case 'down':
        newPosition = [currentPosition[0] + 1, currentPosition[1]];
        if (newPosition[0] <= board - 1)
          getPlayerMove(currentPosition, newPosition);
        return;
      case 'left':
        newPosition = [currentPosition[0], currentPosition[1] - 1];
        if (newPosition[1] >= 0) getPlayerMove(currentPosition, newPosition);
        return;
      case 'right':
        newPosition = [currentPosition[0], currentPosition[1] + 1];
        if (newPosition[1] <= board - 1)
          getPlayerMove(currentPosition, newPosition);
        return;
      default:
        return;
    }
  };

  /**
   * Resets the game back to it's initial state
   */
  const resetGame = () => {
    setBoard(0);
    setCurrentPosition([]);
    setPositions({});
    countMoves(0);
    setDone(false);
  };

  const renderInputield = () => (
    <div>
      {done ? (
        <button type="button" onClick={resetGame}>
          New Game
        </button>
      ) : (
        <input
          type="text"
          name="board"
          placeholder="No. of squares"
          onChange={handleChange}
          ref={inputRef}
        />
      )}
    </div>
  );

  return (
    <div className="App">
      <div className="label">Number of squares should be atleast 4</div>
      {renderInputield()}
      <div className="moves">{'Moves: ' + moves}</div>
      {renderGame()}
      <KeyboardEventHandler
        handleKeys={['left', 'right', 'up', 'down']}
        onKeyEvent={(key, _e) => handleKeyEvent(key)}
      />
    </div>
  );
};

export default App;
