import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';

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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.faName ?? ''}
              onChange={(e) => onFieldChange("faName", e.target.value)}
              name="faName"
              label="عنوان فارسی"
              error={!!formErrors.faName}
              helperText={formErrors.faName ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.enName ?? ''}
              onChange={(e) => onFieldChange("enName", e.target.value)}
              name="enName"
              label="عنوان انگلیسی"
              error={!!formErrors.enName}
              helperText={formErrors.enName ?? ' '}
              fullWidth
            />
          </Grid>
         <Grid size={{ xs: 12, sm: 6 ,md:12}} sx={{ display: 'flex' }}>
            <FormControl>
              <FormGroup>
                <FormControlLabel name="isShow" control={<Switch 
                checked={formValues.isShow ?? false}
                 onChange={(e)=>onFieldChange("isShow",e.target.checked,'switch')} />} label="نمایش" />    
              </FormGroup>
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
      faName: PropTypes.string,
      enName: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      faName: PropTypes.string,
      enName: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;

