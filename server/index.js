const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const ConnectToDB = require('./config/Database');
const UserRouter = require('./routes/UserRoute');
const MessageRoute = require('./routes/MessageRoute');
const cors = require('cors');
const socket = require('socket.io');

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({path:'.env'});

ConnectToDB();

app.use('/api/users',UserRouter);
app.use('/api/message',MessageRoute);

const server = app.listen(process.env.PORT,()=>{
    console.log(colors.red(`server started at port : ${process.env.PORT}`));
});

const io = socket(server,{
    cors:{
        origin:'http://192.168.29.173:3000'
    },
    credentials:true,
});

global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket;
    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on('send-msg',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve',data.message);
        }
    });
});
