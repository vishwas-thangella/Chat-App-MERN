import React, { useEffect } from 'react';
import { Route, Routes , useNavigate } from 'react-router-dom';
import Signin from './pages/Signin';
import './App.css'
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from './redux/Store';
import Chat from './pages/Chat';
import { Button, Drawer } from '@mui/material';
import { Box } from '@mui/system';

const App = () =>{
  const dispatch = useDispatch();
  const DrawerOpen = useSelector(state=>state.Drawer);
  const Authent = useSelector(state=>state.Auth);
  useEffect(()=>{
    ConfigureView();
    const Auth = localStorage.getItem('chat_TK');
    if(Auth){
      dispatch(Actions.setAuth(true));
    }
  });
  const ConfigureView = () =>{
    if(window.innerWidth<500){
      dispatch(Actions.setMobileView(true));
    }else{
      dispatch(Actions.setMobileView(false));
    }
  }
  window.addEventListener('resize',ConfigureView);
  const navigate = useNavigate();
  return(
    <>
      <Drawer open={DrawerOpen} anchor="left" onClose={()=>dispatch(Actions.setDrawer(false))}>
        <Box sx={{width:"260px"}}>
          {
            !Authent ? <Box>
              <Button>Signin</Button>
              <Button>Signup</Button>
            </Box> : <Box>
              <Button color='error' onClick={()=>{
                localStorage.clear('chat_TK');
                dispatch(Actions.setAuth(false));
                navigate('/signin');
              }}>Logout</Button>
            </Box>
          }
        </Box>
      </Drawer>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/chat/:id" element={<Chat/>}/>
      </Routes>
    </>
  );
};

export default App;