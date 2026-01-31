import { useState,useEffect,useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { getLocations } from '../../api/LocationApi';
import MenuItem from '@mui/material/MenuItem';

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
  const [locations, setLocations] = useState([]);

  console.log(formValues)
  useEffect(() => {

    getLocations()
      .then((data) => {
        setLocations(data.data['result'])
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
              value={formValues.name ?? ''}
              onChange={(e) => onFieldChange("name", e.target.value)}
              name="name"
              label="نام"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
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
              select
              value={formValues.locationId ?? ''}
              onChange={(e) => onFieldChange("LocationId", e.target.value)}
              name="LocationId"
              label="موقعیت"
              error={!!formErrors.LocationId}
              helperText={formErrors.LocationId ?? ' '}
              fullWidth
            >
              <MenuItem value="0" disabled>انتخاب کنید</MenuItem>
              {locations.map(location => {
                return <MenuItem value={location.id} selected={formValues.locationId === location.id ?? false}>{location.title}</MenuItem>
              })}
            </TextField>
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
      name: PropTypes.string,
      email: PropTypes.string,
      locationId: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      locationId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;
