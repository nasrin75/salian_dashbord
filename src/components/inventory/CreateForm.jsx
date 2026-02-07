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
import { getEquipmentFeatures, getEquipments } from "../../api/EquipmentApi";
import { toast } from "react-toastify";
import { getLocations } from "../../api/LocationApi";
import { getEmployees } from "../../api/EmployeeApi";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";

function CreateForm(props) {
  const { formState, onFieldChange, onSubmit, submitButtonLabel } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});

  useEffect(() => {
    //Equipment List
    getEquipments()
      .then((data) => setEquipments(data.data["result"]))
      .catch(() => toast("مشکلی در گرفتن لیست قطعات رخ داده است"));

    //Location List
    getLocations()
      .then((data) => setLocations(data.data["result"]))
      .catch(() => toast("مشکلی در گرفتن لیست بخش ها رخ داده است"));

    //Location List
    getEmployees()
      .then((data) => setEmployees(data.data["result"]))
      .catch(() => toast("مشکلی در گرفتن لیست پرسنل ها رخ داده است"));
  }, []);

  //get features by equipment to enter featureValues
  const getFeaturesData = async (equipmentID) => {
    await getEquipmentFeatures(equipmentID)
      .then((data) => {
        const list = data.data["result"];
        setFeatures(list);
      })
      .catch(() => {
        toast.error("خطا در دریافت ویژگی‌ها");
      });
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const payload = {
          ...formValues,
          Features: Object.keys(featureValues).map((id) => ({
            FeatureId: Number(id),
            Value: featureValues[id],
          })),
        };

        console.log("payload", payload);
        await onSubmit(payload);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, featureValues, onSubmit]
  );

  //Uploaded file func
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/upload", {
        method: "POST",
        body: formData,
      });
      console.log(process.env.REACT_APP_API_BASE_URL + "/upload");
      const data = await res.json();

      //send image name that is created after uploaded file
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
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              options={equipments}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => {
                if (!value) return;

                onFieldChange("EquipmentId", value.id);
                getFeaturesData(value.id);
              }}
              renderInput={(params) => <TextField {...params} label="قطعه" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="employee-select-demo"
              sx={{ width: 400 }}
              options={employees}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(event, value) =>
                onFieldChange("EmployeeId", value?.id ?? null)
              }
              renderInput={(params) => <TextField {...params} label="مالک" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="location-select-demo"
              sx={{ width: 400 }}
              options={locations}
              autoHighlight
              disableClearable
              onChange={(event, value) =>
                onFieldChange("LocationId", value?.id ?? null)
              }
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
              value={formValues.ItNumber ?? null}
              onChange={(e) => onFieldChange("ItNumber", e.target.value, 'number')}
              name="ItNumber"
              label="شماره IT"
              error={!!formErrors.ItNumber}
              helperText={formErrors.ItNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.ItParentNumber ?? null}
              onChange={(e) => onFieldChange("ItParentNumber", e.target.value, 'number')}
              name="ItParentNumber"
              label="شماره IT Parent"
              error={!!formErrors.ItParentNumber}
              helperText={formErrors.ItParentNumber ?? " "}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.BrandName ?? null}
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
              value={formValues.ModelName ?? null}
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
              value={formValues.Size ?? null}
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
              value={formValues.Capacity ?? null}
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
              value={formValues.InvoiceNumber ?? null}
              onChange={(e) => onFieldChange("InvoiceNumber", e.target.value)}
              name="InvoiceNumber"
              label="شماره فاکتور"
              error={!!formErrors.InvoiceNumber}
              helperText={formErrors.InvoiceNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              label="توضیحات"
              multiline
              onChange={(e) => onFieldChange("Description",e.target.value)}
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
          </Grid>
          {/* upload Image */}
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
                src={
                  process.env.REACT_APP_BASE_URL +
                  `/images/inventory/${formValues.InvoiceImage}`
                }
                alt="Invoice"
                width={100}
                style={{ marginTop: 8 }}
              />
            )}
          </Grid>
          {/* status part */}
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
          {/* end status part */}
        </Grid>

        {/* show equipment features */}
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
          {features.map((feature) => (
            <Grid key={feature.id} size={{ xs: 12, sm: 3 }}>
              <TextField
                sx={{ width: 400 }}
                label={feature.name}
                value={featureValues[feature.id] || ""}
                onChange={(e) =>

                  setFeatureValues((prev) => ({
                    ...prev,
                    [feature.id]: e.target.value,
                  }))

                }
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
      <Stack
        direction="row"
        spacing={2}
        marginTop={5}
        justifyContent="space-between"
      >
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
