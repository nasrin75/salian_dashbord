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
import { useCallback, useEffect, useState } from 'react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {

    getRoles()
      .then((data) => {
        setRoles(data.data['result'])
      })
      .catch(err => console.log(err))

  }, [])
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const formatWhitListIp = (ips) =>{
    
     return ips.map(item =>{
        if(item.ipRange != null){
            return `${item.ip}:${item.ipRange}`;
        }
         return item.ip;
      }).join(',');
    }
 
     const handleLoginTypeChange = (value, checked) => {
    const current = formValues.loginTypes || [];
    const updated = checked ? [...current, value] : current.filter(x => x !== value);
    // if (checked) {
    //   updated = [...current, value]
    // } else {
    //   updated = current.filter(x => x !== value)
    // }
    onFieldChange("LoginTypes", updated)
  }

  // const handleLoginTypeChange = (value, checked) => {
  //   const current = formValues.loginTypes || [];
  //   let updated;
  //   if (checked) {
  //     updated = [...current, value]
  //   } else {
  //     updated = current.filter(x => x !== value)
  //   }
  //   onFieldChange("LoginTypes", updated)
  // }

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
              value={formValues.password ?? ''}
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formatWhitListIp(formValues.ipWhiteLists)}
              onChange={(e) => onFieldChange("ipWhiteLists", e.target.value)}
              name="ipWhiteLists"
              label="IP WhiteList"
              error={!!formErrors.ipWhiteLists}
              helperText={formErrors.ipWhiteLists ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">وضعیت</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="status"
                onChange={(e) => onFieldChange("status", e.target.value, "radio")}
              >
                <FormControlLabel value="1" control={<Radio checked={formValues.status == '1' ?? false} />} label="فعال" />
                <FormControlLabel value="0" control={<Radio checked={formValues.status == '0' ?? false} />} label="غیرفعال" />
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
      role: PropTypes.string,
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
      role: PropTypes.number,
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
