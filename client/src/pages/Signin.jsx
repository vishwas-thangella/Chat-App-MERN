import React , { useEffect } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { ToastContainer , toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/Store';

const Signin = () =>{
    const [data,setData] = useState({
        Email:"",
        Password:""
    });
    const ChangeHandler = e =>{
        setData({...data,[e.target.name]:e.target.value});
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ToastOptions = {
        position:"top-right",
        autoClose:8000,
        draggable:true,
        pauseOnHover:true,
        theme:'dark',
        closeOnClick:false,
    }
    const SubmitHandler = e =>{
        e.preventDefault();
        setLoading(true);
        axios.post(`${process.env.REACT_APP_URL}/api/users/signin`,data).then(resp=>{
            setLoading(false);
            if(resp.data.success===false){
                toast.error(resp.data.message,ToastOptions);
            }else{
                localStorage.setItem('chat_TK',JSON.stringify(resp.data.token));
                dispatch(Actions.setAuth(true));
                navigate('/');
            }
        }).catch(err=>{
            console.log(err);
        });
    };
    const [visibility,setVisibility] = useState(false);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        const auth = localStorage.getItem('chat_TK');
        if(auth){
          dispatch(Actions.setAuth(true));
          navigate('/');
        }
      },);
    return(
        <Box className='row'>
            <Header/>
            <Box className='col-12 sign-bg'>
                <Box className='formCont'>
                    <Box component="form" style={Styles.Form} onSubmit={SubmitHandler}>
                        <Typography className='text-center mt-4 fs-4'>Signin</Typography>
                        <TextField label="Enter Email" required style={Styles.TextField} value={data.Email} onChange={ChangeHandler} name="Email" type="email"/>
                        <TextField label="Enter Password" required style={Styles.TextField} value={data.Password} onChange={ChangeHandler} name="Password" type={visibility ? "text" : "password"} InputProps={{
                            endAdornment:(<IconButton onClick={()=>{
                                visibility ? setVisibility(false) : setVisibility(true);
                            }}>
                                {
                                    visibility ? <VisibilityOffIcon/> : <VisibilityIcon/>
                                }
                            </IconButton>)
                        }}/>
                        <LoadingButton type="submit" variant='contained' className='mt-2' loading={loading}>Signin</LoadingButton>
                        <Typography className='mt-4 forget'>Forget Password ?</Typography>
                        <Typography className='mt-4 fs-6'>OR</Typography>
                        <Button>Create an Account !</Button>
                        <ToastContainer/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const Styles = {
    TextField:{
        width:"100%",
        marginTop:"7px",
    },
    Form:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        marginTop:"30%"
    }
}

export default Signin;