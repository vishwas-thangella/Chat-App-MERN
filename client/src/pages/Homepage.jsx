import { Box } from '@mui/system';
import React, { useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { decodeToken } from 'react-jwt';
import Contacts from '../components/Contacts';
import { CircularProgress } from '@mui/material';

const Homepage = () =>{
    const [contacts,setContacts] = useState([]);
    const Auth = decodeToken(JSON.parse(localStorage.getItem('chat_TK')));
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!Auth){
            navigate('/signin');
        }
        FetchContacts();
    },);
    const FetchContacts = () =>{
        if(Auth){
            axios.get(`${process.env.REACT_APP_URL}/api/users/getallusers/${Auth.userData ? Auth.userData._id : Auth.found._id}`).then(resp=>{
                setContacts(resp.data.users);
                setLoading(false);
            }).catch(err=>{
                console.log(err);
            });
        }
    };
    return(
        <Box component="div" className='row'>
            <Header/>
            <Box className="col-12">
                {
                    loading ? <CircularProgress sx={{position:"absolute",left:"48%",top:"40%"}}/> : <Contacts Contacts={contacts} CurrentUser={Auth}/>
                }
            </Box>
        </Box>
    );
};

export default Homepage;