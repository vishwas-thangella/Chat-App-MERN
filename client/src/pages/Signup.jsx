import React , { useEffect } from 'react';
import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Storage } from '../firebase/firebase';
import { v4 } from 'uuid';
import { LoadingButton } from '@mui/lab'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/Store';

const Signup = () => {
    const [data, setData] = useState({
        Name: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        Profile: "",
    });
    const ChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ToastOptions = {
        position: "top-right",
        autoClose: 8000,
        draggable: true,
        pauseOnHover: true,
        theme: 'dark',
        closeOnClick: false,
    }
    const [helpers,setHelpers] = useState({
        Name:"",
        Email:"",
        Password:"",
        ConfirmPassword:""
    });
    const SubmitHandler = async e => {
        e.preventDefault();
        if(data.Name.length < 3){
            setHelpers({...helpers,Name:"Name is too short !"})
            setTimeout(()=>{
                setHelpers({...helpers,Name:""})
            },4000);
        }else if(data.Password !== data.ConfirmPassword){
            setHelpers({...helpers,ConfirmPassword:"Passwords not matched !"})
            setTimeout(()=>{
                setHelpers({...helpers,ConfirmPassword:""})
            },4000);
        }else if(data.Password.length < 4){
            setHelpers({...helpers,Password:"Password is too short "})
            setTimeout(()=>{
                setHelpers({...helpers,Password:""})
            },4000);
        }else{
            setLoading(true);
            const StorageRef = ref(Storage,`users/${data.Profile.name}`+v4());
            await uploadBytes(StorageRef,data.Profile).then(async resp=>{
                await getDownloadURL(resp.ref).then(url=>{
                    axios.post(`${process.env.REACT_APP_URL}/api/users/signup`,{...data,Profile:url}).then(resp=>{
                        setLoading(false);
                        if(resp.data.success === false){
                            toast.error(resp.data.message,ToastOptions);
                        }else{
                            localStorage.setItem('chat_TK',JSON.stringify(resp.data.token));
                            dispatch(Actions.setAuth(true));
                            navigate("/");
                        }
                    }).catch(err=>{ 
                        console.log(err);
                    });
                });
            });
        }
    };
    const [visibility, setVisibility] = useState(false);
    const [base64, setBase64] = useState('');
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
      const auth = localStorage.getItem('chat_TK');
      if(auth){
        dispatch(Actions.setAuth(true));
        navigate('/');
      }
    },);
    return (
        <Box className='row'>
            <Header />
            <Box className='col-12 sign-bg'>
                <Box className='formCont'>
                    <Box component="form" style={Styles.Form} onSubmit={SubmitHandler}>
                        <Avatar sx={{ width: "60px", height: "60px" }} src={base64} />
                        <Typography className='text-center mt-4 fs-4'>Signup</Typography>
                        <TextField label="Name" required style={Styles.TextField} name="Name" value={data.Name} onChange={ChangeHandler} helperText={helpers.Name}/>
                        <TextField label="Enter Email" required style={Styles.TextField} value={data.Email} onChange={ChangeHandler} name="Email" type="email" helperText={helpers.Email}/>
                        <TextField label="Enter Password" required style={Styles.TextField} value={data.Password} onChange={ChangeHandler} name="Password" type={visibility ? "text" : "password"} InputProps={{
                            endAdornment: (<IconButton onClick={() => {
                                visibility ? setVisibility(false) : setVisibility(true);
                            }}>
                                {
                                    visibility ? <VisibilityOffIcon /> : <VisibilityIcon />
                                }
                            </IconButton>)
                        }} helperText={helpers.Password}/>
                        <TextField label="Confirm Password" required style={Styles.TextField} value={data.ConfirmPassword} onChange={ChangeHandler} name="ConfirmPassword" type={visibility ? "text" : "password"} helperText={helpers.ConfirmPassword}/>
                        <label htmlFor="file" className='mt-2'>Choose profile photo</label>
                        <input type="file" className='mt-2' id="file" onChange={async (e) => {
                            setData({...data,Profile:e.target.files[0]});
                            const Reader = new FileReader();
                            Reader.readAsDataURL(e.target.files[0]);
                            Reader.onload = () => {
                                setBase64(Reader.result);
                            }
                        }} />
                        <LoadingButton type="submit" variant='contained' className='mt-2' loading={loading}>Signup</LoadingButton>
                        <Typography className='mt-4 fs-6'>OR</Typography>
                        <Button>Already have an Account ?</Button>
                        <ToastContainer />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const Styles = {
    TextField: {
        width: "100%",
        marginTop: "7px",
    },
    Form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "30%"
    }
}

export default Signup;