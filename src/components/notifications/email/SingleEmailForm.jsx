import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Button, FormGroup } from "reactstrap";
import { getUsers } from "../../../api/UserApi";
import { toast } from "react-toastify";

const SingleEmailForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([])
    const [userIds, setUserIds] = useState([])
    const [message, setMessage] = useState('');
    const [data, setData] = useState({
        Subject: '',
        Body: ''
    });

    const handleFiledChanges = (name, value) => {
        setData({
            ...data,
            [name]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    // add user ids in array like :[1,2,3]
    const handleUserIds = (event) => {
        const {
            target: { value },
        } = event;

        setUserIds(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        handleFiledChanges("UserIds", value)
    };

    useEffect(() => {
        const request = {
            'userId': null
        }
        getUsers(request)
            .then(data => {
                setUsers(data.data.data)
            })
            .catch(() => {
                //toast.error("مشکلی در گرفتن لیست کاربران رخ داده است.")
            })
    }, [])
    return (<Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{ width: '100%' }}
    >
        <FormGroup>
            <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                    <FormControl sx={{ width: 710 }}>
                        <InputLabel id="demo-multiple-name-label">کاربر</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={userIds}
                            onChange={handleUserIds}
                            input={<OutlinedInput label="کاربر" />}
                            fullWidth
                        >
                            {users.map((user) => (
                                <MenuItem
                                    style={{ margin: '5px' }}
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.username} - ({user.email ? user.email : 'ایمیل ندارد'})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* empty */}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}></Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                    <TextField
                        onChange={(e) => handleFiledChanges('Subject', e.target.value)}
                        name="Subject"
                        label="عنوان"
                        // error={!!formErrors.Name}
                        // helperText={formErrors.Name ?? ' '}
                        fullWidth
                    />
                </Grid>

                {/* empty */}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}></Grid>

                <Grid Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                    <TextField
                        sx={{
                            '& .MuiInputBase-root': {
                                minRows: 50,
                                height: '200px'
                            }
                        }}
                        id="outlined-multiline-flexible-grid"
                        label="متن خود را وارد کنید"
                        multiline
                        value={data.Body}
                        onChange={(e) => handleFiledChanges('Body', e.target.value)}
                        variant="outlined"
                        placeholder="اینجا بنویسید..."
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
                ارسال
            </Button>
        </Stack>
    </Box>)
}

export default SingleEmailForm;