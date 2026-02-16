import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';
import { getPermissions } from '../../api/PermissionApi';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const PermissionModal = (props) => {

    const {
        open, close,allPermissions
    } = props
    //const [permissions, setPermissions] = useState([]);
console.log("allPermissions ==",props.allPermissions);
    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {/* <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    دسترسی ها
                </Typography>

            </Box> */}
            <Box
                component="form"
                //onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                //onReset={handleReset}
                sx={style}
            >
                <FormGroup>
                    <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>

                        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">دسترسی ها</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="permissionIds"
                                //onChange={(e) => onFieldChange("roleId", e.target.value, "radio")}
                                >
                                    <FormControlLabel control={<Radio />} label="" />
                                    {
                                        allPermissions.map(permission => {
                                            //return <FormControlLabel value={permission.id} control={<Radio />} label={permission.Name} />
                                             return <FormControlLabel value={permission.id} control={<Radio />} label={permission.title} />
                                        })
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
                    //loading={isSubmitting}
                    >
                        ذخیره
                        {/* {submitButtonLabel} */}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}


export default PermissionModal;