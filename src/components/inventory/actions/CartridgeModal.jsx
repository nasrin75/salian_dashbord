import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";

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

export default function CartridgeModal ({open, onClose, selectedRows = [] }) {

    const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];
    if (!selectedIds || selectedIds.length === 0) {

        toast.error("انتخاب حداقل یه قطعه الزامی است.")
        onClose()

    }
    const [value, setValue] = useState(0); // 0 => send 1=>back
    const [formData, setFormData] = useState({
        // --- send tab form---
        sendItemName: "",
        sendQuantity: "",
        sendDescription: "",
        // --- back tab form---
        returnItemName: "",
        returnQuantity: "",
        returnReason: "",
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSave = () => {
        console.log("داده‌های ارسال:", {
            itemName: formData.sendItemName,
            quantity: formData.sendQuantity,
            description: formData.sendDescription,
        });
        console.log("داده‌های برگشت:", {
            itemName: formData.returnItemName,
            quantity: formData.returnQuantity,
            reason: formData.returnReason,
        });
        // call api
        alert('داده‌ها ذخیره شد!');
        handleCloseAndReset();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
  const handleCloseAndReset = () => {

    onClose(); 
    setValue(0); 
  };
    console.log('CartridgeModal selectedIds', selectedIds)
    return (
        <Dialog open={open} onClose={handleCloseAndReset} maxWidth="sm" fullWidth>
            <DialogTitle>مدیریت کارتریج</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="tabs example">
                            <Tab label="ارسال"  {...a11yProps(0)} />
                            <Tab label="برگشت" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    {/* تب ارسال */}
                    <TabPanel value={value} index={0}>
                        <Typography variant="h6" gutterBottom>اطلاعات ارسال</Typography>
                        <TextField
                            margin="dense"
                            label="نام قطعه"
                            name="sendItemName"
                            value={formData.sendItemName}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            label="تعداد"
                            name="sendQuantity"
                            type="number"
                            value={formData.sendQuantity}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            label="توضیحات"
                            name="sendDescription"
                            value={formData.sendDescription}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                    </TabPanel>
                    {/* تب برگشت */}
                    <TabPanel value={value} index={1}>
                        <Typography variant="h6" gutterBottom>اطلاعات برگشت</Typography>
                        <TextField
                            margin="dense"
                            label="نام قطعه"
                            name="returnItemName"
                            value={formData.returnItemName}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            label="تعداد"
                            name="returnQuantity"
                            type="number"
                            value={formData.returnQuantity}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            margin="dense"
                            label="علت برگشت"
                            name="returnReason"
                            value={formData.returnReason}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                    </TabPanel>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAndReset}>لغو</Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    ذخیره
                </Button>
            </DialogActions>
        </Dialog>
    );
}
