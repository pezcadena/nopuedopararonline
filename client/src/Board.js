import React from "react";
import { DiceCard } from "./DiceCard";

export function TicTacToeBoard({ ctx, G, moves }) {
  const onClick = () => moves.stopTurn();
  const playerID = ctx.currentPlayer;

  let winner = "";
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const cellStyle = {
    border: "1px solid #555",
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    textAlign: "center",
  };

  let tbody = [];
  for (let i = 0; i < G.stadium.length; i++) {
    let cells = [];
    for (let j = 0; j < G.stadium[i].totalCells + 1; j++) {
      cells.push(
        <td key={j}>
          <div style={cellStyle}>
            {j === 0
              ? i + 2
              : G.stadium[i].currentMove + (
                G.stadium[i].currentMove > 0 ?
                  getIndexOfLastSave(
                    G.stadium[i].saveByUserList,
                    playerID,
                  ) : 0) ===
                j
                ? "X"
                : G.stadium[i].saveByUserList.map((save) => {
                  if (save?.index === j) {
                    return save.playerID;
                  }
                  return "";
                })}
          </div>
        </td>,
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <main>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      <DiceCard G={G} moves={moves} ctx={ctx} />
      {((G.canStop && !G.isDiceRoll) || G.noMoreMoves) && (
        <button
          className="p-4 bg-green-500 rounded text-white hover:bg-green-600"
          onClick={onClick}
        >
          {G.noMoreMoves ? "Finalizar Turno" : "PARAR"}
        </button>
      )}
    </main>
  );
}

function getIndexOfLastSave(saveByUserList, playerID) {
  const indexOfLastSave = saveByUserList.find(
    (save) => save?.playerID === playerID,
  )?.index;
  return indexOfLastSave ? indexOfLastSave - 1 : 0;
}
