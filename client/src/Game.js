import { INVALID_MOVE } from "boardgame.io/core";

export const TicTacToe = {
  //La función setup es la que va a inicializar el estado del juego que se denomina G.
  //Tambien puede recibir argumentos para deifinir el estado inicial de algo del context.
  setup: () => ({ cells: Array(9).fill(null) }),
  //Hay un objeto que controla los turnos.
  turn: {
    minMoves: 1,
    maxMoves: 1
  },
  //Moves como dice su nombre, contine un objeto que tiene todos los movimientos del juego.
  moves: {
    //Cada movimiento es una función que recibe como primer parametro el estado del juego y un context.
    //Como segundo parametro y asi ya es arbitrario y puede recibir cualquier cosa.
    clickCell: ({ G, playerID }, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = playerID;
    }
  },
  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (isDraw(G.cells)) {
      return { draw: true };
    }
  }
}

function IsVictory(cells) {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = row => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

function isDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}
