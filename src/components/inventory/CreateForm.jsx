import { useState, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { getEquipments } from "../../api/EquipmentApi";
import { toast } from "react-toastify";
import { getLocations } from "../../api/LocationApi";
import { getEmployees } from "../../api/EmployeeApi";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";

function CreateForm(props) {
  const { formState, onFieldChange, onSubmit, submitButtonLabel } = props;
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  // Source - https://stackoverflow.com/a/76234557
  // Posted by OZZIE
  // Retrieved 2026-02-03, License - CC BY-SA 4.0

  // const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    //Equipment List
    getEquipments()
      .then((data) => setEquipments(data.data["result"]))
      .catch((err) => console.log(err));
    // .catch(() => toast("مشکلی در گرفتن لیست قطعات رخ داده است"));

    //Location List
    getLocations()
      .then((data) => setLocations(data.data["result"]))
      .catch(() => toast("مشکلی در گرفتن لیست بخش ها رخ داده است"));

    //Location List
    getEmployees()
      .then((data) => setEmployees(data.data["result"]))
      .catch(() => toast("مشکلی در گرفتن لیست پرسنل ها رخ داده است"));
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
    [formValues, onSubmit]
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("apiAddress:: " + process.env.REACT_APP_API_BASE_URL + "/upload");
      const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/upload", {
        method: "POST",
        body: formData,
      });
      console.log(process.env.REACT_APP_API_BASE_URL + "/upload");
      const data = await res.json();

      // مقدار فایل آپلود شده رو تو formValues ذخیره می‌کنیم
      onFieldChange("InvoiceImage", data.fileName);

      toast.success("فایل با موفقیت آپلود شد!");
    } catch (err) {
      console.error(err);
      toast.error("آپلود فایل با خطا مواجه شد.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{ width: "100%" }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              sx={{ width: 400 }}
              options={equipments}
              autoHighlight
              disableClearable
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="قطعه"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="employee-select-demo"
              sx={{ width: 400 }}
              options={employees}
              autoHighlight
              disableClearable
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="مالک"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="location-select-demo"
              sx={{ width: 400 }}
              options={locations}
              autoHighlight
              disableClearable
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="بخش"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.PropertyNumber ?? ""}
              onChange={(e) => onFieldChange("PropertyNumber", e.target.value)}
              name="PropertyNumber"
              label="شماره اموال"
              error={!!formErrors.PropertyNumber}
              helperText={formErrors.PropertyNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.SerialNumber ?? ""}
              onChange={(e) => onFieldChange("SerialNumber", e.target.value)}
              name="SerialNumber"
              label="شماره سریال"
              error={!!formErrors.SerialNumber}
              helperText={formErrors.SerialNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.ItNumber ?? ""}
              onChange={(e) => onFieldChange("ItNumber", e.target.value)}
              name="ItNumber"
              label="شماره IT"
              error={!!formErrors.ItNumber}
              helperText={formErrors.ItNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.ItParentId ?? ""}
              onChange={(e) => onFieldChange("ItParentId", e.target.value)}
              name="ItParentId"
              label="شماره IT Parent"
              error={!!formErrors.ItParentId}
              helperText={formErrors.ItParentId ?? " "}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.BrandName ?? ""}
              onChange={(e) => onFieldChange("BrandName", e.target.value)}
              name="BrandName"
              label="برند"
              error={!!formErrors.BrandName}
              helperText={formErrors.BrandName ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.ModelName ?? ""}
              onChange={(e) => onFieldChange("ModelName", e.target.value)}
              name="ModelName"
              label="مدل"
              error={!!formErrors.ModelName}
              helperText={formErrors.ModelName ?? " "}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.Size ?? ""}
              onChange={(e) => onFieldChange("Size", e.target.value)}
              name="Size"
              label="سایز"
              error={!!formErrors.Size}
              helperText={formErrors.Size ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.Capacity ?? ""}
              onChange={(e) => onFieldChange("Capacity", e.target.value)}
              name="Capacity"
              label="Capacity"
              error={!!formErrors.Capacity}
              helperText={formErrors.Capacity ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.InvoiceNumber ?? ""}
              onChange={(e) => onFieldChange("InvoiceNumber", e.target.value)}
              name="InvoiceNumber"
              label="شماره فاکتور"
              error={!!formErrors.InvoiceNumber}
              helperText={formErrors.InvoiceNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            {/* <InputLabel id="demo-multiple-name-label">توضیحات</InputLabel>
            <TextareaAutosize
            label="توضیحات"
              aria-label="minimum height"
              minRows={5}
              placeholder="Minimum 3 rows"
              style={{ width: 400 }}
            /> */}

            <TextField
              label="توضیحات"
              multiline
              rows={2}
              maxRows={Infinity}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <DatePicker
              label="تاریخ تحویل"
              value={
                formValues.DeliveryDate ? dayjs(formValues.DeliveryDate) : null
              }
              onChange={(value) =>
                onFieldChange(
                  "DeliveryDate",
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
            {/* <FormControl>
              <FormControlLabel
                name="DeliveryDate"

                fullWidth
                control={
                  <DatePicker
                    label="تاریخ تحویل"
                    // name='DeliveryDate'
                    //value={value}
                    inputFormat="E MMM dd yyyy HH:MM:SS O"
                    onChange={(e) => console.log('cd',e,e["$D"],e["M"],e["Y"])}
                    //  onChange={(e) => onFieldChange("DeliveryDate", e.target.value)}
                    // value={value}
                    // onChange={setValue}
                    slotProps={{
                      TextField: {
                        size: "small",
                        fullWidth: true
                      }
                    }}

                  />
                }
              />
              
              <FormHelperText error={!!formErrors.DeliveryDate}>
                {formErrors.DeliveryDate ?? ' '}
              </FormHelperText>
            </FormControl> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <DatePicker
              label="تاریخ پایان گارانتی"
              value={
                formValues.ExpireWarrantyDate
                  ? dayjs(formValues.ExpireWarrantyDate)
                  : null
              }
              onChange={(value) =>
                onFieldChange(
                  "ExpireWarrantyDate",
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
            {/* <DatePicker
              label="تاریخ اتمام گارانتی"
              // name='ExpireWarrantyDate'
              //value={value}
              //onChange={(newValue) =>setValue(newValue)}
              onChange={(e) => console.log("cg", e["$D"])}
              //onChange={(e) => onFieldChange("ExpireWarrantyDate", e.target.value)}
              slotProps={{
                TextField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
              fullWidth
            /> */}
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              آپلود تصویر فاکتور
              <input hidden type="file" onChange={handleFileUpload} />
            </Button>
            {formValues.InvoiceImage && (
              <img
                src={process.env.REACT_APP_BASE_URL + `/images/inventory/${formValues.InvoiceImage}`}
                alt="Invoice"
                width={100}
                style={{ marginTop: 8 }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                وضعیت
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="Status"
                onChange={(e) =>
                  onFieldChange("Status", e.target.value, "radio")
                }
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio />}
                  label="اسقاطی"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="استفاده نشده"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="استفاده شده"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="ارسال جهت شارژ"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="بازگشت از شارژ"
                />
                <FormControlLabel value="4" control={<Radio />} label="تعمیر" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.Status}>
                {formErrors.Status ?? " "}
              </FormHelperText>
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
      LocationId: PropTypes.number,
      EmployeeId: PropTypes.number,
      EquipmentId: PropTypes.number,
    }).isRequired,
    values: PropTypes.shape({
      LocationId: PropTypes.number,
      EmployeeId: PropTypes.number,
      EquipmentId: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CreateForm;
