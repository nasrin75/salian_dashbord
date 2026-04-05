import { useState, useCallback } from 'react';
import PropTypes, { object } from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function SettingsForm(props) {
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

  const activeSmsProvider = Object.values(formValues)
    .find(item => item.key === 'active_sms_provider');

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
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="active-sms-label">پنل پیامکی فعال</InputLabel>

            <Select
              labelId="active-sms-label"
              id="active-sms-provider"
              fullWidth
              value={activeSmsProvider?.value ?? ''}
              onChange={(e) => onFieldChange('active_sms_provider', e.target.value)}
            >
              <MenuItem key="kavenegar" value="kavenegar">
                کاوه نگار
              </MenuItem>

              <MenuItem key="sabanovin" value="sabanovin" disabled>
                صبانوین
              </MenuItem>
            </Select>
          </FormControl>


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

// SettingsForm.propTypes = {
//   formState: PropTypes.shape({
//     errors: PropTypes.shape({
//       username: PropTypes.string,
//       newPassword: PropTypes.string,
//       email: PropTypes.string,
//       mobile: PropTypes.string,
//     }).isRequired,
//     values: PropTypes.shape({
//       username: PropTypes.string,
//       newPassword: PropTypes.string,
//       email: PropTypes.string,
//       mobile: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
//   onFieldChange: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   submitButtonLabel: PropTypes.string.isRequired,
// };


export default SettingsForm;

