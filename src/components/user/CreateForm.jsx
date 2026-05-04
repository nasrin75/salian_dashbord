import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { getRoles } from '../../api/RoleApi';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Fragment } from 'react';

const ipArrayToString = (arr) => arr.join('.');
const ipStringToArray = (str) => str.split('.').map(num => num === '' ? '' : parseInt(num, 10));

function UserForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    submitButtonLabel,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;
  const isEmailFieldEmpty = !formValues.Email;
  const isMobileFieldEmpty = !formValues.Mobile;
  const isOtpFieldRelevant = !isMobileFieldEmpty;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCheckIpBtn, setIsCheckIpBtn] = useState(false);
  const [scope, setScope] = useState();
  const [singleIp, setSingleIp] = useState(Array(4).fill(''));
  const [rangeIpFrom, setRangeIpFrom] = useState(Array(4).fill(''));
  const [rangeIpTo, setRangeIpTo] = useState(Array(4).fill(''));

  const handleIpChange = (type, index, value) => {
    const validValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (type === 'single') {
      const newIp = [...singleIp];
      newIp[index] = validValue;
      setSingleIp(newIp);
      // Construct the full IP string when a single IP part changes
      onFieldChange('SingleIp', ipArrayToString(newIp));
    } else if (type === 'from') {
      const newIp = [...rangeIpFrom];
      newIp[index] = validValue;
      setRangeIpFrom(newIp);
      // Construct the full IP string when a range 'from' part changes
      onFieldChange("RangeIp", `${ipArrayToString(newIp)},${ipArrayToString(rangeIpTo)}`);
    } else if (type === 'to') {
      const newTo = [...rangeIpTo];
      newTo[index] = validValue;
      setRangeIpTo(newTo);
      // Construct the full IP string when a range 'to' part changes
      onFieldChange("RangeIp", `${ipArrayToString(rangeIpFrom)},${ipArrayToString(newTo)}`);
    }
  };
  useEffect(() => {
    console.log("scope state changed:", scope);
    onFieldChange('Scope', scope)
  }, [scope]);

  useEffect(() => {
    if (scope !== '1') {
      setRangeIpTo(Array(4).fill(''));
      // setSingleIp(Array(4).fill('')); 
      return;
    }

    // sync first 3 blocks from → to
    setRangeIpTo(prevRangeIpTo => {
      const newTo = [...prevRangeIpTo];
      if (rangeIpFrom[0]) newTo[0] = rangeIpFrom[0];
      if (rangeIpFrom[1]) newTo[1] = rangeIpFrom[1];
      if (rangeIpFrom[2]) newTo[2] = rangeIpFrom[2];
      return newTo;
    });

  }, [rangeIpFrom, scope]);

  const renderIpInputs = (type, ipState, setIpState) => {
console.log('aa',type, ipState);
    return (
      <Grid container spacing={1} alignItems="center" sx={{ mb: type === 'single' ? 2 : 0 }}>
        {[3, 2, 1, 0].map((index) => (
          <Fragment key={index}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                placeholder="0-255"
                value={ipState[index]}
                onChange={(e) => {
                  handleIpChange(type, index, e.target.value)
                }}
                inputProps={{ maxLength: 3, sx: { textAlign: 'center' } }}
                fullWidth
                error={!!formErrors[`${type}-${index}`]}
                helperText={formErrors[`${type}-${index}`] ?? ' '}
              />
            </Grid>
            {index > 0 && (
              <Grid item xs={1} sx={{ textAlign: 'center' }}>
                <Typography variant="body1">.</Typography>
              </Grid>
            )}
          </Fragment>
        ))}
      </Grid>
    );
  };

  // Reset IPs when scope changes
  const handleScopeChange = (newScope) => {
    console.log("handleScopeChange newScope:", newScope);

    setScope(newScope);
    onFieldChange('Scope', newScope);

    if (newScope === '0') {
      setSingleIp(['', '', '', '']);
      setRangeIpFrom(['', '', '', '']);
      setRangeIpTo(['', '', '', '']);
      onFieldChange('RangeIp', '');
    } else if (newScope === '1') {
      setRangeIpFrom(['', '', '', '']);
      setSingleIp(['', '', '', '']);
      onFieldChange('SingleIp', '');
    }
    console.log("Final scope value after changes:", newScope);
  };



  // create ip as string to send backend
  const constructFinalIpString = () => {

    if (scope === '0') {
      onFieldChange('SingleIp', ipArrayToString(singleIp));
      onFieldChange('RangeIp', '');

    } else if (scope === '1') {
      onFieldChange('RangeIp', ipArrayToString(rangeIpFrom));
      onFieldChange('SingleIp', '');

    }
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {

    getRoles()
      .then((data) => {
        setRoles(data.data.data)
      })
      .catch(err => {
        //console.log(err)
      })
  }, [])


  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      constructFinalIpString();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleLoginTypeChange = (value, checked) => {
    const current = formValues.LoginTypes || []
    let updated;
    if (checked) {
      updated = [...current, value]
    } else {
      updated = current.filter(x => x !== value)
    }
    onFieldChange("LoginTypes", updated)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Username ?? ''}
              onChange={(e) => onFieldChange("Username", e.target.value)}
              name="Username"
              label="نام کاربری"
              error={!!formErrors.Username}
              helperText={formErrors.Username ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Password ?? ''}
              onChange={(e) => onFieldChange("Password", e.target.value)}
              name="Password"
              label="رمزعبور"
              error={!!formErrors.Password}
              helperText={formErrors.Password ?? ' '}
              fullWidth
            />

          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Email ?? ''}
              onChange={(e) => onFieldChange("Email", e.target.value)}
              name="Email"
              label="ایمیل"
              error={!!formErrors.Email}
              helperText={formErrors.Email ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Mobile ?? ''}
              onChange={(e) => onFieldChange("Mobile", e.target.value)}
              name="Mobile"
              label="موبایل"
              error={!!formErrors.Mobile}
              helperText={formErrors.Mobile ?? ' '}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}></Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">وضعیت</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="Status"
                onChange={(e) => onFieldChange("Status", e.target.value, "radio")}
                error={!!formErrors.Status}
                helperText={formErrors.Status ?? " "}
              >
                <FormControlLabel value="1" control={<Radio />} label="فعال" />
                <FormControlLabel value="-1" control={<Radio />} label="غیرفعال" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.Status}>
                {formErrors.Status ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>


          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">نقش</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="RoleId"
                error={!!formErrors.RoleId}
                helperText={formErrors.RoleId ?? " "}
                onChange={(e) => onFieldChange("RoleId", e.target.value, "radio")}
              >
                {
                  roles.map(role => {
                    return <FormControlLabel value={role.id} control={<Radio />} label={role.faName} />
                  })
                }

              </RadioGroup>
              <FormHelperText error={!!formErrors.RoleId}>
                {formErrors.RoleId ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">ورود با :</FormLabel>
              <FormGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="LoginTypes"
                error={!!formErrors.LoginTypes}
                helperText={formErrors.LoginTypes}
              >
                <FormControlLabel value="otp" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("otp") ?? false}
                  onChange={(e) => handleLoginTypeChange("otp", e.target.checked)}
                  disabled={isMobileFieldEmpty} // OTP disabled if Mobile is empty
                />} label="Sms OTP" />
                <FormControlLabel value="password" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("password")}
                  onChange={(e) => handleLoginTypeChange("password", e.target.checked)

                  } />} label="Password" checked />
                <FormControlLabel value="email" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("email")}
                  onChange={(e) => handleLoginTypeChange("email", e.target.checked)}
                  disabled={isEmailFieldEmpty}
                />} label="Email OTP" />
                <FormControlLabel value="push" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("push")}
                  onChange={(e) => handleLoginTypeChange("push", e.target.checked)
                  } />} label="Push" />
              </FormGroup>
              <FormHelperText error={!!formErrors.LoginTypes}>
                {formErrors.LoginTypes ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="IsCheckIp"
                control={
                  <Checkbox
                    sx={{
                      display: "inline"
                    }}
                    size="large"
                    checked={!!formValues.IsCheckIp}
                    onChange={(e) => {
                      onFieldChange("IsCheckIp", e.target.checked, "checkbox")
                      setIsCheckIpBtn(!isCheckIpBtn)
                    }}
                    name="IsCheckIp"
                  />
                }
                label="IP چک شود ؟"
              />
              <FormHelperText error={!!formErrors.IsCheckIp}>
                {formErrors.IsCheckIp ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          {
            isCheckIpBtn && (
              <Grid size={{ xs: 12, sm: 10 }} sx={{ display: 'flex' }}>
                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="Scope"
                    value={scope}
                    onChange={(event, newValue) => handleScopeChange(newValue)}
                    error={!!formErrors.Scope}
                    helperText={formErrors.Scope ?? " "}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="IP تکی:"
                    />

                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="محدوده IP:"
                    />
                  </RadioGroup>

                  <FormHelperText error={!!formErrors.Scope}>
                    {formErrors.Scope ?? ' '}
                  </FormHelperText>

                  {scope === '1' ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="label" sx={{ mt: 1, mb: 1, display: "block", fontWeight: 500 }}>
                          از:
                        </Typography>
                        {renderIpInputs("from", rangeIpFrom, setRangeIpFrom)}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="label" sx={{ mt: 1, mb: 1, display: "block", fontWeight: 500 }}>
                          تا:
                        </Typography>
                        {renderIpInputs("to", rangeIpTo, setRangeIpTo)}
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      {renderIpInputs("single", singleIp, setSingleIp)}
                    </Grid>
                  )}

                </FormControl>
              </Grid>
            )
          }


        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

UserForm.propTypes = {
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      Username: PropTypes.string,
      IsCheckIp: PropTypes.string,
      RoleId: PropTypes.string,
      Status: PropTypes.number,
      Email: PropTypes.string,
      Mobile: PropTypes.string,
      Password: PropTypes.string,
      LoginTypes: PropTypes.array,
      //SingleIp: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      Username: PropTypes.string,
      Email: PropTypes.string,
      Mobile: PropTypes.string,
      Password: PropTypes.string,
      RoleId: PropTypes.number,
      Status: PropTypes.number,
      IsCheckIp: PropTypes.bool,
      LoginTypes: PropTypes.array,
      SingleIp: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default UserForm;
