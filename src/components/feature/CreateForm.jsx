import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { getEquipments } from '../../api/EquipmentApi';
import { toast } from 'react-toastify';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';


function CreateForm(props) {
   const theme = useTheme();
  const {
    formState,
    onFieldChange,
    onSubmit,
    submitButtonLabel,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipments,setEquipments] = useState([])
  const [equipmentIds,setEquipmentIds] = useState([])

  useEffect(()=>{
    getEquipments()
    .then(data =>{
      setEquipments(data.data['result'])
    })
    .catch( err => toast.error("مشکلی در گرفتن لیست قطعات رخ داده است."))
  },[])

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
  )

  const handleEquipmentIds = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value)

    setEquipmentIds(
      // On autofill we get a stringified value.
       typeof value === 'string' ? value.split(',') : value,
    );
    onFieldChange("EquipmentIds", equipmentIds)
  };
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
          <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.Name ?? ''}
              onChange={(e) => onFieldChange("Name", e.target.value)}
              name="Name"
              label="عنوان"
              error={!!formErrors.Name}
              helperText={formErrors.Name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-name-label">قطعات</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={equipmentIds}
                onChange={handleEquipmentIds}
                input={<OutlinedInput label="قطعات" />}
                fullWidth
              >
                {equipments.map((eq) => (
                  <MenuItem
                    style={{margin:'5px'}}
                    key={eq.id}
                    value={eq.id}
                  >
                    {eq.name}
                  </MenuItem>
                ))}
              </Select>
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
      EquipmentIds: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      Name: PropTypes.string,
      EquipmentIds: PropTypes.array,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CreateForm;
