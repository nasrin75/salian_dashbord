import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import { getEquipments, getParentEquipments } from '../../api/EquipmentApi';
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
  const [parentEquipments, setParentEquipments] = useState();
  useEffect(() => {
    getParentEquipments()
      .then((data) => setParentEquipments(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست قطعات رخ داده است")
      });
    
  }, []);
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

  console.log('parentEquipments', parentEquipments)
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <TextField
              select
              value={formValues.parentId ?? ''}
              onChange={(e) => onFieldChange("parentId", e.target.value)}
              name="parentId"
              label="Parentقطعه"
              error={!!formErrors.parentId}
              helperText={formErrors.parentId ?? ' '}
              fullWidth
            >
              <MenuItem value="0" disabled>انتخاب کنید</MenuItem>
              {parentEquipments?.map(parent => {
                return <MenuItem value={parent.id} selected={formValues.parentId === parent.id ?? false}>{parent.name}</MenuItem>
              })}
            </TextField>
            <FormHelperText error={!!formErrors.parentId}>
              {formErrors.parentId ?? " "}
            </FormHelperText>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.name ?? ''}
              onChange={(e) => onFieldChange("name", e.target.value)}
              name="name"
              label=" نام قطعه"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">نوع قطعه</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                value={
                  formValues.type === 'internal'
                    ? '1'
                    : formValues.type === 'external'
                      ? '2'
                      : formValues.type
                }
                onChange={(e) => onFieldChange("type", e.target.value, "radio")}
              >
                <FormControlLabel value="1" control={<Radio />} label="Internal" />
                <FormControlLabel value="2" control={<Radio />} label="External" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.type}>
                {formErrors.type ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormGroup>
                <FormControlLabel name="isShowInMenu" control={<Switch
                  checked={formValues.isShowInMenu ?? false}
                  onChange={(e) => onFieldChange("isShowInMenu", e.target.checked, 'switch')} />} label="نمایش در زیر منو انبار" />
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
      name: PropTypes.string,
      type: PropTypes.string,
      isShowInMenu: PropTypes.bool,
    }).isRequired,
    values: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      isShowInMenu: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;

