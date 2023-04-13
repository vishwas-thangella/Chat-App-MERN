const mongoose = require('mongoose');
const MessageSchema = new  mongoose.Schema({
    message:{
        text:{
            type:String,
            required:[true,'Message is required !']
        },
    },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'sender is required!'],
        ref:'users'
    }
},
{
    timestamps:true
});
module.exports = mongoose.model('messages',MessageSchema);