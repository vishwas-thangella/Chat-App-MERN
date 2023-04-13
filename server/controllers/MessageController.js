const MessageModel = require('../models/Messagemodel');
const UserModel = require('../models/UserModel');

const Addmessage = async (req,res) =>{
    const { from , to , msg } = req.body;
    try{
        const message = new MessageModel({
            message:{text:msg},
            users:[from,to],
            sender:from
        });
        const saved = await message.save();
        const User = await UserModel.findOne({_id:to});
        if(User){
            if(saved){
                res.status(200).json({
                    success:true,
                    message:"Message added"
                });
            }
            else{
                throw new Error("Failed to save");
            }
        }
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message,
        });
    }
};

const GetAllMessages = async (req,res)=>{
    const { from , to } = req.body;
    try{
        const message = await MessageModel.find({
            users:{
                $all:[from,to],
            },
        }).sort({updatedAt:1});
        const ProjectedMsgs = message.map(msg=>{
            return{
                fromSelf:msg.sender.toString() === from,
                message:msg.message.text,
                id:msg._id,
            }
        })
        res.status(200).json({
            success:true,
            ProjectedMsgs
        });
    }catch(e){
        res.status(200).json({
            success:false,
            message:e.message
        });
    }
}


module.exports = { Addmessage , GetAllMessages };