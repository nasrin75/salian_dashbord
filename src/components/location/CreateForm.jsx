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
import Switch from '@mui/material/Switch';

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
  // const [data, setData] = useState({
  //   Title: '',
  //   Abbreviation: '',
  //   isShow: false,
  // });

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
              value={formValues.Title ?? ''}
              onChange={(e) => onFieldChange("Title", e.target.value)}
              name="Title"
              label="عنوان بخش"
              error={!!formErrors.Title}
              helperText={formErrors.Title ?? ' '}
              fullWidth
            />
          </Grid>
          
           <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Abbreviation ?? ''}
              onChange={(e) => onFieldChange("Abbreviation", e.target.value)}
              name="Abbreviation"
              label="مخفف"
              error={!!formErrors.Abbreviation}
              helperText={formErrors.Abbreviation ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 ,md:12}} sx={{ display: 'flex' }}>
            <FormControl>
              <FormGroup
                name="IsShow"
                onChange={(e)=>onFieldChange("IsShow",e.target.value,'switch')}
              >
                <FormControlLabel control={<Switch />} label="نمایش" />    
              </FormGroup>
              <FormHelperText error={!!formErrors.isShow}>
                {formErrors.isShow ?? ' '}
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
