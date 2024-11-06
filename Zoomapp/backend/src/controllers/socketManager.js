import { Server } from "socket.io";
const connections={};
const message={};
const timeOnline={};


export const connectTosoc=(server)=>{
    const io=new Server(server);
    io.on("connection",(socket)=>{

        socket.on("join-call",(path)=>{

        })
        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id,message);
        })
        socket.on("chat-message",(data,sender)=>{

            
        })
        socket.on("disconnect",()=>{
            
        })

    })

    return io;
}