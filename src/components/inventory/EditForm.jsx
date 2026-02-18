import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { getLocations } from '../../api/LocationApi';
import Autocomplete from '@mui/material/Autocomplete';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import { getEquipmentFeatures, getEquipments } from '../../api/EquipmentApi';
import { getEmployees } from '../../api/EmployeeApi';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams } from 'react-router-dom';

function EditForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
  } = props;

  const equipmentID = useParams();
  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);
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
  //send data
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

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              value={equipments.find(eq=>eq.id === formValues.equipmentId) || null}
              options={equipments}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => {
                if (!value) return value;

                onFieldChange("equipmentId", value?.id ?? null);
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
               value={employees.find(em=>em.id === formValues.employeeId) || null}
              autoHighlight
              disableClearable
              getOptionLabel={(option) => option.name}
              onChange={(event, value) =>
                onFieldChange("employeeId", value?.id ?? null)
              }
              renderInput={(params) => <TextField {...params} label="مالک" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="location-select-demo"
              sx={{ width: 400 }}
              options={locations}
              value={locations.find(l=>l.id === formValues.locationId) || null}
              autoHighlight
              disableClearable
              onChange={(event, value) =>
                onFieldChange("locationId", value?.id ?? null)
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
              value={formValues.propertyNumber ?? ""}
              onChange={(e) => onFieldChange("propertyNumber", e.target.value)}
              name="propertyNumber"
              label="شماره اموال"
              error={!!formErrors.propertyNumber}
              helperText={formErrors.propertyNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.serialNumber ?? ""}
              onChange={(e) => onFieldChange("serialNumber", e.target.value)}
              name="serialNumber"
              label="شماره سریال"
              error={!!formErrors.serialNumber}
              helperText={formErrors.serialNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.itNumber ?? null}
              onChange={(e) => onFieldChange("itNumber", e.target.value, 'number')}
              name="itNumber"
              label="شماره IT"
              error={!!formErrors.itNumber}
              helperText={formErrors.itNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.itParentNumber ?? null}
              onChange={(e) => onFieldChange("itParentNumber", e.target.value, 'number')}
              name="itParentNumber"
              label="شماره IT Parent"
              error={!!formErrors.itParentNumber}
              helperText={formErrors.itParentNumber ?? " "}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.brandName ?? null}
              onChange={(e) => onFieldChange("brandName", e.target.value)}
              name="brandName"
              label="برند"
              error={!!formErrors.brandName}
              helperText={formErrors.brandName ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.modelName ?? null}
              onChange={(e) => onFieldChange("modelName", e.target.value)}
              name="modelName"
              label="مدل"
              error={!!formErrors.modelName}
              helperText={formErrors.modelName ?? " "}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.size ?? null}
              onChange={(e) => onFieldChange("size", e.target.value)}
              name="size"
              label="سایز"
              error={!!formErrors.size}
              helperText={formErrors.size ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.capacity ?? null}
              onChange={(e) => onFieldChange("capacity", e.target.value)}
              name="capacity"
              label="capacity"
              error={!!formErrors.capacity}
              helperText={formErrors.capacity ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.invoiceNumber ?? null}
              onChange={(e) => onFieldChange("invoiceNumber", e.target.value)}
              name="invoiceNumber"
              label="شماره فاکتور"
              error={!!formErrors.invoiceNumber}
              helperText={formErrors.invoiceNumber ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <TextField
              label="توضیحات"
              multiline
              value={formValues.description ?? null}
              onChange={(e) => onFieldChange("description", e.target.value)}
              rows={2}
              maxRows={Infinity}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
            <DatePicker
              label="تاریخ تحویل"
              value={
                formValues.deliveryDate ? dayjs(formValues.deliveryDate) : null
              }
              onChange={(value) =>
                onFieldChange(
                  "deliveryDate",
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
                formValues.expireWarrantyDate
                  ? dayjs(formValues.expireWarrantyDate)
                  : null
              }
              onChange={(value) =>
                onFieldChange(
                  "expireWarrantyDate",
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
            {formValues.invoiceImage && (
              <img
                src={
                  process.env.REACT_APP_BASE_URL +
                  `/images/inventory/${formValues.invoiceImage}`
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
                name="status"
                onChange={(e) =>
                  onFieldChange("status", e.target.value, "radio")
                }
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio checked={(formValues.status == "useless" || formValues.status == "-1") ?? false} />}
                  label="اسقاطی"
                />
                <FormControlLabel
                  value="-2"
                  control={<Radio checked={(formValues.status == "unuse" || formValues.status =="-2") ?? false}  />}
                  label="استفاده نشده"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio checked={(formValues.status == "inuse" || formValues.status =="1")  ?? false}  />}
                  label="استفاده شده"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio checked={(formValues.status == "sendToCharge" || formValues.status =="2") ?? false}  />}
                  label="ارسال جهت شارژ"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio checked={(formValues.status == "backFromCharge" || formValues.status =="3")  ?? false}  />}
                  label="بازگشت از شارژ"
                />
                <FormControlLabel value="4" control={<Radio checked={(formValues.status == "repair" || formValues.status =="4") ?? false}  />} label="تعمیر" />
              </RadioGroup>
              <FormHelperText error={!!formErrors.status}>
                {formErrors.status ?? " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* end status part */}

          {/* show equipment features */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }} spacing={3}>
            {features.map((feature) => (
              <Grid key={feature.id} size={{ xs: 12, sm: 12 }} paddingRight="5px">
                <TextField
                  //sx={{ width: 400 }}
                  label={feature.name}
                  //value={featureValues[feature.id] || ""}
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

EditForm.propTypes = {
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      locationId: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      locationId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};


export default EditForm;
