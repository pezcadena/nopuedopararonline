import React from 'react';

export function DiceCard({ ctx, G, moves }) {
  const onClick = () => moves.launchDice();

  let dados = [0, 0, 0, 0];
  if (G.diceRoll) {
    dados = G.diceRoll;
  };

  return (
    <div>
      <button
        className='p-4 bg-red-500 rounded text-white hover:bg-red-600'
        onClick={() => onClick()}
      >
        Lanzar dados
      </button>
      <div>
        Dados:
        {dados[0]} || {dados[1]} || {dados[2]} || {dados[3]}
      </div>
    </div>
  )
}
