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
import SearchIcon from '@mui/icons-material/Search';
import { getExternalEquipmentInventories } from '../../api/InventoryApi';
import { getBrands } from '../../api/BrandApi';
import { CircularProgress, Dialog, DialogActions, DialogContent, IconButton, InputAdornment, Typography } from '@mui/material';
import { getImagesUrlByInvoiceNumber } from '../../api/InvoiceImageApi';
import CloseIcon from '@mui/icons-material/Close';
import MultiImageUploader from '../common/MultiImageUploader';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Gallery from '../common/Gallery';
import InvoiceImageWithDeleteZoom from '../common/InvoiceImageWithDeleteZoom';

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
  const [isShowItPatentInput, setIsShowItPatentInput] = useState(formValues.itParentNumber ? true : false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filePath, setFilePath] = useState('');
  const [itParentList, setItParentList] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});
  const [allPossibleFeatures, setAllPossibleFeatures] = useState([]);
  const [currentFeatureValues, setCurrentFeatureValues] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [images, setImages] = useState([]);
const [invoiceImages, setInvoiceImages] = useState([]);

  useEffect(() => {
    if (formValues.equipmentId) {
      getExternalEquipmentInventories(formValues.equipmentId)
        .then((data) => setItParentList(data.data.data))
        .catch(() => console.error("Failed to fetch initial IT parent list"));
    }

  }, [formValues.equipmentId, formValues?.invoiceImageUrl]);

  useEffect(() => {
    if (formValues.equipmentId) {
      getEquipmentFeatures(formValues.equipmentId)
        .then((data) => {
          const fetchedFeatures = data.data.data;
          setAllPossibleFeatures(fetchedFeatures);

          const initialFeatureValues = {};
          const newFeatureValuesArray = fetchedFeatures.map(feature => {
            const existingFeature = formValues.features?.find(f => f.featureId === feature.id);
            const value = existingFeature ? existingFeature.value : '';
            initialFeatureValues[feature.id] = value;
            return { featureId: feature.id, name: feature.name, value: value };
          });

          setCurrentFeatureValues(initialFeatureValues);

          onFieldChange('features', newFeatureValuesArray);
        })
        .catch(() => {
          console.error("Failed to fetch equipment features.");
          setAllPossibleFeatures([]);
          setCurrentFeatureValues({});
          onFieldChange('features', []);
        });
    } else {
      // Clear features if no equipment is selected
      setAllPossibleFeatures([]);
      setCurrentFeatureValues({});
      onFieldChange('features', []);
    }
  }, [formValues.equipmentId]);


  const handleFeatureChange = useCallback((featureIdToUpdate, newValue) => {
    setCurrentFeatureValues(prevValues => {
      const updatedValues = { ...prevValues, [featureIdToUpdate]: newValue };

      const featuresArray = allPossibleFeatures.map(feature => ({
        featureId: feature.id,
        name: feature.name,
        value: updatedValues[feature.id] || ''
      }));

      onFieldChange('features', featuresArray);
      return updatedValues;
    });
  }, [allPossibleFeatures, onFieldChange]);


  const handleEquipmentChanges = async (e, value) => {

    onFieldChange('equipmentId', value?.id || null);
    setIsShowItPatentInput(false);


    // Fetch external inventories based on the new equipmentId
    if (value?.id) {
      try {
        if (value.type == 1) { // 1 = intenral , 2= external
          setIsShowItPatentInput(true);
          const data = await getExternalEquipmentInventories(value.id);
          setItParentList(data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch IT parent list", error);
        setItParentList([]);
      }
    } else {
      setItParentList([]);
    }
  };


  useEffect(() => {
    setFilePath(formValues?.invoiceImageUrl);

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
      });
    }

    setFeatureValues(formValues?.features);

  }, [formValues?.features]);
  //#region InvoiceImage Section
  useEffect(() => {
    if (selectedImageId) {
      onFieldChange('invoiceImageId', selectedImageId, 'radio')
      //handleSearch(selectedImageId);
    }
  }, [selectedImageId]);

  const handleImageSelect = async (id) => {
    setSelectedImageId(id);
  };
  const handleSearch = async () => {
    await getImagesUrlByInvoiceNumber(formValues.invoiceNumber)
      .then((data) => setImagesUrl(data.data.data))
      .catch((err) => {
        console.log('err', err)
      });
  }
  //#endregion

  //#region image dialog
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImageUrl('');
  };
  //#endregion

  const getInventoryFeatures = async () => {

    await getEquipmentFeatures(formValues.equipmentId)
      .then((data) => {
        const list = data.data.data;
        setFeatures(list);

      })
      .catch(() => {
        //toast.error("خطا در دریافت ویژگی‌ها");
      });
  }

  //#region Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!formValues.invoiceNumber) {
      toast.error(" برای اپلود تصویر شماره فاکتور الزامی است");
      return
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("invoiceNumber", `${formValues.invoiceNumber}`);

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
      onFieldChange("invoiceImageUrl", data.url);
      setFilePath(data.url);
      toast.success("فایل با موفقیت آپلود شد!");
    } catch (err) {
      console.error(err);
      toast.error("آپلود فایل با خطا مواجه شد.");
    }
  };
  //#endregion

  //send data
  const handleSubmit = useCallback(
    async (event) => {
      console.log("handle",formValues)
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
        <Grid container spacing={1} sx={{ mb: 2, width: "100%" }}>
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
              onChange={async (e, value) => {
                await handleEquipmentChanges(e, value);
              }}
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
              fullWidth
              variant="outlined"
              label="شماره فاکتور"
              placeholder="شماره فاکتور"
              value={formValues.invoiceNumber ?? null}
              onChange={(e) => onFieldChange("invoiceNumber", e.target.value)}
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

          {/* Image section */}
          {/* upload Image */}
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>

            <MultiImageUploader
              maxFiles={1}
              maxSizeMB={20}
              folderName="Inventory"
              onChange={(uploadedItems) => {
                setImages(uploadedItems);
                onFieldChange(
                  "imageIds",
                  uploadedItems.filter(x => x.id).map(x => x.id)
                );
              }}
              saveImages={onFieldChange}
              lable=" آپلود فاکتور"
              invoiceNumber={formValues.invoiceNumber}
            />

          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <InvoiceImageWithDeleteZoom
              filePath={filePath}
              imageId={formValues.invoiceImageId}
              onDeleted={(path) => {
                setInvoiceImages((prev) => prev.filter((x) => x.path !== path));
              }}
            />
            {/* {filePath && (
              <img
                src={
                  process.env.REACT_APP_BASE_HTTPS_URL +
                  `/${filePath}`
                }
                alt="Invoice"
                width={100}
                height={100}
                style={{ margin: 3 }}
              />
            )} */}
          </Grid>
          {
            imagesUrl && (
              <Grid item xs={12} sm={12} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">تصاویر فاکتورهای مرتبط</FormLabel>
                  <RadioGroup
                    row
                    sx={{ gap: 2, flexWrap: 'nowrap' }}
                    value={selectedImageId}
                    onChange={(e) => handleImageSelect(Number(e.target.value))}
                  >
                    {imagesUrl.map((item) => {
                      const imageUrl = process.env.REACT_APP_BASE_HTTPS_URL + `/${item.url}`;
                      return (
                        <FormControlLabel
                          key={item.id}
                          value={item.id}
                          control={<Radio checked={formValues?.invoiceImageId == item.id ?? false} />}
                          label={
                            <img
                              src={imageUrl}
                              width={120}
                              style={{ borderRadius: 10, cursor: 'pointer' }}
                              onClick={() => handleImageClick(imageUrl)}
                              alt={`Preview of ${item.url}`}
                            />
                          }
                        />
                      );
                    })}
                  </RadioGroup>
                  <FormHelperText error={!!formErrors.status}>
                    {formErrors.status ?? " "}
                  </FormHelperText>
                </FormControl>

                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  maxWidth="md"
                  fullWidth
                  PaperProps={{
                    style: {
                      position: 'relative',
                    },
                  }}
                >
                  <DialogActions sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                    <IconButton onClick={handleCloseDialog} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  </DialogActions>
                  <DialogContent>
                    <img
                      src={selectedImageUrl}
                      style={{ width: '100%', height: 'auto', display: 'block', margin: 'auto' }}
                      alt="Enlarged view"
                    />
                  </DialogContent>
                </Dialog>
              </Grid>

            )
          }

          {/* {
            imagesUrl && (
              <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    تصاویر فاکتورهای مرتبط
                  </FormLabel>
                  <RadioGroup
                    row
                    sx={{ gap: 2 }}
                    value={selectedImageId}
                    onChange={(e) => handleImageSelect(Number(e.target.value))}
                  >
                    {imagesUrl?.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        value={item.id}
                        control={<Radio checked={formValues?.invoiceImageId == item.id ?? false} />}
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
            )
          } */}

          {/* end image section */}


          {/* status part */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
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
          {/* show equipment features */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: "flex" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              مشخصات:
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }} spacing={3}>
            {allPossibleFeatures?.map((feature) => {
              // Use the object state for current values
              const currentValue = currentFeatureValues[feature.id] || '';

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

const ImageCard = ({ item, onDelete, onPreview, canDelete, isDeleting, isUploading, error }) => (
  <Box
    sx={{
      width: 110,
      height: 110,
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid #ddd",
      cursor: "pointer",
      "&:hover .overlay": { opacity: isUploading || error ? 1 : (item.fullUrl || item.previewUrl ? 1 : 0) },
    }}
  >
    <Box
      component="img"
      src={item.fullUrl || item.previewUrl}
      alt={`item-${item.uniqueKey}`}
      onClick={onPreview}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        filter: isUploading ? 'blur(3px)' : (error ? 'grayscale(100%)' : 'none'),
      }}
    />
    {(isUploading || error || canDelete) && (
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: isUploading || error ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.35)",
          opacity: 0,
          transition: "0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        {isUploading && <CircularProgress size={20} color="inherit" />}
        {error && <Typography variant="caption" color="error">خطا</Typography>}
        {canDelete && !isUploading && !error && (
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(); }} sx={{ color: "#fff" }}>
            {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
    )}
  </Box>
);
export default EditForm;
