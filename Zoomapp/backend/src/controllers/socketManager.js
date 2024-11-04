import { Server } from "socket.io";

export const connectTosoc=(server)=>{
    const io=new Server(server);

    return io;
}