const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

exports.register = async (req, res) => {

     //Find Email From Database which already exist
	const emailExist = await Users.findOne({ email:req.body.email});

	//check if user already exist
	if (emailExist) return res.status(400).json({ 
			status:'fail',
			message:'Email Already Exist'
	});
  //hash password using bcrypt
  let salt = await bcrypt.genSalt(10);
  let plaintext = req.body.password.toString();
  let haspass = await bcrypt.hash(plaintext, salt);

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: haspass,
    mobile: req.body.mobile,
  });

 // console.log(user)

  try {
    const newuser = await user.save();
    res.status(200).json({
      status: "success",
      data: {newuser},
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      
    });
  }
};

exports.login = async (req, res) => {
  
    const user = await Users.findOne({email:req.body.email});
    //check email is exist or not
    if(!user){
        res.status(400).json({
            status:"fail",
            message:"User Not Found"
        })
    }
    //compare password and then check
    const checkpass =  await bcrypt.compare(req.body.password,user.password);
    if(!checkpass){
        res.status(400).json({
            status:"fail",
            message:"Password Not Match"
        })
    }

    //option expireIn object
    const options = {
        expiresIn: '1h' // Token expiration time
      };

    //sign in and genrate token
    const token = jwt.sign({ _id: user._id },process.env.JWT_SECRET,options);
    res.header('auth-token', token);

    res.status(200).json({
        success: 'success',
        token,
        user,
        message:'Logged In !'
    });



};
