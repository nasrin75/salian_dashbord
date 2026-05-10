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
import { getBrands } from "../../api/BrandApi";
import { getExternalEquipmentInventories } from "../../api/InventoryApi";
import { GridKeyboardArrowRight } from "@mui/x-data-grid";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import { getImagesUrlByInvoiceNumber } from "../../api/InvoiceImageApi";
import SearchIcon from '@mui/icons-material/Search';

function CreateForm(props) {
  const { formState, onFieldChange, onSubmit, submitButtonLabel } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [isShowItPatentInput, setIsShowItPatentInput] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [itParentList, setItParentList] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});

  useEffect(() => {
    //Equipment List
    getEquipments()
      .then((data) => setEquipments(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست قطعات رخ داده است")
      });

    //Brand List
    getBrands()
      .then((data) => setBrands(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست قطعات رخ داده است")
      });

    getEmployees()
      .then((data) => setEmployees(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست پرسنل ها رخ داده است")
      });
  }, []);

  const handleSearch = async () => {
    await getImagesUrlByInvoiceNumber(formValues.InvoiceNumber)
      .then((data) => setImagesUrl(data.data.data))
      .catch((err) => {
        console.log('err', err)
      });
  }

  useEffect(() => {
    if (selectedImageId) {
      onFieldChange('InvoiceImageId',selectedImageId)
      //handleSearch(selectedImageId);
    }
  }, [selectedImageId]);

  const handleImageSelect = async (id) => {
    setSelectedImageId(id);
  };

  //get features by equipment to enter featureValues
  const getFeaturesData = async (equipmentID) => {
    await getEquipmentFeatures(equipmentID)
      .then((data) => {
        const list = data.data.data;
        setFeatures(list);
      })
      .catch(() => {
        //toast.error("خطا در دریافت ویژگی‌ها");
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


        await onSubmit(payload);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, featureValues, onSubmit]
  );

  const handleEquipmentChanges = async (e, value) => {
    if (!value) return;

    const EquipmentId = value.id;

    onFieldChange("EquipmentId", EquipmentId)
    setIsShowItPatentInput(false);
    if (value.type == 1) { // 1 = intenral , 2= external

      setIsShowItPatentInput(true);
      await getExternalEquipmentInventories(EquipmentId)
        .then((data) => {
          const list = data.data.data;
          setItParentList(list);
        })
        .catch(() => {
          //toast.error("خطا در دریافت ویژگی‌ها");
        });
    }

    getFeaturesData(EquipmentId);
  }
  //Uploaded file func
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!formValues.InvoiceNumber) {
      toast.error(" برای اپلود تصویر شماره فاکتور الزامی است");
      return
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      formData.append("invoiceNumber", `${formValues.InvoiceNumber}`);

      const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await res.json();

      onFieldChange("InvoiceImageUrl", data.url);
      setFilePath(data.url);
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
          {/* User */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="employee-select-demo"
              disableClearable
              sx={{ width: 400 }}
              options={employees}
              autoHighlight
              getOptionLabel={(option) => option.name}
              onChange={(event, value) =>
                onFieldChange("EmployeeId", value?.id ?? null)
              }
              renderInput={(params) => <TextField {...params} label="مالک" />}
            />
            <FormHelperText error={!!formErrors.EmployeeId}>
              {formErrors.EmployeeId ?? " "}
            </FormHelperText>
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              options={equipments}
              error={!!formErrors.EquipmentId}
              helperText={formErrors.EquipmentId ?? " "}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => handleEquipmentChanges(e, value)}
              renderInput={(params) => <TextField {...params} label="قطعه" />}
            />
            <FormHelperText error={!!formErrors.EquipmentId}>
              {formErrors.EquipmentId ?? " "}
            </FormHelperText>
          </Grid>
          {/* It parent */}
          {
            isShowItPatentInput && (
              <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}
              >
                <Autocomplete
                  id="equipment-select-demo"
                  autoHighlight
                  disableClearable
                  sx={{ width: 400 }}
                  options={itParentList}
                  error={!!formErrors.ItParentNumber}
                  helperText={formErrors.ItParentNumber ?? " "}
                  getOptionLabel={(option) => option.name}
                  onChange={async (e, value) => onFieldChange("ItParentNumber", value?.id ?? null)}
                  renderInput={(params) => <TextField {...params} label="شماره IT Parent" />}
                />
                <FormHelperText error={!!formErrors.ItParentNumber}>
                  {formErrors.ItParentNumber ?? " "}
                </FormHelperText>
              </Grid>
            )
          }
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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


          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              options={brands}
              error={!!formErrors.BrandId}
              helperText={formErrors.BrandId ?? " "}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => {
                if (!value) return;

                onFieldChange("BrandId", value.id);
              }}
              renderInput={(params) => <TextField {...params} label="برند" />}
            />
            <FormHelperText error={!!formErrors.BrandId}>
              {formErrors.BrandId ?? " "}
            </FormHelperText>
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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



          {/* start DeliveryDate */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <DatePicker
              label="تاریخ تحویل"
              error={!!formErrors.DeliveryDate}
              helperText={formErrors.DeliveryDate ?? " "}
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
            <FormHelperText error={!!formErrors.DeliveryDate}>
              {formErrors.DeliveryDate ?? " "}
            </FormHelperText>
          </Grid>

          {/* start ExpireWarrantyDate */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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

          {/* start InvoiceNumber */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="جستجو..."
              value={formValues.InvoiceNumber ?? null}
              onChange={(e) => onFieldChange("InvoiceNumber", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* upload Image */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>

            <Button
              sx={{ marginTop: '7px' }}
              disabled={!formValues.InvoiceNumber}
              size='small'
              //component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              آپلود تصویر فاکتور
              <input hidden type="file" onChange={handleFileUpload} />
            </Button>

            {formValues.InvoiceImageUrl && (
              <img
                src={
                  process.env.REACT_APP_API_BASE_URL +
                  `/files/${filePath}`
                }
                alt="Invoice"
                width={100}
                style={{ marginTop: 3 }}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                تصاویر فاکتورهای مرتبط
              </FormLabel>
              <RadioGroup
                value={selectedImageId}
                onChange={(e) => handleImageSelect(Number(e.target.value))}
              >
                {imagesUrl?.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id}
                    control={<Radio />}
                    label={
                      <img
                        src={
                          process.env.REACT_APP_API_BASE_URL +
                          `/files/${item.image}`
                        }
                        width={120}
                        style={{ borderRadius: 10 }}
                      />
                    }
                  />
                ))}
              </RadioGroup>
              <FormHelperText error={!!formErrors.status}>
                {formErrors.status ?? " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* start Description */}
          <Grid size={{ xs: 12, sm: 5 }} sx={{ display: "flex" }}>
            <TextField
              sx={{
                '& .MuiInputBase-root': {
                  minRows: 50,
                  height: '200px'
                }
              }}
              id="outlined-multiline-flexible-grid"
              label="توضیحات"
              multiline
              //value={data.Body}
              onChange={(e) => onFieldChange('Description', e.target.value)}
              variant="outlined"
              placeholder="اینجا بنویسید..."
              fullWidth
            />
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
              <FormHelperText error={!!formErrors.Status}>
                {formErrors.Status ?? " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* end status part */}
          {/* show equipment features */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              مشخصات:
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }} spacing={3}>

            {features.map((feature) => (
              <Grid key={feature.id} size={{ xs: 12, sm: 3 }} paddingRight="5px">
                <TextField
                  //sx={{ width: 400 }}
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
