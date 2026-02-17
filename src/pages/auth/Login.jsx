import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../../components/auth/ForgotPassword';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import { GoogleIcon } from '../../components/auth/CustomIcons';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useAuth from '../../hooks/useAuth/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../utlis/constants/routePath';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login(props) {
  const auth = useAuth();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isShowOtpInput, setIsShowOtpInput] = useState(false)
  const [isSendOtp, setIsSendOtp] = useState(false)

  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  //console.log('isshow:: ', isShowOtpInput);
  const handleClose = () => {
    setOpen(false);
  };

  console.log({
    username: username,
    password: password,
    IsOtp: isShowOtpInput,
    haveSendOtp: isSendOtp
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log('auth: ',auth)
    const data = new FormData(event.currentTarget);
    const resp = auth.loginAction({
      Username: username,
      Password: password,
      IsOtp: isShowOtpInput //TODO:handel it
    })

    if (passwordError || usernameError) {
      event.preventDefault();
      return;
    }

    // console.log({
    //   username: username,
    //   password: password,
    //   IsOtp: isShowOtpInput,
    //   //SendOtp:setIsSendOtp
    // });
  };

  const handleLoginType = (e, type = "password") => {
    e.preventDefault();
    setIsShowOtpInput(!isShowOtpInput)
  }

  const sendOtp = () => {
    setIsSendOtp(true)
  }

  {
    {
      if (!auth.token) {
        return (<AppTheme {...props}>
          <CssBaseline enableColorScheme />
          <SignInContainer direction="column" justifyContent="space-between">
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <Card variant="outlined">
              <img src="../../Assets/images/logo.png" alt="" />
              <Typography
                component="h1"
                align='center'
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                ورود
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: 2,
                }}
                onSubmit={handleSubmit}
              >
                <FormControl>
                  <FormLabel htmlFor="username">نام کاربری</FormLabel>
                  <TextField
                    onChange={(e) => setUsername(e.target.value)}
                    error={usernameError}
                    helperText={usernameErrorMessage}
                    id="username"
                    type="username"
                    name="username"
                    placeholder='نام کاربری یا ایمیل یا موبایل خود را وارد کنید'
                    autoComplete="username"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={usernameError ? 'error' : 'primary'}
                    control={<Button placeholder="dsfds" />}
                  />
                </FormControl>

                {
                  !isShowOtpInput && (
                    <FormControl>
                      <FormLabel htmlFor="password">رمزعبور</FormLabel>
                      <TextField
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        type="password"
                        placeholder='رمزعبور ثابت'
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                      />
                    </FormControl>
                  )
                }


                {
                  isShowOtpInput && (
                    <FormControl>
                      <FormLabel htmlFor="otp">کد یکبارمصرف</FormLabel>
                      <TextField
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ display: 'inline' }}
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="otp"
                        type="otp"
                        id="otp"
                        placeholder='رمزعبور یکبار مصرف'
                        autoComplete="current-otp"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}

                      />
                      {/* <Button  variant="text">ارسال کد</Button> */}
                      <Button
                        onClick={() => sendOtp()}
                        size='small'
                        className='otp-btn'
                        sx={{ marginTop: 2 }}>
                        ارسال کد
                      </Button>
                    </FormControl>

                  )
                }
                <ForgotPassword open={open} handleClose={handleClose} />

                <FormControlLabel name="isShow"
                  control={<Switch onChange={(e) => handleLoginType(e)} />} label="ورود با یکبار مصرف" />
                <Button
                  className='login-btn'
                  type="submit"
                  fullWidth
                //variant="contained"

                >
                  ورود
                </Button>

                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  فراموشی رمزعبور
                </Link>
              </Box>
            </Card>
          </SignInContainer>
        </AppTheme>)
      } else {
        return <Navigate to={APP_ROUTES.INVENTORY_LIST_PATH+'?equipment=ALL'} />
      }
    }
  }
}
