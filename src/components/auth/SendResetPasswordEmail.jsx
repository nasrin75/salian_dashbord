import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/AuthApi';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const SendResetPasswordEmail = (props) => {
    const {
        emailAddress,
        onFieldChange
    } = props

    const [isLoading, setIsLoading] = useState(false)

    //send token to email
    const sendEmail = () => {
        setIsLoading(true)
        resetPassword(emailAddress)
            .then((resp) => {
                console.log("SuccessSendEmail", resp.data)
                toast.success("کد یکبار مصرف به ایمیل شما ارسال شد")
                setIsLoading(false)
            })
            .catch((err) => {

                toast.error("کاربری با این ایمیل یافت نشد.")
                setIsLoading(false)
            })
    }
    return (
        <>
            <FormControl>
                <FormLabel htmlFor="NewPassword">رمزعبور جدید</FormLabel>
                <TextField
                    name="NewPassword"
                    type="NewPassword"
                    id="NewPassword"
                    autoComplete="NewPassword"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    onChange={(e) => onFieldChange('NewPassword', e.target.value)}
                />

            </FormControl>
            <FormControl>
                <FormLabel htmlFor="Token">کدیکبار مصرف</FormLabel>
                <TextField
                    name="Token"
                    type="Token"
                    id="Token"
                    autoComplete="current-token"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    onChange={(e) => onFieldChange('Token', e.target.value)}
                />

                {isLoading && <Box sx={{ display: 'flex' }}>
                    <CircularProgress enableTrackSlot size="30px" />
                </Box>}
                {
                    !isLoading && (<Button
                        disabled={isLoading}
                        onClick={() => sendEmail()}
                        size='small'
                        className='otp-btn'
                        sx={{ marginTop: 2 }}>
                        ارسال کد
                    </Button>)
                }

            </FormControl>

        </>
    )
}

export default SendResetPasswordEmail;