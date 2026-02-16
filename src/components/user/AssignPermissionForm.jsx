import { useState, useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import { getPermissions } from '../../api/PermissionApi';
import { toast } from 'react-toastify';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

function AssignPermissionForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    getPermissions()
      .then(data => {
        let result = data.data['result'];
        //grouping permissions by category
        const categories = result.reduce((cats, { id, category, title }) => {
          if (!cats[category]) cats[category] = [];
          cats[category].push({ id, title });
          return cats;
        }, {});

        setPermissions(categories)
        //get just permission ids
        const Ids = formValues.map(per => per.id);
        setSelectedPermissions(Ids)
      })
      .catch(() => toast.error("مشکلی در گرفتن لیست دسترسی ها رخ داده است"))
  }, [])

  console.log('before', selectedPermissions)
  // 
  const handlePermissionSelection = (id, checked) => {

    setSelectedPermissions(prev => {
      //because don't update selectedPermissions use this way
      const newPermissions = checked  ? [...prev, Number(id)] : prev.filter(x => x !== id)
      onFieldChange("permissionIds", newPermissions)
      console.log('after', newPermissions)
      return newPermissions;
    })
  }

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

          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="permissionIds"
              >

                {

                  Object.entries(permissions).map(([category, items]) => (
                    <div key={category} className="category-section" style={{ paddingBottom: '1%' }}>
                      <Typography variant='h5' align='center'>{category}</Typography>
                      <ul>
                        {items.map(permission => (
                          <li style={{ listStyleType: "none" }}>
                            <FormControlLabel
                              key={permission.id}
                              value={permission.id}
                              control={<Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={(e) => handlePermissionSelection(permission.id, e.target.checked)} />} label={permission.title} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                }

              </RadioGroup>
              {/* <FormHelperText error={!!formErrors.role}>
                                    {formErrors.role ?? ' '}
                                </FormHelperText> */}
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
          ذخیره
        </Button>
      </Stack>
    </Box>
  );
}

// AssignPermissionForm.propTypes = {
//   formState: PropTypes.shape({
//     errors: PropTypes.shape({
//       name: PropTypes.string,
//       type: PropTypes.string,
//       isShowInMenu:PropTypes.bool,
//     }).isRequired,
//     values: PropTypes.shape({
//       name: PropTypes.string,
//       type: PropTypes.string,
//       isShowInMenu:PropTypes.bool,
//     }).isRequired,
//   }).isRequired,
//   onFieldChange: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   submitButtonLabel: PropTypes.string.isRequired,
// };


export default AssignPermissionForm;

