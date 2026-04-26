import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth/useAuth";
import SingleEmailForm from "./SingleEmailForm";
import BulkEmailForm from "./BulkEmailForm";

const EmailForm = () => {
    const { hasPermission } = useAuth();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [data, setData] = useState({
        Subject: '',
        Body: ''
    });

    const handleFiledChanges = (name, value) => {
        setData({
            ...data,
            [name]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data)
    }
    
    return (
        <>
         <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    (<Tab label="تکی" />)
                    (<Tab label="گروهی" />)
                </Tabs>

                {value === 0 && <Box sx={{ p: 3 }}> <SingleEmailForm /> </Box>}
                {value === 1 &&  <Box sx={{ p: 3 }}>
                    <BulkEmailForm /> 
                </Box>}
            </Box>
        
        </>
    );
}

export default EmailForm;