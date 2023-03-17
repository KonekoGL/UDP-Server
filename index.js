const dgram = require('dgram');
const { Server } = require('http');
const server = dgram.createSocket('udp4');

const cars = [];
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
let TVIP="127.0.0.1";
let PORT="3020";
let MESSAGES="";
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
                if(!sockets.includes(JsonResive["Socket"])){
                    console.log("Socket not exist in this context...");
                }else{
                    indexSocket = sockets.findIndex(sockets => sockets === JsonResive["Socket"]);
                    console.log(indexSocket);
                    sockets.splice(indexSocket, 1);
                }
            }
            if(JsonResive[key]=="Message"){
                try {
                 console.log(JsonResive);
                } catch (error) {
                    
                    console.error(error)
                }
            }
        }
        const JSONStrings=JSON.stringify(JsonResive);
        
        server.send("Perro",PORT,TVIP,()=>{
            server.send(JSONStrings,PORT,TVIP,()=>{
                console.log(`Its sending...`);
            });
        });
    }
);

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening on ${address.address}:${address.port}`);
    try {
        server.send("SERVER LISTENER!",PORT,TVIP,()=>{
            console.log(`Its sending...`)
        });
        server.send("Perro",PORT,TVIP,()=>{
            console.log(`Send kill`)
        });
    } catch (error) {
        console.error(error)
    }

});

server.bind(5500);