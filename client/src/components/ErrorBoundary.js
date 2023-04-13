import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header';
class ErrorBoundary extends React.Component{
    constructor(){
        super();
        this.state = {
            ERROR:false,
        }
    }
    componentDidCatch(e){
        this.setState({
            ERROR:true
        });
    }
    render(){
       if(this.state.ERROR){
        return(
            <Box className='row'>
                <Header/>
                <Typography className='text-center mt-4 fs-5'>Something Went Wrong ! </Typography>
                <Button onClick={()=>{
                    localStorage.clear();
                    Navigate('/signin');
                }}>Refresh</Button>
            </Box>
        );
       }else{
        return this.props.children
       }
    }
};
export default ErrorBoundary;