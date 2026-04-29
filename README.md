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



### get all requests route
 - /requests/received


### feed of a user
 - user will not see the user's profile he has send the request or recieved requests and his connections
 - use new Set() algorithm to add the values but don't want to repeat
 - used $and query for checks 
 - used comparison query like $nin(not in ) and $ne( not equal )


 ```json
   const getConnection = await ConnectionRequest.find({
            $or:[{senderId: loggedInUser._id},{receiverId: loggedInUser._id}],
        }).select("senderId receiverId");

        const hideUserFromFeed = new Set();
        const hideUserIdArray = getConnection.forEach((req) =>{
             hideUserFromFeed.add(req.senderId.toString()),
            hideUserFromFeed.add(req.receiverId.toString())
     } )
        console.log(hideUserFromFeed)

        const feedUser = await User.find({
            $and:[
               { _id:{ $nin : Array.from(hideUserFromFeed)}},
                {
                    _id:{$ne: loggedInUser._id}
                }
            ]


       }).select(USER_SAFE_DATA)

```



 ### pagination
 - to limit the user on feed 
 - /feed?page=1&limit=10 => 1-10 .skip(1) .limit(10)
 - /feed?page=2&limit=10 => 1-10 .skip(11) .limit(20)
 - /feed?page=3&limit=10 => 1-10 .skip(21) .limit(30)




