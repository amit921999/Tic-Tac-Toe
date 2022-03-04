import WebSocket from 'ws';
import {question} from 'readline-sync';

export default class Client {
    serverAddress: string
    playerName: string
    playerID: string
    conection: WebSocket
    isGameEnded :boolean
    gameId: string

    constructor(addr:string, name:string) {
        console.log(addr);
        this.serverAddress = addr
        this.playerName = name
        this.isGameEnded = false;
        this.gameId = "";
        this.conection = connect(this.serverAddress);
    }

    oldOrNew()
    {
        var choice:string = question('Join new game: 1 Join old game: 2 \n');
        if (choice == "2")
        {
           var gameId:string = question('Enter game ID \n');
           this.gameId = gameId;
        }
    }

    connectToServerAs()
    {
        var chance:string = question('Wana play: 1 Wana Watch: 2 \n');
        if (chance == '1')
            this.connectAsPLayer();
        else
            this.connectAsSpectator();
    }

    connectAsPLayer() {
        const name = this.playerName;
        const gameId = this.gameId == "" ? -1 : this.gameId;
        this.conection.on('open', function open() {
            this.send(JSON.stringify(['1', name, gameId]));
        });
    }
    
    connectAsSpectator() {
        const name = this.playerName;
        const gameId = this.gameId;
        this.conection.on('open', function open() {
            this.send(JSON.stringify(['3', name, gameId]));
        });
    }

    updateChance(message:string[]) {
        this.printBoard(message[2]);
        if (message[1] != this.playerID)
            return;
        var chance:string = question('Enter your chance: \n');
        this.conection.send(JSON.stringify(['2', chance, this.gameId]));
    }

    parseResponse(message:string[]) {
        switch (message[0]) {
            case '1':
                this.isGameEnded = true;
                console.log(message[1]);
                console.log(message[2]);
                break;
            case '4':
                this.setPlayerId(message[1]);
                this.setGameId(message[2]);
                break;
            default:
                this.updateChance(message);
                break;
        }
    }

    setPlayerId(id:string) {
        this.playerID = id;
    }

    setGameId(id:string) {
        this.gameId = id;
    }

    isGameEnd() {
        return this.isGameEnded;
    }

    printBoard(board) {
        console.log('\n' +
            ' ' + board[0] + ' | ' + board[1] + ' | ' + board[2] + '\n' +
            ' ---------\n' +
            ' ' + board[3] + ' | ' + board[4] + ' | ' + board[5] + '\n' +
            ' ---------\n' +
            ' ' + board[6] + ' | ' + board[7] + ' | ' + board[8] + '\n');
    }

}

function connect(addr:string) {
    const ws = new WebSocket('ws://' + addr);
    return ws;  
}


