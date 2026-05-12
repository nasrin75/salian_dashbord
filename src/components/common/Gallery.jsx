import React from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
const FILE_BASE = process.env.REACT_APP_BASE_HTTPS_URL;


export default function Gallery({
  invoiceNumber,
  initialImages = [],
  onImagesChange,
  canUpload = false,
  canDelete = true,
  readonly = false,
}) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (initialImages.length > 0) {
      const formattedInitial = initialImages.map((img) => ({
        id: img.id,
        url: img.url,
        fullUrl: img.url?.startsWith("http")
          ? img.url
          : `${FILE_BASE}/${img.url}`,
        uniqueKey: img.id || crypto.randomUUID(),
      }));
      setItems(formattedInitial);
      onImagesChange?.(formattedInitial);
    }
    else if (invoiceNumber && !loading) {
      const fetchAndSetImages = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await fetch(process.env.REACT_APP_API_BASE_URL + `invoiceImages?invoiceNumber=${encodeURIComponent(invoiceNumber)}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          const json = await res.json();

          if (!res.ok || json?.status !== 200) throw new Error(json?.message || "خطا در دریافت تصاویر");

          const mapped = (json?.data || []).map((x) => ({
            id: x.id,
            url: x.url,
            fullUrl: x.url?.startsWith("http") ? x.url : `${FILE_BASE}/${x.url}`,
            uniqueKey: x.id || crypto.randomUUID(),
          }));
          setItems(mapped);
          onImagesChange?.(mapped);
        } catch (err) {
          console.error(err);
          toast.error(err?.message || "خطا در دریافت تصاویر");
          setItems([]);
          onImagesChange?.([]);
        } finally {
          setLoading(false);
        }
      };
      fetchAndSetImages();
    }
    else if (!invoiceNumber && initialImages.length === 0) {
      setItems([]);
      onImagesChange?.([]);
    }
  }, [invoiceNumber, initialImages, onImagesChange, loading]);

  const handleDelete = async (id, uniqueKey) => {
    const prevItems = items;
    const itemToDelete = items.find(item => item.id === id || item.uniqueKey === uniqueKey);
    const filteredItems = prevItems.filter(item => item.uniqueKey !== uniqueKey);
    setItems(filteredItems);
    onImagesChange?.(filteredItems);

    if (id) {
      setDeletingId(id);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(process.env.REACT_APP_API_BASE_URL + `/files/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (!res.ok) throw new Error(`حذف ناموفق: ${res.statusText}`);
        toast.success(`تصویر ${id} حذف شد`);
      } catch (err) {
        console.error("Delete error:", err);
        toast.error(err?.message || "خطا در حذف تصویر");

        setItems(prevItems);
        onImagesChange?.(prevItems);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newItems = [...items];
    const uploadedFilesData = [];

    for (const file of files) {
      const uniqueKey = crypto.randomUUID();
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = {
          uniqueKey: uniqueKey,
          file: file, 
          previewUrl: reader.result,
          uploading: true,
          error: null,
          id: null, 
          serverUrl: null,
        };
        newItems.push(newItem);
        setItems([...newItems]);
        uploadedFilesData.push(newItem); 
      };
      reader.readAsDataURL(file);
    }

    event.target.value = null;

    if (uploadedFilesData.length > 0 && invoiceNumber) { 
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        uploadedFilesData.forEach(item => formData.append('files', item.file)); 
        formData.append('invoiceNumber', invoiceNumber); 

          const uploadRes = await fetch(process.env.REACT_APP_API_BASE_URL + "files/uploadInvoiceImages", {
          method: "POST",
            body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok || uploadJson?.status !== 200) throw new Error(uploadJson?.message || "خطای آپلود");

        const uploadedSuccessfully = uploadJson?.data || [];

        // Update state with server URLs and IDs
        const updatedItems = newItems.map(item => {
          const serverData = uploadedSuccessfully.find(s => s.originalFileName === item.file.name); // Match by filename
          if (serverData) {
            return {
              ...item,
              id: serverData.id,
              serverUrl: `${FILE_BASE}/${serverData.url}`,
              uploading: false,
              error: null,
              file: null, // Clear file reference after upload
            };
          }
          return item; // Keep as is if not uploaded or error
        });
        setItems(updatedItems);
        onImagesChange?.(updatedItems);

        toast.success("تصاویر با موفقیت آپلود شدند!");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(err?.message || "خطا در آپلود تصاویر");
        // Mark items with errors
        const failedUploads = newItems.map(item => ({
          ...item,
          uploading: false,
          error: "Upload failed",
        }));
        setItems(failedUploads);
        onImagesChange?.(failedUploads);
      }
    } else if (uploadedFilesData.length > 0 && !invoiceNumber) {
      toast.warn("برای آپلود تصاویر، شماره فاکتور لازم است.");
      // Mark items with errors or revert them
      const failedUploads = newItems.map(item => ({
        ...item,
        uploading: false,
        error: "Invoice number missing",
      }));
      setItems(failedUploads);
      onImagesChange?.(failedUploads);
    }
  };

  const openPreview = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle1">تصاویر فاکتور</Typography>
        {!readonly && canUpload && (
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        )}
        {!readonly && canUpload && (
          <IconButton onClick={handleAddClick} size="small" color="primary">
            <AddPhotoAlternateIcon />
          </IconButton>
        )}
      </Stack>

      {loading && !items.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {readonly ? "تصویری موجود نیست." : "تصویری آپلود نشده است."}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {items.map((x, index) => (
            <ImageCard
              key={x.uniqueKey}
              item={x}
              index={index}
              onDelete={() => handleDelete(x.id, x.uniqueKey)}
              onPreview={() => openPreview(index)}
              canDelete={canDelete && !readonly}
              isDeleting={deletingId === x.id}
              isUploading={x.uploading}
              error={x.error}
            />
          ))}
        </Box>
      )}

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>پیش‌نمایش تصویر</span>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {items[previewIndex] ? (
            <Box
              component="img"
              src={items[previewIndex].fullUrl || items[previewIndex].previewUrl}
              alt={`preview-${items[previewIndex].uniqueKey}`}
              sx={{ width: "100%", maxHeight: "75vh", objectFit: "contain", display: "block" }}
            />
          ) : (
            <Typography>تصویری برای نمایش وجود ندارد</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

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
