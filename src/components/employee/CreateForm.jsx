import * as React from 'react';
import { useState, useCallback } from 'react';
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
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { getRoles } from '../../api/RoleApi';
import { getLocations } from '../../api/LocationApi';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

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
        Email: '',
        LocationId: '',
    });

    const [locations, setLocations] = useState([]);

    React.useEffect(() => {

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
                            label="نام"
                            error={!!formErrors.Name}
                            helperText={formErrors.Name ?? ' '}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.Email ?? ''}
                            onChange={(e) => onFieldChange("Email", e.target.value)}
                            name="Email"
                            label="ایمیل"
                            error={!!formErrors.Email}
                            helperText={formErrors.Email ?? ' '}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            select
                            value={formValues.LocationId ?? ''}
                            onChange={(e) => onFieldChange("LocationId", e.target.value)}
                            name="LocationId"
                            label="موقعیت"
                            error={!!formErrors.LocationId}
                            helperText={formErrors.LocationId ?? ' '}
                            fullWidth
                        >
                            <MenuItem value="0" disabled>انتخاب کنید</MenuItem>
                            {locations.map(location => {
                                return <MenuItem value={location.id}>{location.title}</MenuItem>
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

CreateForm.propTypes = {
    formState: PropTypes.shape({
        errors: PropTypes.shape({
            Name: PropTypes.string,
            Email: PropTypes.string,
            LocationId: PropTypes.number,
        }).isRequired,
        values: PropTypes.shape({
            Name: PropTypes.string,
            Email: PropTypes.string,
            LocationId: PropTypes.number,
        }).isRequired,
    }).isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
};

export default CreateForm;
