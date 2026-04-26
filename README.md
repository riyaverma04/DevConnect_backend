### creating app using express
    - install express in project
    - require('express')
    - listening app at port 7777

### connecting database with app 
    - connecting database with mongoose
    - install mongoose
    - requie('mongoose')
    - install dotenv
    - require('dotenv').config();
    - mongoose.connect(envUrl);


### user model
    - defined the userSchema 
    - validating the input of user with help of validator library
    - install validator 
    

### route for signup 
    - app.post('/signup',(req, res)=>{
        //saving userData in database 
        
    })  
    - save userData in database with userDAta.save()  




### login route
  - app.post('/login',(req, res) =>{

    //token initialize
    //set on cookie
  })




### update user infor route
-  app.patch('/update/:userid',(req,res) =>{
    // get userid from params
    //update data of user in database
})