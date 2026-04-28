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




### update user info route
-  app.patch('/update/:userid',(req,res) =>{
    // get userid from params
    //update data of user in database
})

### get user profile route
app.get('/profile/:userid',(req,res) =>{
    // get userid from params
    //get the user from database
})



### added authUser middleware for authentication
 


### updated protected routes
  - GET/profile
  - PATCH/update
  - DELETE/delete   

### added cookie-parser
 - npm i cookie-parser 






 ## 1️⃣ Accept / Reject Connection Request

### ➤ POST

/requests/:status/:receiverId


### 📥 Params
- `status` → `"accepted"` or `"rejected"`
- `receiverId` → ID of the user who sent the request

### ✅ Description
Allows the logged-in user to accept or reject a connection request.

### ⚠️ Validations
- Receiver must exist
- Status must be `"accepted"` or `"rejected"`
- User cannot accept/reject their own request
- Request must exist with status `"interested"`

### 📤 Response
```json
{
  "message": "you accepted the user's request",
  "data": { ...connectionRequest }
}
```

###  Get All Connections
 ## ➤ GET
/user/connections
✅ Description

Fetches all accepted connections of the logged-in user.

Includes both:
Sent connections
Received connections
Only returns users where status = "accepted"
🔁 Logic
If logged-in user is sender → return receiver
If logged-in user is receiver → return sender
📤 Response
```json
{
  "message": "connections found successfully",
  "connections": [
    {
      "_id": "userId",
      "firstName": "John",
      "lastName": "Doe",
      "profileUrl": "...",
      "about": "...",
      "skills": ["Node.js", "React"]
    }
  ]
}
```
### Internal Working
Uses populate() to fetch user details:
.populate("senderId", "firstName lastName profileUrl about skills")
.populate("receiverId", "firstName lastName profileUrl about skills")
Filters the "other user":
if (connection.senderId._id.toString() === loggedInUser._id.toString()) {
  return connection.receiverId;
} else {
  return connection.senderId;
}