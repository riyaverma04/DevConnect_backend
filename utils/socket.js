const {Server} = require('socket.io');
const UserMessage = require('../models/messageSchema');


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
        socket.on('send_message',async(data)=>{
            console.log("message:" , data);
            const newMessage = new UserMessage({
                roomId : data.roomId,
                senderId: data.senderId,
                message: data.text,
                
            })
            //saving the message in db 
            const savedMessage=  await newMessage.save();
            io.to(data.roomId).emit("receive_message",savedMessage);
        })
         socket.on("disconnect",()=>{
            console.log('user disconnected: ',  socket.id);
        })



        });

       
   
}

module.exports = socketServer;