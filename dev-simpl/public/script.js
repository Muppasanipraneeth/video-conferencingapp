const socket=io('/');
socket.emit('join-room',roomId,10) ;
socket.on('user-contected',userid=>{
    console.log('user-connected',userid);
    
})