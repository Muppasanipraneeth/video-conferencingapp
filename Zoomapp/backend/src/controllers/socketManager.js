import { Server, Socket } from "socket.io";
const connections = {};
const message = {};
const timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {
            if (!connections[path]) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit("user-joined", socket.id, connections[path]);
            }

            if (!message[path]) {
                message[path] = [];
            }
            for (let i = 0; i < message[path].length; i++) {
                io.to(socket.id).emit(
                    "chat-message",
                    message[path][i]['data'],
                    message[path][i]['sender'],
                    message[path][i]['socket-id-sender']
                );
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                },
                ["", false]
            );

            if (found) {
                if (!message[matchingRoom]) {
                    message[matchingRoom] = [];
                }
                message[matchingRoom].push({ 'sender': sender, 'data': data, 'socket-id-sender': socket.id });

                connections[matchingRoom].forEach((element) => {
                    io.to(element).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            const diffTime = Math.abs(timeOnline[socket.id] - Date.now());

            for (const [key, socketArray] of Object.entries(connections)) {
                const index = socketArray.indexOf(socket.id);
                if (index !== -1) {
                    // Notify other users in the same room
                    socketArray.forEach((id) => {
                        io.to(id).emit("user-left", socket.id);
                    });
                    // Remove the disconnected socket from the room
                    connections[key].splice(index, 1);
                    break;
                }
            }

            delete timeOnline[socket.id];
        });
    });

    return io;
};
