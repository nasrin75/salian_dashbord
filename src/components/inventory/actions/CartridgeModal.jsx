import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateValidation } from "../../../validation/CartridgeValidation";
import { useNavigate } from "react-router-dom";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: 'simple-tab-' + index,
        'aria-controls': 'simple-tabpanel-' + index,
    };
}

export default function CartridgeModal({ open, onClose, selectedRows = [] }) {
    const navigate = useNavigate();
      const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];
    if (!selectedIds || selectedIds.length === 0) {

        toast.error("انتخاب حداقل یه قطعه الزامی است.")
        onClose()

    }
    const [tabValue, setTabValue] = useState(0); // 0 => send 1=>back
    const [formState, setFormState] = useState(() => ({
        values: {
            Ids: selectedIds,
            SendDate: null,
            ReturnDate: null,
            InLocal: null,
            Description: null,
            ActionType: 'SendToCharge'
        },
        errors: {},
    }));


    const formValues = formState.values;
    const formErrors = formState.errors;
  

    //console.log(formValues.ActionType, tabValue)
    const setFormValues = useCallback((newFormValues) => {
        setFormState((previousState) => ({
            ...previousState,
            values: newFormValues,
        }));
    }, []);

    const setFormErrors = useCallback((newFormErrors) => {
        setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
        }));
    }, []);


    const handleInputChange = useCallback(
        (name, value, type = "text") => {
            let finalValue = value;
            // if (type === 'radio') {
            //     finalValue = Number(value)
            // }
            const newFormValues = {
                ...formValues,
                [name]: finalValue,
            };
            console.log(name, value)

            setFormValues(newFormValues);

            const { issues } = CreateValidation(newFormValues);
            console.log('issue', issues)

            setFormErrors({
                ...formErrors,
                [name]: issues?.find(i => i.path?.[0] === name)?.message,
            });

        },
        [formValues, formErrors],
    );

    useEffect(() => {
        handleInputChange("Ids", selectedIds)
        setActionType();
    }, [])

    useEffect(() => {
        setActionType();
    }, [tabValue])
    console.log('formErro', formErrors)
    console.log('formValues', formValues)
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // const actionType = newValue == 0 ? 'SendToCharge' : 'BackFromCharge'
        // handleInputChange('ActionType', actionType);
    };

    const setActionType = async () => {
        const actionType = tabValue == 1 ? 'BackFromCharge' : 'SendToCharge'
        handleInputChange('ActionType', actionType);
    }
    // const handleSave = () => {
    //     console.log('final', formValues)
    //     // call api
    //     alert('داده‌ها ذخیره شد!');
    //     handleCloseAndReset();
    // };

    const handleSave = useCallback(async (payload) => {
        const { issues } = CreateValidation(payload);

        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});
        console.log('final', formValues)
        // call api
        alert('داده‌ها ذخیره شد!');
        handleCloseAndReset();
        // createInventory(JSON.stringify(payload))
        //     .then(() => {
        //         toast.success("عملیات با موفقیت انجام شد.")
        //         navigate(APP_ROUTES.INVENTORY_LIST_PATH + '?equipment=ALL');
        //     })
        //     .catch(() => {
        //         //toast.error("مشکلی در افزودن به انبار رخ داده است")
        //     })

    }, [navigate, setFormErrors]);

    const handleCloseAndReset = () => {
        onClose();
        setTabValue(0);
    };

    console.log('CartridgeModal selectedIds', selectedIds)
    return (
        <Dialog open={open} onClose={handleCloseAndReset} maxWidth="sm" fullWidth>
            <DialogTitle>شارژ کارتریج</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%' }}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs example">
                            <Tab label="ارسال"  {...a11yProps(0)} />
                            <Tab label="برگشت" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    {/* Send Tab */}
                    <TabPanel value={tabValue} index={0} xs>
                        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
                            <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">نوع خدمت *</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="InLocal"
                                        onChange={(e) => handleInputChange("InLocal", e.target.value, "radio")}
                                        error={!!formErrors.InLocal}
                                        helperText={formErrors.InLocal ?? " "}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="درمحل" />
                                        <FormControlLabel value="2" control={<Radio />} label="خارج از محل" />
                                    </RadioGroup>
                                    <FormHelperText error={!!formErrors.InLocal}>
                                        {formErrors.InLocal ?? ' '}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                                <TextField
                                    value={formValues.Shop ?? ''}
                                    onChange={(e) => handleInputChange("Shop", e.target.value)}
                                    name="Shop"
                                    label="نام تعمیرگاه"
                                    error={!!formErrors.Shop}
                                    helperText={formErrors.Shop ?? ' '}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                                <DatePicker
                                    label="تاریخ تحویل"
                                    error={!!formErrors.SendDate}
                                    helperText={formErrors.SendDate ?? " "}
                                    value={
                                        formValues.SendDate ? dayjs(formValues.SendDate) : null
                                    }
                                    onChange={(value) =>
                                        handleInputChange(
                                            "SendDate",
                                            value
                                                ? dayjs(value).calendar("gregory").format("YYYY-MM-DD")
                                                : null
                                        )
                                    }
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minRows: 5,
                                            height: '100px'
                                        }
                                    }}
                                    id="outlined-multiline-flexible-grid"
                                    label="توضیحات"
                                    multiline
                                    value={formValues.Description}
                                    onChange={(e) => handleInputChange('Description', e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    {/* Back Tab*/}
                    <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
                            <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">مشکلات *</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="Problem"
                                        onChange={(e) => handleInputChange("Problem", e.target.value)}
                                        error={!!formErrors.Problem}
                                        helperText={formErrors.Problem ?? " "}
                                    >
                                        <FormControlLabel value="drum" control={<Radio />} label="Drum" />
                                        <FormControlLabel value="blade" control={<Radio />} label="Blade" />
                                        <FormControlLabel value="magnet" control={<Radio />} label="Magnet" />
                                        <FormControlLabel value="other" control={<Radio />} label="سایرموارد" />
                                    </RadioGroup>
                                    <FormHelperText error={!!formErrors.Problem}>
                                        {formErrors.Problem ?? ' '}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                                <TextField
                                    value={formValues.Shop ?? ''}
                                    onChange={(e) => handleInputChange("Shop", e.target.value)}
                                    name="Shop"
                                    label="نام تعمیرگاه"
                                    error={!!formErrors.Shop}
                                    helperText={formErrors.Shop ?? ' '}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                                <DatePicker
                                    label="تاریخ برگشت"
                                    error={!!formErrors.ReturnDate}
                                    helperText={formErrors.ReturnDate ?? " "}
                                    value={
                                        formValues.ReturnDate ? dayjs(formValues.ReturnDate) : null
                                    }
                                    onChange={(value) =>
                                        handleInputChange(
                                            "ReturnDate",
                                            value
                                                ? dayjs(value).calendar("gregory").format("YYYY-MM-DD")
                                                : null
                                        )
                                    }
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minRows: 5,
                                            height: '100px'
                                        }
                                    }}
                                    id="outlined-multiline-flexible-grid"
                                    label="توضیحات"
                                    multiline
                                    value={formValues.Description}
                                    onChange={(e) => handleInputChange('Description', e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Box>
                {/* </Grid> */}
            </DialogContent>
            <DialogActions>

                <Button onClick={handleSave} color="primary" variant="contained">
                    ذخیره
                </Button>
                <Button onClick={handleCloseAndReset} color="warning" variant="contained">لغو</Button>

            </DialogActions>
        </Dialog >
    );
}
