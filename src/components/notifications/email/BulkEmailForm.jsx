import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Button, FormGroup } from "reactstrap";

const BulkEmailForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        console.log(data)
    }

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
                            onChange={(e) => handleFiledChanges('Subject', e.target.value)}
                            name="Subject"
                            label="عنوان گروهی"
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
        </Box>
    )
}

export default BulkEmailForm;