import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { verifyResetPassword } from '../../api/AuthApi';
import CloseIcon from '@mui/icons-material/Close';
import SendResetPasswordEmail from './SendResetPasswordEmail';

function ForgotPassword({ open, handleClose }) {
  const [showNewPasswordFiled, setShowNewPasswordFiled] = useState(false)
  const [email, setEmail] = useState('')

  const [data, setData] = useState({
    Email: '',
    Token: '',
    NewPassword: ''
  })

  const handelEmail = (value) => {
    setEmail(value);
    handleFormFieldChange('Email', value)
  }
  const showPasswordModal = () => {
    setShowNewPasswordFiled(true)
  }

  // verify reset password
  const verify = (e) => {
    e.preventDefault();

    verifyResetPassword(data)
      .then(() => {
        toast.success("رمزعبور با موفقیت تغییر کرد")
        handleClose()
      })
      .catch(() => toast.error("کد یکبار مصرف نامعتبر است."))
  }

  const handleFormFieldChange = useCallback((name, value) => {
    const newValues = {
      ...data,
      [name]: value
    }
    setData(newValues)

  }, [setData, data, email])


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>
        <CloseIcon fontSize='medium' sx={{ paddingTop: '5px' }} onClick={handleClose} />
        فراموشی رمز عبور
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >

        <Grid variant="outlined" sx={{ minWidth: "500px" }}>
          <Box
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >

            {!showNewPasswordFiled && (
              <FormControl>
                <FormLabel htmlFor="email" >برای بازیابی رمز عبور حساب کاربری ، ابتدا ایمیل خود را وارد نمایید.</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  placeholder='ایمیل  خود را وارد کنید'
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handelEmail(e.target.value)}
                  control={<Button placeholder="dsfds" />}
                  sx={{ marginTop: "8px" }}
                />
                <Button
                  className='login-btn'
                  fullWidth
                  onClick={() => showPasswordModal()}
                  sx={{ marginTop: "8px" }}
                >
                  ادامه
                </Button>
              </FormControl>
            )}

            {showNewPasswordFiled && (<SendResetPasswordEmail
              emailAddress={email}
              onFieldChange={handleFormFieldChange}
            />)}

            {showNewPasswordFiled && (
              <Button
                className='login-btn'
                type='btn'
                sx={{ marginTop: "8px" }}
                onClick={(e) => verify(e)}
              >
                ذخیره
              </Button>
            )}
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired
};


export default ForgotPassword;
