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
                console.log("Checking if socket is add..");
                sockets.includes();
            }
        }
    }


    // try{    
    
    // for(var key in s){
    //     if(s[key]=="TV"){
    //         console.log("This TV.. SAVE IP");
    //         TVIP=senderInfo.address;
    //         PORT=senderInfo.port;
    //         console.log(TVIP);
    //     }       
    // }}catch(x){

    // }
    // try{
    // for(var key in s){
    //     MESSAGES=s[key];
    //     if(MESSAGES!=="TV"){
    //         send={
    //             "Action":"Vector3",
    //             "Input":MESSAGES
    //         }

    //     }else{
    //         send={
    //             "Action":"Message",
    //             "Input":MESSAGES
    //         }

    //     }
    // }}
    // catch(x){
    //     MESSAGES=senderInfo.address
    //     send={
    //         "Action":"Message",
    //         "Input":MESSAGES
    //     }

    // }

    // const xas=JSON.stringify(send);
    // server.send("Perro",PORT,TVIP,()=>{
    //     server.send(xas,PORT,TVIP,()=>{
    //         console.log(`kill th`)
    //     });
    // });

    // console.log(senderInfo);
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