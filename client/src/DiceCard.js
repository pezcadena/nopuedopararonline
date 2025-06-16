import React, { useEffect, useState } from "react";

export function DiceCard({ ctx, G, moves }) {
  const onClick = () => moves.launchDice();
  const setMoves = () => {
    moves.setMoves([
      selectedDice[0]?.value + selectedDice[1]?.value,
      selectedDice[2]?.value + selectedDice[3]?.value,
    ]);
    setSelectedDice([]);
  };
  const [selectedDice, setSelectedDice] = useState([]);
  const [noMoreMoves, setNoMoreMoves] = useState(false);

  const dieUnselectedStyle =
    "bg-blue-500 px-10 py-8 text-white text-5xl font-bold hover:bg-blue-700";
  const dieSelectedStyle =
    "bg-green-700 px-10 py-8 text-white text-5xl font-bold hover:bg-green-900";
  const dieSelectedStyle2 =
    "bg-red-700 px-10 py-8 text-white text-5xl font-bold";

  const dados = G.diceRoll || [0, 0, 0, 0];
  const isDiceRoll = G.isDiceRoll;

  const toggleDie = (index, value) => {
    setSelectedDice((prev) => {
      const already = prev.find((ob) => ob.index === index);
      let next = already
        ? prev.filter((ob) => ob.index !== index)
        : [...prev, { index, value }];
      // Si ya hay dos dados seleccionados los demas los selecciona automaticamente
      if (next.length === 2) {
        const remaining = dados
          .map((dado, idx) => ({ index: idx, value: dado }))
          .filter((ob) => !next.find((sel) => sel.index === ob.index));
        next = [...next, ...remaining];
      }
      //Si en dado casos se deselecciona uno entonces elimina los dos ultimos pues fueron los ultimos por agregarse.
      if (next.length === 3) {
        next.pop();
        next.pop();
      }
      // opcional: limitar a 4 elementos
      return next.slice(0, 4);
    });
  };

  const getDieStyle = (index) => {
    const position = selectedDice.findIndex((ob) => ob.index === index);
    if (position === -1) return dieUnselectedStyle;
    return position < 2 ? dieSelectedStyle : dieSelectedStyle2;
  };

  const getDieDisable = (index) => {
    const position = selectedDice.findIndex((ob) => ob.index === index);
    if (position === -1) return false;
    return position < 2 ? false : true;
  };

  return (
    <div>
      {!isDiceRoll && (
        <button
          className="p-4 bg-red-500 rounded text-white hover:bg-red-600"
          onClick={onClick}
        >
          Lanzar dados
        </button>
      )}
      {isDiceRoll && (
        <div className="flex flex-col gap-4 mt-4">
          Dados:
          <div className="flex gap-4">
            <button
              disabled={getDieDisable(0)}
              onClick={() => toggleDie(0, dados[0])}
              className={getDieStyle(0)}
            >
              {dados[0]}
            </button>
            <button
              disabled={getDieDisable(1)}
              onClick={() => toggleDie(1, dados[1])}
              className={getDieStyle(1)}
            >
              {dados[1]}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              disabled={getDieDisable(2)}
              onClick={() => toggleDie(2, dados[2])}
              className={getDieStyle(2)}
            >
              {dados[2]}
            </button>
            <button
              disabled={getDieDisable(3)}
              onClick={() => toggleDie(3, dados[3])}
              className={getDieStyle(3)}
            >
              {dados[3]}
            </button>
          </div>
        </div>
      )}
      <div>
        Caballo 1: {selectedDice[0]?.value} + {selectedDice[1]?.value} ={" "}
        {selectedDice[0] && selectedDice[1] && (
          <b>{selectedDice[0]?.value + selectedDice[1]?.value}</b>
        )}
        {selectedDice[2] && (
          <div>
            Caballo 2: {selectedDice[2]?.value} + {selectedDice[3]?.value} ={" "}
            {selectedDice[2] && selectedDice[3] && (
              <b>{selectedDice[2]?.value + selectedDice[3]?.value}</b>
            )}
          </div>
        )}
      </div>
      {isDiceRoll &&
        selectedDice[3]?.value > 0 &&
        !G.noMoreMoves &&
        validateSetMoves(selectedDice, G.stadium, G.currentMoves) && (
          <button
            className="p-4 bg-red-500 rounded text-white hover:bg-red-600"
            onClick={setMoves}
          >
            Aceptar dados
          </button>
        )}
      {G.noMoreMoves && <div>Valiste</div>}
    </div>
  );
}

function validateSetMoves(selectedDice, stadium, currentMoves) {
  if (currentMoves < 3) {
    return true;
  }
  let isValid = false;
  const value1 = selectedDice[0]?.value + selectedDice[1]?.value;
  const value2 = selectedDice[2]?.value + selectedDice[3]?.value;
  stadium.map((row) => {
    if (row.number === value1 || row.number === value2) {
      if (row.currentMove > 0) {
        isValid = true;
      }
    }
  });
  return isValid;
}
