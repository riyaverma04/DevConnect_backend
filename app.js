// DyYOU2NWcpVmn7XI

const express = require('express');
const {createServer} = require('node:http');
const socketServer = require('./utils/socket');

const connectDb = require('./config/mongoose');
const userRouter = require('./routes/userRouter')
const messageRouter= require('./routes/messageRouter')
const connectionRouter = require('./routes/getConnectionsRouter')
const connectionRequestRouter = require('./routes/connectionRequestRouter');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const postsRouter = require('./routes/postsRouter');



const app = express();
const server = createServer(app);
socketServer(server);


//adding cors middleware to allow cross-origin requests from frontend
// app.options("*", cors());
app.use(cors({
    // //whitelist the frontend url
    // //need to whitelist the frontend url because in development it is not secure
    // origin : "http://localhost:5173",
    
    // credentials: true, //allow cookies to be sent with requests
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    //  allowedHeaders: ["Content-Type", "Authorization"],
     origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
    
}))


app.use(express.json());
app.use(cookieParser());

app.use('/', userRouter);
app.use('/', connectionRequestRouter);
app.use('/', connectionRouter);
app.use('/', messageRouter);
app.use('/',postsRouter);



app.get('/',(req, res)=>{
    res.send("hellow world");
})

connectDb().then(()=>{
    console.log("connected to mongodb");
    server.listen(7777,()=>{
    console.log("server is running on port 7777");
  })
})
.catch((err) => {
    console.log("error connecting to mongodb", err);
    
})





