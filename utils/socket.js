const {Server} = require('socket.io');


const socketServer=(server)=>{
    const io = new Server(server,{
          cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });


    io.on('connection', (socket)=>{
        console.log('a user connected',socket.id);
        socket.on("join_chat",(roomId)=>{
            socket.join(roomId);

            console.log("joined room" , roomId);
        })
        socket.on('send_message',(data)=>{
            console.log("message:" , data);
            io.to(data.roomId).emit("receive_message",data);
        })
         socket.on("disconnect",()=>{
            console.log('user disconnected: ',  socket.id);
        })



        });

       
   
}

module.exports = socketServer;