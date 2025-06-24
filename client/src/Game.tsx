import type { Game, Move } from "boardgame.io";

function createRow(number: number): StadiumModel {
  return {
    number,
    totalCells: obtenerValor(number),
    saveByUserList: Array(4).fill(null),
    isBlockByUsers: Array(4).fill(null),
    currentMove: 0,
    isBlockByUser: null,
  };
}

function createStadium() {
  const stadium = [];
  for (let i = 2; i < 13; i++) {
    stadium.push(createRow(i));
  }
  return stadium;
}

function obtenerValor(n: number) {
  if (n >= 2 && n <= 12) {
    return 2 * (7 - Math.abs(n - 7)) - 1;
  } else {
    return 0; // fuera de rango
  }
}

export interface CanStopModel {
  stadium: StadiumModel[],
  isDiceRoll: boolean,
  currentMoves: number,
  noMoreMoves: boolean,
  canStop: boolean,
  diceRoll: number[] | undefined
}

interface SaveByUserModel {
  playerID: string;
  index: number;
}

export interface StadiumModel {
  number: number,
  totalCells: number,
  saveByUserList: (SaveByUserModel | null)[],
  isBlockByUsers: number[] | null[],
  currentMove: number,
  isBlockByUser: string | null
}

export const CantStop: Game<CanStopModel> = {
  //La función setup es la que va a inicializar el estado del juego que se denomina G.
  //Tambien puede recibir argumentos para deifinir el estado inicial de algo del context.
  setup: () => ({
    stadium: createStadium(),
    isDiceRoll: false,
    currentMoves: 0,
    noMoreMoves: false,
    canStop: false,
    diceRoll: undefined
  }),
  //Hay un objeto que controla los turnos.
  // turn: {
  //   minMoves: 1,
  //   maxMoves: 1
  // },
  //Moves como dice su nombre, contine un objeto que tiene todos los movimientos del juego.
  moves: {
    //Cada movimiento es una función que recibe como primer parametro el estado del juego y un context.
    //Como segundo parametro y asi ya es arbitrario y puede recibir cualquier cosa.
    launchDice: ({ G, random, playerID }) => {
      G.diceRoll = random.D6(4);
      G.isDiceRoll = true;
      G.noMoreMoves = validatePosibleMoves(G, G.diceRoll, playerID);
    },
    setMoves: ({ G, playerID }, moves: number[]) => {
      G.isDiceRoll = false;
      G.diceRoll = undefined;
      moves?.map((move) => {
        const indexOfCell = G.stadium.findIndex((row) => row.number === move);
        const row = G.stadium[indexOfCell];
        let indexOfLastSave =
          row.saveByUserList.find((save) => save?.playerID === playerID)?.index;
        indexOfLastSave = indexOfLastSave ? indexOfLastSave - 1 : 0;
        // if (indexOfLastSave && row.currentMove === 0) {
        //   row.currentMove = indexOfLastSave - 1;
        // }
        if (row.isBlockByUser) {
          return;
        }
        if (indexOfCell >= 0) {
          if (G.currentMoves < 3 || row.currentMove > 0) {
            if (
              row.currentMove === 0 //||
              //indexOfLastSave === row.currentMove + 1
            ) {
              G.currentMoves = G.currentMoves + 1;
            }
            row.currentMove = 1 + row.currentMove;
            if (row.currentMove + indexOfLastSave === row.totalCells) {
              row.isBlockByUser = playerID;
            }
          }
        }
      });
      G.canStop = CanStop(G);
    },
    stopTurn: ({ G, playerID, events }) => {
      G.stadium.map((row) => {
        if (row.currentMove > 1 && !G.noMoreMoves) {
          const already = row.saveByUserList.find(
            (save) => save?.playerID === playerID,
          );
          if (already) {
            already.index = already.index + row.currentMove - 1;
          } else {
            row.saveByUserList[+playerID] = {
              playerID,
              index: row.currentMove,
            };
          }
        }
        if (row.currentMove > 0) {
          row.currentMove = 0;
        }
      });
      G.canStop = false;
      G.currentMoves = 0;
      G.isDiceRoll = false;
      G.diceRoll = undefined;
      G.noMoreMoves = false;
      events.endTurn();
    },
  },
};

function validatePosibleMoves(G: CanStopModel, diceRoll: number[], playerID: string) {
  const possibleMoves = [
    diceRoll[0] + diceRoll[1],
    diceRoll[0] + diceRoll[2],
    diceRoll[0] + diceRoll[3],
    diceRoll[1] + diceRoll[2],
    diceRoll[1] + diceRoll[3],
  ];
  let noMoreMoves = true;
  possibleMoves.map((possibleMove) => {
    const row = G.stadium.find((row) => row.number === possibleMove);
    if (
      ((row?.currentMove ?? 0) > 0 || G.currentMoves < 3) &&
      playerID !== row?.isBlockByUser
    ) {
      noMoreMoves = false;
    }
  });
  return noMoreMoves;
}

function CanStop(G: CanStopModel) {
  const isAnyMoreThanOne = G.stadium.find((row) => row.currentMove > 1) ?? null;
  if (isAnyMoreThanOne && G.currentMoves === 3) {
    return true;
  }
  return false;
}

