import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

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
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.mobile ?? ''}
              onChange={(e) => onFieldChange("mobile", e.target.value)}
              name="mobile"
              label="شماره موبایل"
              error={!!formErrors.mobile}
              helperText={formErrors.mobile ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.password ?? ''}
              name="password"
              label="رمزعبور"
              helperText=""
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
            <TextField
              onChange={(e) => onFieldChange("newPassword", e.target.value)}
              name="newPassword"
              label="رمزعبور جدید"
              error={!!formErrors.newPassword}
              helperText={formErrors.newPassword ?? ' '}
              fullWidth
            />
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
      newPassword: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      username: PropTypes.string,
      newPassword: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;

