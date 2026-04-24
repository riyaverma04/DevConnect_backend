// DyYOU2NWcpVmn7XI

const express = require('express');
const connectDb = require('./config/mongoose');
const User = require('./models/userSchema');


const app = express();



app.use(express.json());


app.post('/signup',async(req, res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const user = new User({
            firstName,
            lastName,
            email,
            password
        })
        await user.save();
        res.status(201).json({user,message:"user Created successfully"});
    }catch (err) {
  console.error(err);

  res.status(500).json({
    message: err.message,
    stack: err.stack   // ⚠️ only in dev, remove in production
  });
}
})
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





