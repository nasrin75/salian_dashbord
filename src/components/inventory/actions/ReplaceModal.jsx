import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateValidation } from "../../../validation/ReplaceValidation";
import { getEmployees } from "../../../api/EmployeeApi";

export default function ReplaceModal({ open, onClose, selectedRows = [] }) {
    const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];
    if (!selectedIds || selectedIds.length === 0) {
        toast.error("انتخاب حداقل یه قطعه الزامی است.")
        onClose()
    }

    const [formState, setFormState] = useState(() => ({
        values: {
            Ids: selectedIds,
            ActionType: 'Replace',
            ReceiveDate: null,
            NewStatus: null,
            Description: null,
        },
        errors: {},
    }));

    const formValues = formState.values;
    const formErrors = formState.errors;
    const [employees, setEmployees] = useState({});

    useEffect(() => {
        getEmployees()
            .then((data) => setEmployees(data.data.data))
            .catch(() => { });
    }, []);

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
            if (type === 'radio') {
                finalValue = Number(value)
            }
            const newFormValues = {
                ...formValues,
                [name]: finalValue,
            };
            console.log(name, value)

            setFormValues(newFormValues);

            const { issues } = CreateValidation(newFormValues);

            setFormErrors({
                ...formErrors,
                [name]: issues?.find(i => i.path?.[0] === name)?.message,
            });

        },
        [formValues, formErrors],
    );

    const handleSave = () => {
        console.log('final', formValues)
        // call api
        alert('داده‌ها ذخیره شد!');
        handleCloseAndReset();
    };

    const handleCloseAndReset = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseAndReset} maxWidth="sm" fullWidth>
            <DialogTitle>جابجایی</DialogTitle>
            <DialogContent>
                <Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    </Box>
                    {/* Send Tab */}
                    <Grid container spacing={2} sx={{ mb: 2, mt: 4, width: "100%" }}>
                        <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex" }}>
                            <Autocomplete
                                id="employee-select-demo"
                                disableClearable
                                sx={{ width: 400 }}
                                options={employees}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) =>
                                    handleInputChange("EmployeeId", value?.id ?? null)
                                }
                                renderInput={(params) => <TextField {...params} label=" مالک جدید *" />}
                            />
                            <FormHelperText error={!!formErrors.EmployeeId}>
                                {formErrors.EmployeeId ?? " "}
                            </FormHelperText>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                            <DatePicker
                                label="تاریخ تحویل"
                                error={!!formErrors.ReceiveDate}
                                helperText={formErrors.ReceiveDate ?? " "}
                                value={
                                    formValues.ReceiveDate ? dayjs(formValues.ReceiveDate) : null
                                }
                                onChange={(value) =>
                                    handleInputChange(
                                        "ReceiveDate",
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
                        <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label"> وضعیت جدید *</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="NewStatus"
                                    onChange={(e) => handleInputChange("NewStatus", e.target.value, "radio")}
                                    error={!!formErrors.NewStatus}
                                    helperText={formErrors.NewStatus ?? " "}
                                >
                                    <FormControlLabel
                                        value="-2"
                                        control={<Radio />}
                                        label="استفاده نشده"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="استفاده شده"
                                    />
                                    <FormControlLabel
                                        value="-1"
                                        control={<Radio />}
                                        label="اسقاطی"
                                    />
                                </RadioGroup>
                                <FormHelperText error={!!formErrors.NewStatus}>
                                    {formErrors.NewStatus ?? ' '}
                                </FormHelperText>
                            </FormControl>
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
                </Box>
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
