// DyYOU2NWcpVmn7XI

const express = require('express');
const connectDb = require('./config/mongoose');
const userRouter = require('./routes/userRouter')



const app = express();




app.use(express.json());
app.use('/', userRouter);



app.get('/',(req, res)=>{
    res.send("hellow world");
})

connectDb().then(()=>{
    console.log("connected to mongodb");
    app.listen(7777,()=>{
    console.log("server is running on port 7777");
  })
})
.catch((err) => {
    console.log("error connecting to mongodb", err);
    
})





