const express = require('express');
const { resolve } = require('path');
require("dotenv").config();
const UserModel=require("./model/userModel")
const bcrypt =require("bcrypt");
const { default: mongoose } = require('mongoose');
const { error } = require('console');

const app = express();
const port = 3010;

app.use(express.json())

mongoose.connect(process.env.mongodb)
.then(()=>{
  console.log("Connect to Database")
})
.catch((error)=>{
  console.log(error)
})

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/signup",async(req,res)=>{
  console.log(req.bo)
  const {username,email,password}=req.body

  try {
    if(!username || !email ||!password){
      res.status(400).json({ message: "All fields are required" });
    }
    let user = await UserModel.findOne({email:email})

    if(user){
      res.status(400).json({message:"User already exist"})
    }

    bcrypt.hash(password,5,async(error,hash)=>{
      if (error){
        res.status(500).json({message:"Server Error"})
      }

      let newuser=new UserModel({username,email,password:hash})

      await newuser.save()
      res.status(200).json({ status: true, message: "registration sucessfull" })
    })


  } catch (error) {
    
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});