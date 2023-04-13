const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:[true,"Name is required !"]
    },
    Email:{
        type:String,
        unique:true,
        required:[true,"Email is required !"]
    },
    Password:{
        type:String,
        required:[true,"Password is required !"]
    },
    Profile:{
        type:String,
        default:"https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg"
    },
    LastOnline:{
        type:String,
        default:""
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('users',UserSchema);