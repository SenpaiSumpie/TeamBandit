import { React, useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import styles from "../EmailHub.module.css";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    minWidth: "200px",
    lineHeight: "10px",
}));

const ChatLog = ({selectedChain, setInboxViewHandler}) => {
    // JS
    const [messageChain, setMessageChain] = useState([]);

    const getEmails = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASEURL}/emailhub/getchain/${selectedChain}`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            );

            const parseData = await response.json();

            setMessageChain(parseData);
            
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getEmails();
    }, [selectedChain]);
    
    // JSX
    return (
        <div className={`${styles.message} ${styles.lineheight}`}>
        <Item className={styles.titles}>
                
                <Button variant="contained" color="primary" startIcon={<ArrowBackIcon/>} > Back to Inbox </Button>
                <p className={styles.middleleftpane}>{selectedChain}</p>
                
            </Item>
            {messageChain.map((message, index) => (
                <Item
                    className={message.sender === selectedChain ? `${styles.text}` : `${styles.text_sent}`}
                    key={index}
                >
                    <p>{message.sender}</p>
                    <p className={styles.lineheight}>{message.message}</p>
                </Item>
                
            ))}
        </div>
    );
};

export default ChatLog;
