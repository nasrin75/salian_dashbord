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
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import { getRoles } from '../../api/RoleApi';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

const ipArrayToString = (arr) => {
  // console.log('arr',arr)
  if (!arr) return '';
  // if (arr != null) {
  return arr.join('.')
  // }
};

const ipStringToArray = (ipString) => {
  if (!ipString) return ['', '', '', ''];
  const parts = ipString.split('.');
  if (parts.length !== 4) return ['', '', '', ''];
  return parts.map(part => part.replace(/[^0-9]/g, '').slice(0, 3));
};
function EditForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;
  console.log('formValues', formValues)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isCheckIpBtn, setIsCheckIpBtn] = useState(formValues.isCheckIp);
  const [scope, setScope] = useState(formValues?.scope || 0);
  // const [scope, setScope] = useState(formValues?.scope || 0);
  const [singleIp, setSingleIp] = useState(() => ipStringToArray(formValues?.startIp));
  const [rangeIpFrom, setRangeIpFrom] = useState(ipStringToArray(formValues?.startIp));
  const [rangeIpTo, setRangeIpTo] = useState(ipStringToArray(formValues?.endIp));
  // const [rangeIpTo, setRangeIpTo] = useState(formValues?.scope == '1' ? ipStringToArray(formValues?.endIp) : ['', '', '', '']);

  useEffect(() => {

    getRoles()
      .then((data) => {
        setRoles(data.data['result'])
      })
      .catch(err => {
        //console.log(err)
      })

  }, [])


  const renderIpInputs = (type, ipState) => {
    const filed = type == 'to' ? 'endIp' : 'startIp';
    return (
      <Grid container spacing={1} alignItems="center" sx={{ mb: type === 'single' ? 2 : 0 }}>
        {[3, 2, 1, 0].map((index) => (

          <Fragment key={index}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                placeholder="0-255"
                value={ipState ? ipState[index] : ''}
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
  const handleScopeChange = async (event) => {
    const newScope = event.target.value;
    await setScope(newScope);

    //onFieldChange('scope', newScope);

    let currentStartIp = ipArrayToString(singleIp);
    let currentEndIp = ipArrayToString(rangeIpTo);

    if (newScope === 0) {


      await setSingleIp(ipStringToArray(rangeIpFrom));

    } else {

      if (scope === 0) {
        currentStartIp = ipArrayToString(singleIp);
      }

      await setRangeIpFrom(ipStringToArray(currentStartIp));
      await setRangeIpTo(ipStringToArray(currentEndIp));
    }

  };

  const handleIpChange = async (type, index, value) => {
    const validValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    // onFieldChange('scope', scope);

    let updatedIpArray;

    if (type === 'single') {
      updatedIpArray = [...singleIp];
      updatedIpArray[index] = validValue;
      await setSingleIp(updatedIpArray);
      return;
    }

    if (type === 'from') {
      updatedIpArray = [...rangeIpFrom];
      updatedIpArray[index] = validValue;
      await setRangeIpFrom(updatedIpArray);
      await setRangeIpTo(updatedIpArray);
      console.log('from', updatedIpArray, validValue);

      //  link 'from' with 'to' 
      const newIpTo = [...rangeIpTo];
      if (index === 0) newIpTo[0] = updatedIpArray[0];
      if (index === 1) newIpTo[1] = updatedIpArray[1];
      if (index === 2) newIpTo[2] = updatedIpArray[2];

      await setRangeIpTo(newIpTo);
      return;
    }

    if (type === 'to') {
      updatedIpArray = [...rangeIpTo];
      updatedIpArray[index] = validValue;
      await setRangeIpTo(updatedIpArray);
      await setRangeIpFrom(updatedIpArray);
      console.log('to', updatedIpArray, validValue);

      const newIpFrom = [...rangeIpFrom];
      if (index === 0) newIpFrom[0] = updatedIpArray[0];
      if (index === 1) newIpFrom[1] = updatedIpArray[1];
      if (index === 2) newIpFrom[2] = updatedIpArray[2];
      await setRangeIpFrom(newIpFrom);
      return;
    }
  };


  const handleLoginTypeChange = (value, checked) => {
    const current = formValues.loginTypes || [];
    const updated = checked ? [...current, value] : current.filter(x => x !== value);

    onFieldChange("LoginTypes", updated)
  }

  // console.log('rangeIpFrom', rangeIpFrom);
  // console.log('rangeIpTo', rangeIpTo);
  //console.log('singleIp', singleIp);
  console.log(scope);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        onFieldChange('scope', scope);
        if (scope === 0) {
          //formValues.startIp = ipArrayToString(singleIp);
          onFieldChange('endIp', '');
          onFieldChange('startIp', ipArrayToString(singleIp));
          formValues.startIp = ipArrayToString(singleIp);
          formValues.endIp = ipArrayToString('');
          console.log('sin   onsubmit', formValues)
        } else {
          onFieldChange('endIp', ipArrayToString(rangeIpTo));
          onFieldChange('startIp', ipArrayToString(rangeIpFrom));
          formValues.startIp = ipArrayToString(rangeIpFrom);
          formValues.endIp = ipArrayToString(rangeIpTo);
          console.log('ran   onsubmit', formValues)
        }

        formValues.scope = scope;
        await onSubmit(formValues);
        console.log('onsubmit', formValues)
      } finally {
        setIsSubmitting(false);
        console.log('finally', formValues)
      }
    },
    [formValues, onSubmit, rangeIpTo, rangeIpFrom, singleIp],
  );

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.username ?? ''}
              onChange={(e) => onFieldChange("username", e.target.value)}
              name="username"
              label="نام کاربری"
              error={!!formErrors.username}
              helperText={formErrors.username ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={''}
              onChange={(e) => onFieldChange("password", e.target.value)}
              name="password"
              label="رمزعبور"
              error={!!formErrors.password}
              helperText={formErrors.password ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.email ?? ''}
              onChange={(e) => onFieldChange("email", e.target.value)}
              name="email"
              label="ایمیل"
              error={!!formErrors.email}
              helperText={formErrors.email ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.mobile ?? ''}
              onChange={(e) => onFieldChange("mobile", e.target.value)}
              name="mobile"
              label="موبایل"
              error={!!formErrors.mobile}
              helperText={formErrors.mobile ?? ' '}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 1 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="isCheckIp"
                control={
                  <Checkbox
                    size="large"
                    checked={formValues.isCheckIp ?? false}
                    onChange={(e) => onFieldChange("isCheckIp", e.target.checked)}
                  />
                }
                label="IP چک شود ؟"
              />
              <FormHelperText error={!!formErrors.isCheckIp}>
                {formErrors.isCheckIp ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          {
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
                      control={<Radio checked={scope == 0 ?? false} />}
                      label="IP تکی:"
                    />

                    <FormControlLabel
                      value="1"
                      control={<Radio checked={scope == 1 ?? false} />}
                      label="محدوده IP:"
                    />
                  </RadioGroup>

                  <FormHelperText error={!!formErrors.scope}>
                    {formErrors.scope ?? ' '}
                  </FormHelperText>

                  {(scope == 1) ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="label" sx={{ mt: 1, mb: 1, display: "block", fontWeight: 500 }}>
                          از:
                        </Typography>
                        {renderIpInputs("from", rangeIpFrom)}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="label" sx={{ mt: 1, mb: 1, display: "block", fontWeight: 500 }}>
                          تا:
                        </Typography>
                        {renderIpInputs("to", rangeIpTo)}
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      {renderIpInputs("single", singleIp)}
                    </Grid>
                  )}

                </FormControl>
              </Grid>
            )
          }
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">وضعیت</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="status"
                onChange={(e) => onFieldChange("status", e.target.value, "radio")}
              >
                <FormControlLabel value="1" control={<Radio checked={(formValues.status == 'active' || formValues.status == '1') ?? false} />} label="فعال" />
                <FormControlLabel value="-1" control={<Radio checked={(formValues.status == 'deactive' || formValues.status == '-1') ?? false} />} label="غیرفعال" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.status}>
                {formErrors.status ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">نقش</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="roleId"
                onChange={(e) => onFieldChange("roleId", e.target.value, "radio")}
              >
                {
                  roles.map(role => {
                    return <FormControlLabel value={role.id} control={<Radio checked={formValues.roleId == role.id ?? false} />} label={role.faName} />
                  })
                }

              </RadioGroup>
              <FormHelperText error={!!formErrors.roleId}>
                {formErrors.roleId ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">ورود با :</FormLabel>
              <FormGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="loginTypes"
              >
                <FormControlLabel value="otp" control={<Checkbox
                  checked={formValues.loginTypes?.includes("otp") || false}
                  onChange={(e) => handleLoginTypeChange("otp", e.target.checked)
                  } />} label="OTP" />
                <FormControlLabel value="password" control={<Checkbox
                  checked={formValues.loginTypes?.includes("password") || false}
                  onChange={(e) => handleLoginTypeChange("password", e.target.checked)
                  } />} label="Password" />
                <FormControlLabel value="email" control={<Checkbox
                  checked={formValues.loginTypes?.includes("email") || false}
                  onChange={(e) => handleLoginTypeChange("email", e.target.checked)
                  } />} label="Email" />
                <FormControlLabel value="push" control={<Checkbox
                  checked={formValues.loginTypes?.includes("push") || false}
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

EditForm.propTypes = {
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      username: PropTypes.string,
      IsCheckIp: PropTypes.string,
      roleId: PropTypes.number,
      status: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      password: PropTypes.string,
      LoginTypes: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    values: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      password: PropTypes.string,
      roleId: PropTypes.number,
      status: PropTypes.number,
      IsCheckIp: PropTypes.bool,
      LoginTypes: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;
