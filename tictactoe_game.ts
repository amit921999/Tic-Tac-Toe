import { randomUUID } from "crypto";
import  WebSocket from 'ws';


type boardPossibleValues = 'X' | 'O' | 'N';
type playerPossibleNumber = 1 | 2;

const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]


export default class tictactoe {
  gameArray :boardPossibleValues[];
  playerOneName :string;
  playerOneId :string;
  playerTwoName :string;
  playerTwoId :string;
  gameId :string;
  playerChance :playerPossibleNumber
  connections : WebSocket[]

  constructor(connection :WebSocket) {
    this.gameArray = ['N', 'N','N', 'N','N', 'N','N', 'N', 'N'];
    this.gameId = randomUUID();
    this.playerOneName = "";
    this.playerTwoName = "";
    this.playerChance = 1;
    this.connections = new Array(connection);
  }


  parseMessage(message)
  {
    switch (message[0]) {
      case '1': {
          return this.setPlayerName(message[1]);
      }
      case '2': {
          return this.updateChance(message[1]);
      }
      case '3': {
          return ['-1', '', this.gameArray];
      }
    }
  }

  addNewConnection(connection :WebSocket) {
    this.connections.push(connection);
  }

  setPlayerName(name :string) {
    if (this.playerOneName == ""){
        this.playerOneName = name;
        this.playerOneId = randomUUID();
        return ['4', this.playerOneId, this.gameId];
    }
    else if(this.playerTwoName == ""){
        this.playerTwoName = name;
        this.playerTwoId = randomUUID();
        return ['5', this.playerTwoId, this.gameId];
    }
    else{
        return ['-1', '', this.gameArray];
    }
  }

  getIdForPlayerChance() {
    return this.playerChance == 1 ? this.playerOneId: this.playerTwoId;
  }

  updateChance(bordPostion :number) {
    const playerInput = this.playerChance === 1 ? 'X' : 'O';

    if (this.gameArray[bordPostion] == 'X' || this.gameArray[bordPostion] == 'O')
      return this.nextChancePayload();

    this.gameArray[bordPostion] = playerInput;

    this.playerChance = this.playerChance == 1 ? 2 : 1;

    return this.nextChancePayload();
  }

  nextChancePayload() {
    const ifSomeoneWon =  this.checkIfSomeoneWon();

    switch (ifSomeoneWon) {
      case '1':
        return ['1', this.playerOneName + " has won the game", this.gameArray];
      case '2':
        return ['1', this.playerTwoName + " has won the game", this.gameArray];
      case '3':
        return ['1', "No One won the game", this.gameArray];
      default:
        return [ifSomeoneWon, this.getIdForPlayerChance(), this.gameArray];
    }
  }

  checkIfSomeoneWon() {
    var fistPlayer :boolean = false;
    var secondPlayer :boolean = false;
    var noOneWon :boolean = false;

    for (const combination of WINNING_COMBINATIONS) {
      if (this.gameArray[combination[0]] == 'X' && this.gameArray[combination[1]] == 'X' && this.gameArray[combination[2]] == 'X')
        fistPlayer = true;
    }
    
    for (const combination of WINNING_COMBINATIONS) {
      if (this.gameArray[combination[0]] == 'O' && this.gameArray[combination[1]] == 'O' && this.gameArray[combination[2]] == 'O')
        secondPlayer = true;
    }

    noOneWon = this.gameArray.every(function isFilled(bordPostion:string) {
      return bordPostion == 'X' || bordPostion == 'O'
    })

    if (fistPlayer) {
      return '1';
    } else if (secondPlayer) {
      return '2';
    }  else if (noOneWon) {
      return'3';
    } else {
      return '-1';
    }
  }

}