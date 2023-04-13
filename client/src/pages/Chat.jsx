import { AppBar, Avatar, CircularProgress, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/Store';
import { decodeToken } from 'react-jwt';
import { io } from 'socket.io-client';

const Chat = () =>{
    const socket = useRef();
    const { id } = useParams();
    const [user,setUser] = useState('');
    const [loading,setLoading] = useState(true);
    const [emojiOpen,setEmojiOpen] = useState(false);
    let [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const [Arrivalmsg,setArrivalmsg] = useState();
    const CurrentUser = decodeToken(JSON.parse(localStorage.getItem('chat_TK')));
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_URL}/api/users/user/${id}`).then(resp=>{
            setUser(resp.data.user);
        }).catch(err=>{     
            console.log(err);
        })
        getMessages();
        // EstablishSocket();
    });
    useEffect(()=>{
        if(CurrentUser){
            socket.current = io(process.env.host);
            socket.current.emit('add-user',CurrentUser.found._id);
        }
    },[CurrentUser]);
    const getMessages = () =>{
        axios.post(`${process.env.REACT_APP_URL}/api/message/get`,{
            from:CurrentUser.found ? CurrentUser.found._id : CurrentUser.userData._id,
            to:id
        }).then(resp=>{
            // console.log(resp);
            if(resp.data.success === true){
                setMessages(resp.data.ProjectedMsgs);
                setLoading(false);
            }else{
                console.log(resp.data.message);
            }
        }).catch(err=>{
            console.log(err);
        })
    };
    const SendMessage = () =>{
        // alert(message);
        socket.current.emit('send-msg',{
            to:id,
            from:CurrentUser.found ? CurrentUser.found._id : CurrentUser.userData._id,
            msg:message,
        })

        const msgs = [...messages];
        msgs.push({fromSelf:true,msg:message});
        setMessages(msgs);

        axios.post(`${process.env.REACT_APP_URL}/api/message/add`,{
            from:CurrentUser.found ? CurrentUser.found._id : CurrentUser.userData._id,
            to:id,
            msg:message,
        }).then(resp=>{
            // console.log(resp);
            if(resp.data.success === true){
                setMessage('');
            }else{
                alert('something went wrong!')
            }
        }).catch(err=>{
            console.log(err);
        })
    };

    useEffect(()=>{
        if(socket.current){
            socket.current.on('msg-recieve',(mesg)=>{
                setArrivalmsg({
                    fromSelf:false,
                    msg:mesg
                });

            })
        }
    },[]);

    useEffect(()=>{
        Arrivalmsg && setMessages(prev=>[...prev,Arrivalmsg]); 
    },[Arrivalmsg]);
    const dispatch = useDispatch();
    return(
        <Box className="row">
            <AppBar position='static' sx={{boxShadow:"0px 0px 1px black"}}>
                <Toolbar sx={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",gap:"10px"}}>
                        <IconButton sx={{color:"white"}} onClick={()=>{
                            dispatch(Actions.setDrawer(true));
                        }}>
                            <MenuIcon/>
                        </IconButton>
                        <Avatar src={user.Profile}/>
                        <Box>
                            <Typography>{user.Name}</Typography>
                            <span style={{fontSize:"11px"}}>Last Login {user.LastOnline}</span>
                        </Box>
                    </Box>
                    <Box>
                        <Tooltip title="About user">
                            <IconButton sx={{color:"white"}}>
                                <InfoIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className="col-12" sx={{
                overflowY:"scroll",
                height:"100vh",
                position:"fixed",
                top:"70px",
                paddingBottom:"260px"
            }}>
                {
                    !loading ? messages.map(msg=>{
                        return(
                            <div className={msg.fromSelf ? 'sent' : 'recieved'} key={msg.id}>
                                <Box className={msg.fromSelf ? 'bxSent' : 'bxRec'}>
                                    <Avatar src={msg.fromSelf ? CurrentUser.found ? CurrentUser.found.Profile : CurrentUser.userData.Profile : user.Profile} sx={{width:"20px",height:"20px"}}/>
                                    <Typography className="inner">{msg.message}</Typography>
                                </Box>
                            </div>
                        );
                    }) : <CircularProgress sx={{
                        position:"absolute",
                        top:"50%",
                        left:"46%"
                    }}/>
                }
            </Box>
            <Box className="btm-inp">
                {
                    emojiOpen ? <Box className="emoji-picker-react"><EmojiPicker onEmojiClick={(e)=>{
                        // console.log(e);
                        setMessage(`${(message)+=e.emoji}`);
                    }}/></Box> : ''
                }
                <Tooltip title="Select Emoji">
                    <IconButton onClick={()=>{
                        emojiOpen ? setEmojiOpen(false) : setEmojiOpen(true);
                    }}>
                        <EmojiEmotionsIcon/>
                    </IconButton>
                </Tooltip>
                <input type="text" placeholder='Enter Message' value={message} onChange={(e)=>{
                    setMessage(e.target.value);
                }} name="message" onKeyDown={(e)=>{
                    // console.log(e);
                    if(e.key==='Enter'){
                        SendMessage();
                    }
                }}/>
                <Box sx={{display:"flex",alignItems:'center'}}>
                    <Tooltip title="Send">
                        <IconButton sx={{padding:"13px"}} onClick={()=>{
                            if(message.length>0){
                                SendMessage();
                            }
                        }} color="primary">
                            <SendIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};
export default Chat;