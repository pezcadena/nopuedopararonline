import { Client } from 'boardgame.io/react';
import { TicTacToeBoard } from './Board.js';
import { CantStop } from "./Game.tsx";

const App = Client({
  game: CantStop,
  board: TicTacToeBoard
});

export default App;
