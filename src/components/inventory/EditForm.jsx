import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
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

import { getExternalEquipmentInventories } from '../../api/InventoryApi';
import { getBrands } from '../../api/BrandApi';
import { Typography } from '@mui/material';

function EditForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
  } = props;


  const formValues = formState.values;
  const formErrors = formState.errors;
  const [isShowItPatentInput, setIsShowItPatentInput] = useState(formValues.itParentNumber ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [itParentList, setItParentList] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});
  const [allPossibleFeatures, setAllPossibleFeatures] = useState([]);

  useEffect(() => {
    //Equipment List
    getEquipments()
      .then((data) => setEquipments(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست قطعات رخ داده است")
      });

    getBrands()
      .then((data) => setBrands(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست قطعات رخ داده است")
      });

    //Location List
    getEmployees()
      .then((data) => setEmployees(data.data.data))
      .catch(() => {
        //toast("مشکلی در گرفتن لیست پرسنل ها رخ داده است")
      });

    getExternalEquipmentInventories(formValues.equipmentId)
      .then((data) => {
        const list = data.data.data;
        setItParentList(list);
      })
      .catch(() => {
        //toast.error("خطا در دریافت ویژگی‌ها");
      });
    getInventoryFeatures();
    //setFeatureValues(formValues.features)
  }, []);

  useEffect(() => {
    if (formValues?.features && formValues.features.length > 0) {
      setFeatureValues(formValues.features);
    } else {

      const initialArray = allPossibleFeatures.map(feature => ({
        featureId: feature.id,
        name: feature.name,
        value: '',
      }));
      setFeatureValues(initialArray);
    }
  }, [formValues, allPossibleFeatures]);
const handleFeatureChange = useCallback((featureIdToUpdate, newValue) => {
        setFeatureValues(prevValues => {
            const updatedValues = prevValues.map(item => {
                if (item.featureId === featureIdToUpdate) {
                    return { ...item, value: newValue };
                }
                return item; 
            });
            onFieldChange('features',updatedValues)
            return updatedValues;
        });
        
    }, []);

  useEffect(() => {

    getEquipmentFeatures(formValues.equipmentId)
      .then((data) => {
        setAllPossibleFeatures(data.data.data);
      })
      .catch(() => {
        console.error("Failed to fetch all possible features.");
        setAllPossibleFeatures([]);
      });

    const initialValues = {};
    if (formValues?.features && formValues.features.length > 0) {
      formValues.features.forEach(feature => {
        initialValues[feature.featureId] = feature.value;
        //initialValues[feature.Name] = feature.name; 
      });
    }
    //setFeatureValues(initialValues);
    //p.1
    setFeatureValues(formValues?.features);
    console.log(formValues)
  }, [formValues?.features]);

  const handleEquipmentChanges = async (e, value) => {
    if (!value) return;

    const EquipmentId = value.id;
    onFieldChange("equipmentId", value?.id ?? null)
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

    getInventoryFeatures();
  }

  const getInventoryFeatures = async () => {
    console.log('formValues.equipmentId',formValues.equipmentId)
    await getEquipmentFeatures(formValues.equipmentId)
      .then((data) => {
        const list = data.data.data;
        setFeatures(list);
        //console.log('setFeatures', list)
      })
      .catch(() => {
        //toast.error("خطا در دریافت ویژگی‌ها");
      });
  }

  //Uploaded file func
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

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
        await onSubmit();
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, featureValues, onSubmit, features]
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="employee-select-demo"
              sx={{ width: 400 }}
              options={employees}
              value={employees.find(em => em.id === formValues.employeeId) || null}
              autoHighlight
              disableClearable
              getOptionLabel={(option) => option.name}
              onChange={(event, value) =>
                onFieldChange("employeeId", value?.id ?? null)
              }
              renderInput={(params) => <TextField {...params} label="مالک" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              value={equipments.find(eq => eq.id === formValues.equipmentId) || null}
              options={equipments}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => handleEquipmentChanges(e, value)}
              renderInput={(params) => <TextField {...params} label="قطعه" />}
              
            />
          </Grid>
          {
            isShowItPatentInput && (
              <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}
              >
                <Autocomplete
                  id="equipment-select-demo"
                  autoHighlight
                  disableClearable
                  sx={{ width: 400 }}
                  value={itParentList.find(eq => eq.id == formValues.itParentNumber) || null}
                  options={itParentList}
                  error={!!formErrors.itParentNumber}
                  helperText={formErrors.itParentNumber ?? " "}
                  getOptionLabel={(option) => option.name}
                  onChange={async (e, value) => onFieldChange("itParentNumber", value?.id ?? null)}
                  renderInput={(params) => <TextField {...params} label="شماره IT Parent" />}
                />
                <FormHelperText error={!!formErrors.itParentNumber}>
                  {formErrors.itParentNumber ?? " "}
                </FormHelperText>
              </Grid>
            )
          }
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Autocomplete
              id="equipment-select-demo"
              autoHighlight
              disableClearable
              sx={{ width: 400 }}
              value={brands.find(eq => eq.id === formValues.brandId) || null}
              options={brands}
              error={!!formErrors.brandId}
              helperText={formErrors.brandId ?? " "}
              getOptionLabel={(option) => option.name}
              onChange={async (e, value) => {
                if (!value) return;

                onFieldChange("brandId", value.id);
              }}
              renderInput={(params) => <TextField {...params} label="برند" />}
            />
            <FormHelperText error={!!formErrors.brandId}>
              {formErrors.brandId ?? " "}
            </FormHelperText>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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



          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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

          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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

          {/* upload Image */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
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
                  `/Uploads/${formValues.invoiceImage}`
                }
                alt="Invoice"
                width={100}
                style={{ marginTop: 8 }}
              />
            )}
          </Grid>

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
              value={formValues.description}
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
                  control={<Radio checked={(formValues.status == "unuse" || formValues.status == "-2") ?? false} />}
                  label="استفاده نشده"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio checked={(formValues.status == "inuse" || formValues.status == "1") ?? false} />}
                  label="استفاده شده"
                />
              </RadioGroup>
              <FormHelperText error={!!formErrors.status}>
                {formErrors.status ?? " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* end status part */}

          {/* show equipment features */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              مشخصات:
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }} spacing={3}>
            {allPossibleFeatures?.map((feature) => {
                const currentValue = featureValues.find(f => f.featureId === feature.id)?.value || '';

                return (
                    <Grid key={feature.id} size={{ xs: 12, sm: 12 }} paddingRight="5px">
                        <TextField
                            label={feature.name}
                            value={currentValue} 
                            onChange={(e) =>
                                handleFeatureChange(feature.id, e.target.value)
                            }
                            fullWidth
                        />
                    </Grid>
                );
            })}
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
