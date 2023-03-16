const dgram = require('dgram');
const { Server } = require('http');
const server = dgram.createSocket('udp4');

const cars = [];
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});
let TVIP="";
let PORT="";
let MESSAGES="";
let send={};
server.on('message', (msg, senderInfo) => {
    console.log('Messages received '+ msg)
    const x =  "'"+msg+ "'";
    try{    
    s=JSON.parse(msg);
    for(var key in s){
        if(s[key]=="TV"){
            console.log("This TV.. SAVE IP");
            TVIP=senderInfo.address;
            PORT=senderInfo.port;
            console.log(TVIP);
        }       
    }}catch(x){

    }
    try{
    for(var key in s){
        MESSAGES=s[key];
        if(MESSAGES!=="TV"){
            send={
                "Action":"Vector3",
                "Input":MESSAGES
            }

        }else{
            send={
                "Action":"Message",
                "Input":MESSAGES
            }

        }
    }}
    catch(x){
        MESSAGES=senderInfo.address
        send={
            "Action":"Message",
            "Input":MESSAGES
        }

    }

    const xas=JSON.stringify(send);
    // }else{
    //     console.log("No Exist");
    // }
    console.log("this message",xas);
    console.log("SEND MESSAGE",send);
    console.log("Sender IP"+TVIP);
    // console.log(senderInfo.port);

    server.send(xas,PORT,TVIP,()=>{
        console.log(`Message sent to ${MESSAGES}:${TVIP}`)
    });

    // console.log(senderInfo);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening on ${address.address}:${address.port}`);
});

server.bind(5500);