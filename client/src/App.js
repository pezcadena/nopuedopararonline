import { Client } from 'boardgame.io/react';
import { TicTacToeBoard } from './Board.js';
import { TicTacToe } from "./Game.js";

const App = Client({
  game: TicTacToe,
  board: TicTacToeBoard
});

export default App;
