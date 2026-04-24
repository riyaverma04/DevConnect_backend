const mongoose = require("mongoose");
const validator = require("validator");


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
    profilePic:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

    },
    coverPic:{
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
            values: ["male", "female", "other"],
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




const User = mongoose.model("User",userSchema);

module.exports = User;