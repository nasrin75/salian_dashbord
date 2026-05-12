import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { toast } from "react-toastify";

export default function MultiImageUploader({
  maxFiles = 10,
  maxSizeMB = 5,
  onChange,
  lable
}) {
  const inputRef = useRef(null);

  const [items, setItems] = useState([]); 
  // items: [{ file: File, url: string, id: string }]

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const accept = "image/*";

  const totalCount = useMemo(() => items.length, [items]);

  const openPicker = () => inputRef.current?.click();

  const addFiles = async (fileList) => {
    const filesArray = Array.from(fileList || []);
    if (filesArray.length === 0) return;
  
    const remaining = maxFiles - items.length;
    const toAdd = filesArray.slice(0, Math.max(remaining, 0));
  
    const valid = toAdd.filter((f) => f.size <= maxSizeBytes);
  
    for (const file of valid) {
      const tempId = `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;
      const tempUrl = URL.createObjectURL(file);
  
      setItems((prev) => [...prev, { file, url: tempUrl, id: tempId }]);
  
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("FolderName", 'invne');
  
        const token = localStorage.getItem("token");

      const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
  
        if (!res.ok) throw new Error("Upload failed");
  
        const data = await res.json();
  
        setItems((prev) =>
          prev.map((x) =>
            x.id === tempId ? { ...x, id: data.id, serverUrl: data.url } : x
          )
        );
  
        onChange?.([
          ...items.map((x) => ({
            id: x.id,
            url: x.serverUrl || x.url,
          })),
          { id: data.id, url: data.url },
        ]);
      } catch (err) {
        console.error(err);
        toast.error(`آپلود ${file.name} ناموفق بود`);
      }
    }
  };
  

  const handleInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDelete = (id) => {
    setItems((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.url);

      const next = prev.filter((x) => x.id !== id);

      onChange?.(next.map((x) => x.file));
      return next;
    });
  };

  const handleOpenPreview = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  React.useEffect(() => {
    return () => {
      items.forEach((x) => URL.revokeObjectURL(x.url));
    };
  }, []);

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={handleInputChange}
      />

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<PhotoCameraIcon />}
          onClick={openPicker}
          disabled={totalCount >= maxFiles}
        >
         {lable}
        </Button>

        <Typography variant="body2" color="text.secondary">
          {totalCount}/{maxFiles} عکس
        </Typography>
      </Stack>

      <Box>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {/* عکسی انتخاب نشده است. */}
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {items.map((x, index) => (
              <Box
                key={x.id}
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  component="img"
                  src={x.url}
                  alt={`preview-${index}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "zoom-in",
                  }}
                  onClick={() => handleOpenPreview(index)}
                />

                {/* delete icon*/}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(x.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(255,255,255,0.85)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>

                {/* zoom icon */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPreview(index);
                  }}
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    backgroundColor: "rgba(255,255,255,0.85)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* zoom modal*/}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, backgroundColor: "black" }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: 300,
              p: 1,
            }}
          >
            <Box
              component="img"
              src={items[previewIndex]?.url}
              alt="large-preview"
              sx={{
                maxHeight: "70vh",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
