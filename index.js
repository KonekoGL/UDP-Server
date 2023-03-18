const dgram = require('dgram');
const { Server } = require('http');
const server = dgram.createSocket('udp4');

const cars = [];
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
//PORT AND CONNECTION TO SEND DATA (TV MAYBE)...
let TVIP="127.0.0.1";
let PORT="3034";
//
let sockets=[];
server.on('message', (msg, senderInfo) => {
        console.log('Messages received '+ msg)
        JsonResive=JSON.parse(msg);
        for(var key in JsonResive){
            if(JsonResive[key]=="ADD"){
                console.log("Checking if socket is add..",JsonResive["Socket"]);
                if(!sockets.includes(JsonResive["Socket"])){
                    sockets.push(JsonResive["Socket"]);
                }else{
                    console.log("Socket is allready used..");
                }
            }
            if(JsonResive[key]=="CLOSE"){
                console.log("Checking if socket EXIS..",JsonResive["Socket"]);
                console.log("Socket:",sockets);
                if(!sockets.includes(JsonResive["Socket"])){
                    console.log("Socket not exist in this context...");
                }else{
                    indexSocket = sockets.findIndex(sockets => sockets === JsonResive["Socket"]);
                    console.log(indexSocket);
                    sockets.splice(indexSocket, 1);
                    console.log("Socket:",sockets);
                }
            }
            if(JsonResive[key]=="Message"){
                try {
                    // console.log(JsonResive);
                } catch (error) {
                    console.error(error)
                }
            }
        }
        const JSONStrings=JSON.stringify(JsonResive);
        server.send(JSONStrings,PORT,TVIP);
    }
);

//Listener if server is working and Send Status..
server.on('listening', () => {
    const address = server.address();
    let json={
        "Action":"Status",
        "isListener":"true"
    }
    const JSONStrings=JSON.stringify(json);
    console.log(`server listening on ${address.address}:${address.port}`);
    try {
        server.send(JSONStrings,PORT,TVIP,()=>{
            console.log(JSONStrings);
        });
    } catch (error) {
        console.error(error)
    }
});

//Check if Disconect player (dont listener);
server.on("close",()=>{
    console.log("Disconnected!");
});


server.bind(5500);