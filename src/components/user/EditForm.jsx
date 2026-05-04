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
import { PERMISSION } from '../../utlis/constants/Permissions';

const ipArrayToString = (arr) => {
  if (!arr) return '';
  return arr.join('.')
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
    hasPermission
  } = props;


  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isCheckIpBtn, setIsCheckIpBtn] = useState(formValues.isCheckIp);
  const [scope, setScope] = useState(formValues?.scope.toString() || '0');
  const [singleIp, setSingleIp] = useState(ipStringToArray(formValues?.startIp));
  const [rangeIpFrom, setRangeIpFrom] = useState(ipStringToArray(formValues?.startIp));
  const [rangeIpTo, setRangeIpTo] = useState(ipStringToArray(formValues?.endIp));

  console.log('singleIp',singleIp)
  console.log('startIp',formValues?.startIp)
  console.log('endIp',formValues?.endIp)
  console.log('rangeIpFrom',rangeIpFrom)
  console.log('rangeIpTo',rangeIpTo)

  useEffect(() => {

    getRoles()
      .then((data) => {
        setRoles(data.data.data)
      })
      .catch(err => {
        //console.log(err)
      })

  }, [])

  useEffect(() => {
    if (scope !== 1) {
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

  const handleScopeChange = (e) => {
  const newScope = e.target.value;

  setScope(newScope);
  onFieldChange('scope', newScope);

  if (newScope === '0') {
    setSingleIp(['', '', '', '']);
    setRangeIpFrom(['', '', '', '']);
    setRangeIpTo(['', '', '', '']);
    onFieldChange('endIp', '');
  } else if (newScope === '1') {
    setRangeIpFrom(['', '', '', '']);
    setSingleIp(['', '', '', '']);
    onFieldChange('startIp', '');
  }
};

  // create ip as string to send backend
  const constructFinalIpString = () => {

    if (scope === '0') {
      onFieldChange('startIp', ipArrayToString(singleIp));
      onFieldChange('endIp', '');

    } else if (scope === '1') {
      onFieldChange('endIp', ipArrayToString(rangeIpFrom));
      onFieldChange('startIp', '');

    }
  };
  const handleIpChange = (type, index, value) => {
    const validValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (type === 'single') {
      const newIp = [...singleIp];
      newIp[index] = validValue;
      setSingleIp(newIp);
      // Construct the full IP string when a single IP part changes
      onFieldChange('startIp', ipArrayToString(newIp));
    } else if (type === 'from') {
      const newIp = [...rangeIpFrom];
      newIp[index] = validValue;
      setRangeIpFrom(newIp);
      // Construct the full IP string when a range 'from' part changes
      onFieldChange("endIp", `${ipArrayToString(newIp)},${ipArrayToString(rangeIpTo)}`);
    } else if (type === 'to') {
      const newTo = [...rangeIpTo];
      newTo[index] = validValue;
      setRangeIpTo(newTo);
      // Construct the full IP string when a range 'to' part changes
      onFieldChange("endIp", `${ipArrayToString(rangeIpFrom)},${ipArrayToString(newTo)}`);
    }
  };

  useEffect(() => {
    console.log("scope state changed:", scope);
    onFieldChange('scope', scope)
  }, [scope]);

  const handleLoginTypeChange = (value, isChecked) => {
    const current = formValues.loginTypes || [];
    let updated;

    if (isChecked) {
      updated = [...current, value];
    } else {
      updated = current.filter(x => x !== value);
    }

    onFieldChange("loginTypes", updated);
  }

  const handleCheckIp = (e) => {
    const isChecked = e.target.checked;
    onFieldChange("isCheckIp", isChecked);
    setIsCheckIpBtn(isChecked);
    if (!isChecked) {
      onFieldChange("scope", '0');
      setScope('0');
      onFieldChange("rangeIpFrom", '');
      setRangeIpFrom('');
      onFieldChange("rangeIpTo", '');
      setRangeIpTo('');
      onFieldChange("startIp", '');
      setSingleIp('');

    } else {
      if (scope === undefined || scope === null) {
        onFieldChange("scope", 0);
        setScope(0);
      }
    }
  }
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      constructFinalIpString();
      setIsSubmitting(true);
      try {
        onFieldChange('scope', scope);
        if (scope === '0') {
          onFieldChange('endIp', '');
          onFieldChange('startIp', ipArrayToString(singleIp));
          formValues.startIp = ipArrayToString(singleIp);
          formValues.endIp = '';
        } else {
          onFieldChange('endIp', ipArrayToString(rangeIpTo));
          onFieldChange('startIp', ipArrayToString(rangeIpFrom));
          formValues.startIp = ipArrayToString(rangeIpFrom);
          formValues.endIp = ipArrayToString(rangeIpTo);
        }

        formValues.scope = scope;
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit, rangeIpTo, rangeIpFrom, singleIp],
  );

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  console.log('scope_val',scope,typeof(scope))
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
              disabled={!hasPermission([PERMISSION.USER_VIEW_USERNAME])}
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
              disabled={!hasPermission([PERMISSION.USER_VIEW_PASSWORD])}
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
              disabled={!hasPermission([PERMISSION.USER_VIEW_Mobile])}
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
                    onChange={handleCheckIp}
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
            formValues.isCheckIp && (
              <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="scope"
                    value={scope.toString()}
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

                  <FormHelperText error={!!formErrors.scope}>
                    {formErrors.scope ?? ' '}
                  </FormHelperText>

                  {(scope === '1') ? (
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
                    return <FormControlLabel disabled={!hasPermission([PERMISSION.USER_View_ROLE])} value={role.id} control={<Radio checked={formValues.roleId == role.id ?? false} />} label={role.faName} />
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
