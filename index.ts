import { Command, OptionValues } from 'commander';
import WebSocket from 'ws';
import client from "./tictac_client";


function parseArgumnent():OptionValues
{
    const program = new Command();

    program.option('-address <type>')
    program.option('-name <type>')

    program.parse(process.argv);
    const options = program.opts();
    return options;
}

function main()
{
    const options = parseArgumnent();
    const gameClient = new client(options.Address, options.Name);

    gameClient.oldOrNew();

    gameClient.connectToServerAs();

    gameClient.conection.on('message', function incoming(msg: WebSocket.Data){
        var textChunk = JSON.parse(msg.toString())
        console.log(textChunk);
        gameClient.parseResponse(textChunk);
    });

}

main();