const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
require("dotenv").config();


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        trim:true,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error("first name should contain only alphabets");
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        trim:true,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error("first name should contain only alphabets");
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email");
            }   
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100,
            validate(value){   
            if(!validator.isStrongPassword(value)){

                throw new Error("password should be strong");
            }
        }
    },
   profileUrl: {
  url: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6rKwDbEN_M9FCcve-ozbDkUUn6VkEZ7xfVw&s"
  },
  public_id: {
    type: String,
    default: ""
  }
},
    coverUrl:{
        type: String,


    },
    age:{
        type: Number,
        min: 0,
        max: 120        
    },
    gender:{
        type: String,
        enum:{
            values: ["male", "female", "others" ,""],
            message:"gender is not valid"
        },
        
       
    },
    about:{
        type: String,
        maxLength: 500  
    },
    skills:{
        type: [String]
    }

       
},{timestamps: true});



userSchema.methods.jwtToken = async function(userId){
    // return await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: '1h'  })
    return await jwt.sign({ userId: this._id }, process.env.JWT_SECRET)
    
}




const User = mongoose.model("User",userSchema);

module.exports = User;