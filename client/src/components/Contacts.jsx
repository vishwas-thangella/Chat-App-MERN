import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';
const Contacts = ({ Contacts , CurrentUser }) =>{
    const navigate = useNavigate();
    return(
        <Box>
            <List>
                {
                    Contacts.map(contact=>{
                        return(
                            <React.Fragment key={contact._id}>
                                <ListItem secondaryAction={
                                    <IconButton>
                                        <MessageIcon/>
                                    </IconButton>
                                } className="list" onClick={()=>{
                                    navigate(`/chat/${contact._id}`);
                                }}>
                                    <ListItemAvatar>
                                        <Avatar src={contact.Profile}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={contact.Name} secondary={contact.LastMessage}/>
                                </ListItem>
                                <Divider/>
                            </React.Fragment>
                        );
                    })
                }
            </List>
        </Box>
    );
};
export default Contacts;