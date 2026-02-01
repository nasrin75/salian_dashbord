import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

function CreateForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    submitButtonLabel,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    Name: '',
    Type: '',
  });

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
              value={formValues.Name ?? ''}
              onChange={(e) => onFieldChange("Name", e.target.value)}
              name="Name"
              label="نام قطعه"
              error={!!formErrors.Name}
              helperText={formErrors.Name ?? ' '}
              fullWidth
            />
          </Grid>
          
          
          <Grid size={{ xs: 12, sm: 6 ,md:12}} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">نوع قطعه</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="Type"
                onChange={(e) => onFieldChange("Type", e.target.value, "radio")}
              >
                <FormControlLabel value="1" control={<Radio />} label="Internal" />
                <FormControlLabel value="2" control={<Radio />} label="External" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.Type}>
                {formErrors.Type ?? ' '}
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

CreateForm.propTypes = {
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      Name: PropTypes.string,
      Type: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      Name: PropTypes.string,
      Type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CreateForm;
