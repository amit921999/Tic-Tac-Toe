import  WebSocket from 'ws';
import http from 'http';
import game from './tictactoe_game'

function main()
{
    const server = http.createServer((req, res)=>{
    });

    const wss =  new WebSocket.Server({ server });

    server.listen(8889, () => {
        console.log('server started:)');
    });
    
    var gameObjects:game[] = new Array(0);

    var gameObj :game;

    wss.on('connection', function connection(ws: WebSocket){
        ws.on('message', function incoming(msg: WebSocket.Data){
            var mesg = JSON.parse(msg.toString());

            console.log(mesg);

            if(mesg[2] == "-1"){
                gameObj = new game(ws);
                gameObjects.push(gameObj);
            }
            else{
                gameObj = findGameId(mesg[2], gameObjects);
                if (mesg[0] == 1 || mesg[0] == 3)
                    gameObj.addNewConnection(ws);
            }

            var response = gameObj.parseMessage(mesg);

            switch (response[0]) {
                case '4':
                    ws.send(JSON.stringify(response));
                    break;
                case '5':
                    response[0] = '4';
                    ws.send(JSON.stringify(response));
                    response = gameObj.nextChancePayload();
                default:
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN && gameObj.connections.find(e => e === client)) {
                          client.send(JSON.stringify(response));
                        }
                    });
                    break;
            }
        });
    });
}

function findGameId(clientGameId: string, gameObjects: game[]){
    for (let i = 0; i < gameObjects.length; i++) {
        if(gameObjects[i].gameId == clientGameId)
            return gameObjects[i];
    }
    return null;
}


main();