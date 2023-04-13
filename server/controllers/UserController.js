const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const date = new Date();

const Signup = async (req,res) =>{
    try{
        const dup = await UserModel.findOne({Email:req.body.Email});
        if(dup){
            throw new Error("User already Exists !")
        }else{
            const user = new UserModel(req.body);
            const hash = await bcrypt.hash(req.body.Password,10);
            user.Password = hash;
            const userData = await user.save();
            userData.Password = null;
            const token = jwt.sign({userData},process.env.SECRET,{expiresIn:"2h"});
            res.status(200).json({
                success:true,
                token
            });
        }
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message
        });
    };
};

const Signin = async (req,res)=>{
    try{
        const found = await UserModel.findOne({Email:req.body.Email});
        if(found){
            if(await bcrypt.compare(req.body.Password,found.Password)){
                const LastOnline = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
                await UserModel.updateOne({_id:found._id},{$set:{
                    LastOnline:LastOnline
                }});
                found.Password = null;
                const token = jwt.sign({found},process.env.SECRET,{expiresIn:"2h"});
                res.status(200).json({
                    success:true,
                    token
                });
            }else{
                throw new Error("Password not matched !");
            }
        }else{
            throw new Error('User not found !')
        }
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message
        });
    };
};

const GetAllusers = async (req,res) =>{
    try{
        const users = await UserModel.find({_id:{$ne:req.params.id}}).select('-Password').sort({updatedAt:-1})
        res.status(200).json({
            success:true,
            users
        });
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message,
        });
    }
}

const GetSingleUser = async (req,res)=>{
    try{
        const user = await UserModel.findOne({_id:req.params.id}).select('-Password');
        if(user){
            res.status(200).json({
                success:true,
                user
            });
        }else{
            throw new Error("User not Found !")
        }
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message
        });
    }
}

module.exports = { Signup, Signin , GetAllusers , GetSingleUser};