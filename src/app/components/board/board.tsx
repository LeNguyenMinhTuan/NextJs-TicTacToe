"use client"; 
import { useEffect, useState } from "react"
import Modal from "../modal/modal";

const SQUARE_NUMBERS = 49

// Define an interface for the object
interface Board {
  [key: number]: string;
}

interface GameResult {
  winner: string | null,
  winningCombo: number[]
}

// Create the object
const createNumberStringObject = (): Board => {
  let obj: Board = {};
  for (let i = 0; i < SQUARE_NUMBERS; i++) {
    obj[i] = "";
  }
  return obj;
};

const defaultData = createNumberStringObject()

export default function Board({isOnePlayer}: {isOnePlayer: boolean}) {
  const [boardData, setBoardData] = useState(defaultData)
  const [winningCombo, setWinningCombo] = useState<number[]>([])
  const [isXTurn, setIsXTurn] = useState(true)
  const [modal, setModal] = useState("")
  const [gameStop, setGameStop] = useState(false)

  useEffect(() => {
    const checkValue = !isXTurn ? 'X' : 'O'
    
    const gameResult = checkWinner(checkValue)
    if (gameResult.winner) {
      setWinningCombo(gameResult.winningCombo)
      setModal(`Player ${gameResult.winner} Won!!!`);
      setGameStop(true)
    }

    if (isOnePlayer) {
      botCalculate()
    }


  }, [boardData]);

  const botCalculate =  () => {
    console.log(isXTurn, gameStop)
    if (!isXTurn && !gameStop) {
      // await delay(1000)
      let tempBoard = boardData
      let botMove = Math.floor(Math.random() * SQUARE_NUMBERS)
      let bestScore = Infinity
      for (let i = 0; i<SQUARE_NUMBERS; i++) {
        if (tempBoard[i] === "") {
          tempBoard[i] = "O"
          let score = AIMoveWithMinimax(tempBoard, 0 , true, -Infinity, Infinity);
          tempBoard[i] = ''
          if (score !== -1) {
            if (score < bestScore) {
              bestScore = score
              botMove = i
            }
          }

        }
      }
      while (boardData[botMove]) {
        botMove = Math.floor(Math.random() * SQUARE_NUMBERS)
      }
      if (boardData[botMove] === "") {
        console.log('bot make move: ', botMove)
        updateBoardData(botMove)
      }
    }
  }

  const checkWinner = (player: string): GameResult => {
    const size = Math.sqrt(SQUARE_NUMBERS) ;
    // The minimum number of consecutive symbols required to win
    const winLength = 5; 
    let winningCells: number[] = []

    
    const addWinningCells = (startRow: number, startCol: number, rowStep: number, colStep: number) => {
      for (let i = 0; i < winLength; i++) {
        winningCells.push((startRow + i * rowStep)*size + startCol + i * colStep);
      }
    };

    // Check horizontal
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - winLength + 1; col++) {
        if (boardData[row*size + col] === player) {
          let win = true;
          for (let i = 1; i < winLength; i++) {
            if (boardData[row*size + col + i] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            console.log(player, 'win horizontal')
            addWinningCells(row, col, 0 , 1)
            return {
              winner: player,
              winningCombo: winningCells
            }
          }
        }
      }
    }

    // Check vertical
    for (let row = 0; row < size - winLength + 1; row++) {
      for (let col = 0; col < size; col++) {
        if (boardData[row*size + col] === player) {
          let win = true;
          for (let i = 1; i < winLength; i++) {
            if (boardData[(row + i)*size + col] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            console.log(player, 'win vertical')
            addWinningCells(row, col, 1, 0);
            return {
              winner: player,
              winningCombo: winningCells
            }
          } 
        }
      }
    }

    // Check diagonal - top-left to bottom-right
    for (let row = 0; row < size - winLength + 1; row++) {
      for (let col = 0; col < size - winLength + 1; col++) {
        if (boardData[row*size + col] === player) {
          let win = true;
          for (let i = 1; i < winLength; i++) {
            if (boardData[(row + i)*size + col + i] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            console.log(player, 'win diagonal - top-left to bottom-right')
            addWinningCells(row, col, 1, 1);
            return {
              winner: player,
              winningCombo: winningCells
            }
          }
        }
      }
    }

    // Check diagonal - top-right to bottom-left
    for (let row = 0; row < size - winLength + 1; row++) {
      for (let col = winLength - 1; col < size; col++) {
        if (boardData[row*size+col] === player) {
          let win = true;
          for (let i = 1; i < winLength; i++) {
            if (boardData[(row + i)*size + col - i] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            console.log(player, ' win diagonal - top-right to bottom-left')
            addWinningCells(row, col, 1, -1);
            return {
              winner: player,
              winningCombo: winningCells
            }
          }
        }
      }
    }
    let openSpots = 0;
    for (let i = 0; i < SQUARE_NUMBERS; i++) {
      if (boardData[i] == '') {
        openSpots++;
      }
    }

    if (openSpots === 0) {
      return {
        winner: "NONE",
        winningCombo: winningCells
      };
    }
    return {
      winner: null,
      winningCombo: winningCells
    };
  };

  
  const score = (winner: string | null, depth: number) => {
    if (winner === 'X') {
      return 10 + depth
    } else if (winner === 'O') {
      return - depth - 10
    }
    return 0
  }


  const AIMoveWithMinimax = (board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number => {
    const player = isMaximizing ? 'X' : 'O';
    let gameResult = checkWinner(player)
    if (gameResult.winner) {
      const scores = score(gameResult.winner, depth)
      return scores
    }

    if (depth === 5) {
      return -1
    }
    if(isMaximizing){
      let bestScore = -Infinity;
      for(let i = 0; i < SQUARE_NUMBERS ; i++){
          if (board[i] === ''){
              board[i] = 'X';
              let score = AIMoveWithMinimax(board, depth + 1, false, alpha, beta);
              board[i] = '';
              bestScore = Math.max(score, bestScore);
              alpha = Math.max(alpha, bestScore)
              if (beta <= alpha) {
                break
              }
          }
      }
      return bestScore;
    }
    let bestScore = Infinity;
    for(let i = 0; i < SQUARE_NUMBERS ; i++){
        if (board[i] === ''){
            board[i] = 'O';
            let score = AIMoveWithMinimax(board, depth + 1, true, alpha, beta)
            board[i] = '';
            bestScore = Math.min(score, bestScore);
            beta  = Math.min(beta, bestScore)
            if (beta <= alpha) {
              break
            }
        }
    }
    return bestScore;
  }


  const updateBoardData = async (idx: number) => {
    console.log('udpdate data: ', idx)
    if (boardData[idx]) return
    const value = isXTurn ? 'X' : 'O'
    checkWinner(value)

    setBoardData(previousInputs => ({ ...previousInputs , [idx]: value }))

    console.log('updateBoard')
    setIsXTurn(prevState => !prevState)   
    console.log('update x turn')

  }

  const resetGame = () => {
    setBoardData(defaultData)
    setModal("")
    setIsXTurn(true)
    setWinningCombo([])
    setGameStop(false)
  }


  return (
    <>
      <div className="game__menu">
        <p>{isXTurn ? "X Turn" : "O Turn"}</p>
      </div>
      <div className={`game__board  ${
        gameStop ? "disabled" : ""
      }`}>
          {[...Array(SQUARE_NUMBERS)].map((v, idx) => {
            return (
              <div
                
                key={idx}
                onClick={() => updateBoardData(idx)}
                className={`square ${
                  winningCombo.includes(idx) ? "highlight" : ""
                }`}>
                  {boardData[idx]}
                </div>
            )
          })}
      </div>
      <Modal
        modalTitle={modal}
        reset={resetGame}
        />
    </>
    

  )
}