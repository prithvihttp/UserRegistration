// import { Timestamp } from "bson";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { type } from "os";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  avatar: {
    type: String, // storing image cloudinary URL or path 
    required: true
  },
  password: {
    type: String,
    required: [true,"Password is true"]
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true // enables createdAt & updatedAt fields
});

userSchema.pre('save',async function(next){
  if(!this.isModified("password"))return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})
userSchema.methods.isPasswordCorrect = async function () {
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  const token = jwt.sign(
    {
      _id:this._id,
      email:this.email,
      userName:this.userName,
      fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
  console.log("token :",token);
  
  return token;
}

userSchema.methods.generateRefreshToken = function(){
  const token = jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
  console.log("token :",token);
  
  return token;
}

export default User = mongoose.model("User",userSchema)