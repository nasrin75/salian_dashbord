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
  const isIpCheckActive = formValues.IsCheckIp === true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  ///
  const [isCheckIpBtn, setIsCheckIpBtn] = useState(false);
  const [scope, setScope] = useState("0");
  const [singleIp, setSingleIp] = useState(Array(4).fill(''));
  const [rangeIpFrom, setRangeIpFrom] = useState(Array(4).fill(''));
  const [rangeIpTo, setRangeIpTo] = useState(Array(4).fill(''));

  const handleIpChange = (type, index, value) => {
    const validValue = value.replace(/[^0-9]/g, '').slice(0, 3); // can enter just 3 number

    console.log('handleIpChange', type, index, value)

    if (type === 'single') {
      const newIp = [...singleIp];
      newIp[index] = validValue;
      setSingleIp(newIp);
    } else if (type === 'from') {
      const newIp = [...rangeIpFrom];
      newIp[index] = validValue;
      setRangeIpFrom(newIp);
      //console.log('handleIpChange_from Updated rangeIpFrom:', newIp);

    } else if (type === 'to') {
      const newIpTo = [...rangeIpTo]; // Create a new array for to
      newIpTo[index] = validValue;
      setRangeIpTo(newIpTo);
      //console.log('handleIpChange_to Updated rangeIpTo:', newIpTo);

      // ---- Add this part to link 'from' with 'to' ----
      const newIpFrom = [...rangeIpFrom]; // Create a new array for from
      if (index === 3) newIpFrom[3] = newIpTo[3];
      if (index === 1) newIpFrom[1] = newIpTo[1];
      if (index === 2) newIpFrom[2] = newIpTo[2];

      setRangeIpFrom(newIpFrom);
      //console.log('handleIpChange_to Updated rangeIpFrom (linked to to):', newIpFrom);
    }
  };

  useEffect(() => {
    if (scope === '1') {
      setRangeIpTo(prevIpTo => {
        const newIpTo = [...prevIpTo];

        newIpTo[3] = rangeIpFrom[3];
        newIpTo[2] = rangeIpFrom[2];
        newIpTo[1] = rangeIpFrom[1];

        return newIpTo;
      });
      //console.log('useEffect: RTL - Copied and reversed first three parts from rangeIpFrom to rangeIpTo');
    } else {
      setRangeIpTo(Array(4).fill(''));
      //console.log('useEffect: Scope changed to single IP or reset, cleared rangeIpTo');
    }
  }, [rangeIpFrom, scope]);

  const renderIpInputs = (type, ipState, setIpState) => {
    const ipArray = type === 'single' ? singleIp : rangeIpFrom;
    const setState = type === 'single' ? setSingleIp : (type === 'from' ? setRangeIpFrom : setRangeIpTo);
    console.log('renderIpInputs called with type:', type, 'and current ipState:', ipState);

    return (
      <Grid container spacing={1} alignItems="center" sx={{ mb: type === 'single' ? 2 : 0 }}>
        {[0, 1, 2, 3].map((index) => (
          <Fragment key={index}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                placeholder="0-255"
                value={ipState[index]}
                onChange={(e) => handleIpChange(type, index, e.target.value)}
                inputProps={{ maxLength: 3, sx: { textAlign: 'center' } }}
                fullWidth
                error={!!formErrors[`${type}-${index}`]}
                helperText={formErrors[`${type}-${index}`] ?? ' '}
              />
            </Grid>
            {index < 3 && (
              <Grid item xs={1} sx={{ textAlign: 'center' }}>
                <Typography variant="body1">.</Typography>
              </Grid>
            )}
          </Fragment>
        ))}
      </Grid>
    );
  };

  const handleScopeChange = (event) => {
    const newScope = event.target.value;

    setScope(newScope);
    setSingleIp(Array(3).fill(''));
    setRangeIpFrom(Array(3).fill(''));
    setRangeIpTo(Array(3).fill(''));

  };

  // create ip as string to send backend
  const constructFinalIpString = () => {
    if (scope === '0') {
      const ipStr = ipArrayToString(singleIp);
      console.log("aaaaaaaaaaaa", ipStr)
      return { startIp: ipStr, endIp: ipStr };
    } else {
      const startIpStr = ipArrayToString(rangeIpFrom);
      const endIpStr = ipArrayToString(rangeIpTo);
      return { startIp: startIpStr, endIp: endIpStr };
    }
  };
  const [roles, setRoles] = useState([]);

  useEffect(() => {

    getRoles()
      .then((data) => {
        setRoles(data.data['result'])
      })
      .catch(err => {
        //console.log(err)
      })
  }, [])

  console.log("Ip result:", constructFinalIpString());

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const ipData = constructFinalIpString();
      console.log("Sending to backend:", ipData);

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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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


          <Grid size={{ xs: 12, sm: 1 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>

              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="Scope"
                value={scope}
                onChange={handleScopeChange}
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

              {scope === '0' ? (
                <Grid item xs={12}>
                  {renderIpInputs("single", singleIp, setSingleIp)}
                </Grid>
              ) : (
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
              )}

            </FormControl>
          </Grid>


          {/* {
            isCheckIpBtn && (
              <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="Scope"
                    value={scope}
                    onChange={handleScopeChange}
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

                  {scope === '0' ? (
                    <Grid item xs={12}>
                      {renderIpInputs("single", singleIp, setSingleIp)}
                    </Grid>
                  ) : (
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
                  )}

                </FormControl>
              </Grid>
            )
          } */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}></Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">وضعیت</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="Status"
                onChange={(e) => onFieldChange("Status", e.target.value, "radio")}
              >
                <FormControlLabel value="1" control={<Radio />} label="فعال" />
                <FormControlLabel value="0" control={<Radio />} label="غیرفعال" />
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
                onChange={(e) => onFieldChange("RoleId", e.target.value, "radio")}
              >
                {
                  roles.map(role => {
                    return <FormControlLabel value={role.id} control={<Radio />} label={role.faName} />
                  })
                }

              </RadioGroup>
              <FormHelperText error={!!formErrors.role}>
                {formErrors.role ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">ورود با :</FormLabel>
              <FormGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="LoginTypes"

              >
                <FormControlLabel value="otp" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("otp") ?? false}
                  onChange={(e) => handleLoginTypeChange("otp", e.target.checked)}
                  disabled={isMobileFieldEmpty} // OTP disabled if Mobile is empty
                />} label="OTP" />
                <FormControlLabel value="password" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("password")}
                  onChange={(e) => handleLoginTypeChange("password", e.target.checked)

                  } />} label="Password" checked />
                <FormControlLabel value="email" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("email")}
                  onChange={(e) => handleLoginTypeChange("email", e.target.checked)}
                  disabled={isEmailFieldEmpty}
                />} label="Email" />
                <FormControlLabel value="push" control={<Checkbox
                  checked={formValues.LoginTypes?.includes("push")}
                  onChange={(e) => handleLoginTypeChange("push", e.target.checked)
                  } />} label="Push" />
              </FormGroup>
              <FormHelperText error={!!formErrors.loginType}>
                {formErrors.loginType ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>

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
      username: PropTypes.string,
      IsCheckIp: PropTypes.string,
      role: PropTypes.string,
      status: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      password: PropTypes.string,
      LoginTypes: PropTypes.string
    }).isRequired,
    values: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      password: PropTypes.string,
      role: PropTypes.number,
      status: PropTypes.number,
      IsCheckIp: PropTypes.bool,
      LoginTypes: PropTypes.string
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default UserForm;
