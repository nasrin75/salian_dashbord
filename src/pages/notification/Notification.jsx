import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import PageContainer from "../../components/PageContainer";
import { PERMISSION } from "../../utlis/constants/Permissions";
import useAuth from "../../hooks/useAuth/useAuth";
import EmailForm from "../../components/notifications/email/EmailForm";

const Notification = () => {
    const { hasPermission } = useAuth();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <PageContainer
            title="اطلاع رسانی"
            marginTop='20px'
        >
            <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {hasPermission([PERMISSION.SEND_SMS_NOTIFICATION]) && (<Tab label="پیامک" />)}
                    {hasPermission([PERMISSION.SEND_EMAIL_NOTIFICATION]) && (<Tab label="ایمیل" />)}
                    {hasPermission([PERMISSION.SEND_PUSH_NOTIFICATION]) && (<Tab label="پوش" />)}
                </Tabs>

                {value === 0 && <Box sx={{ p: 3 }}>Content for Tab 1</Box>}
                {value === 1 && <Box sx={{ p: 3 }}>
                    <EmailForm />
                </Box>}
                {value === 2 && <Box sx={{ p: 3 }}>Content for Tab 3</Box>}
            </Box>
        </PageContainer>
    )
}

export default Notification;