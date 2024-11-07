const express=require("express");
const app=express();
const http =require("http");
const {Server} =require("socket.io");
const cors=require("cors");
app.use(cors);

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log(`connected device ${socket.id}`);

    socket.on("send_message",(data)=>{
        console.log(data);
        io.emit("received_data",(data));
        
    })
    socket.on("disconnect",()=>{
        console.log("user is diconnected"+socket.id);
        
    })
})

server.listen(3001,()=>{
    console.log(`this port is listing  ${3001}`);
    
})




  