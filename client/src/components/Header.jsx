import { AppBar, Avatar, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { Box, Stack } from '@mui/system';
import Icon from '../Assets/chat.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';
import { Actions } from '../redux/Store';
import LogoutIcon from '@mui/icons-material/Logout';
const Header = () =>{
    const navigate = useNavigate();
    const Auth = useSelector(state=>state.Auth);
    const dispatch = useDispatch();
    const AuthDetails = JSON.parse(localStorage.getItem('chat_TK'));
    const user = decodeToken(AuthDetails);  
    const MobileView = useSelector(state=>state.MobileView);
    return(
        <AppBar position='static' sx={{backgroundColor:"white",boxShadow:"0px -7px 10px gray"}}>
            <Toolbar sx={{display:"flex",justifyContent:"space-between",flexDirection:"row"}}>
                <Box>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconButton sx={{color:"black"}} onClick={()=>dispatch(Actions.setDrawer(true))}>
                            <MenuIcon fontSize='medium'/>
                        </IconButton>
                        <Avatar src={Icon}/>
                        <Typography sx={{color:"black"}}>Chat App</Typography>
                    </Stack>
                </Box>
                <Box sx={{display:"flex",flexDirection:"row"}}>
                    {!Auth && <Button style={styles.Button} onClick={()=>navigate('/signin')}>Signin</Button>}
                    {!Auth && <Button style={styles.Button} onClick={()=>navigate('/signup')}>Signup</Button>}
                    {Auth && <Avatar src={user.found ? user.found.Profile : user.userData.Profile}/>}
                    {(Auth && !MobileView) && <Tooltip title="Logout"sx={{marginLeft:"10px"}}><IconButton onClick={()=>{
                        localStorage.removeItem('chat_TK');
                        dispatch(Actions.setAuth(false));
                        navigate('/signin');
                    }}><LogoutIcon/></IconButton></Tooltip>}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default Header;  

const styles = {
    Button:{
        color:"black"
    },
};