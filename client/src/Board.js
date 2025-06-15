import React from "react";
import { DiceCard } from "./DiceCard";

export function TicTacToeBoard({ ctx, G, moves }) {
  const onClick = (id) => moves.clickCell(id);

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
    for (let j = 0; j < G.stadium[i].totalCells; j++) {
      cells.push(
        <td key={j}>
          <div style={cellStyle}>
            {G.stadium[i].currentMove === j + 1 ? "X" : ""}
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
      {winner}
      <DiceCard G={G} moves={moves} ctx={ctx} />
    </main>
  );
}
