import React, { useEffect, useMemo, useRef, useState } from "react";
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
    lable,
    folderName = "Inventory",
    selectedIds = [],
    invoiceNumber = null
}) {
    const inputRef = useRef(null);

    const [items, setItems] = useState([]);
    // items: [{ file: File, url: string, id: string }]
    const [isDisable, setIsDisable] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const accept = "image/*";

    const totalCount = useMemo(() => items.length, [items]);

    const openPicker = () => inputRef.current?.click();

    const addFiles = async (fileList) => {
        const files = Array.from(fileList || []);

        if (!files.length) return;

        if (items.length + files.length > maxFiles) {
            toast.error(`حداکثر ${maxFiles} فایل مجاز است`);
            return;
        }

        if (folderName == "Inventory" && invoiceNumber == null) {
            toast.error("شماره فاکتور الزامی است");
            return;
        }
        const tempItems = files.map((file) => {
            const uniqueKey = crypto.randomUUID();
            return {
                uniqueKey: uniqueKey,
                tempId: uniqueKey,
                file,
                previewUrl: URL.createObjectURL(file),
                id: null,
                serverUrl: "",
                uploading: true,
                error: null,
            };
        });

        setItems(prevItems => {
            const uniqueNewItems = tempItems.filter(newItem =>
                !prevItems.some(prevItem => prevItem.tempId === newItem.tempId)
            );
            const uniqueNewItemsWithId = uniqueNewItems.filter(newItem =>
                !prevItems.some(prevItem => prevItem.id && newItem.id && prevItem.id === newItem.id)
            );

            return [...prevItems, ...uniqueNewItemsWithId];
        });

        for (const tempItem of tempItems) {
            try {
                const formData = new FormData();
                formData.append("File", tempItem.file);
                formData.append("FolderName", folderName);
                if (invoiceNumber != null) {
                    formData.append("InvoiceNumber", invoiceNumber);
                }

                if (Array.isArray(selectedIds)) {
                    selectedIds.forEach((id) => {
                        formData.append("Ids", id);
                    });
                }

                const token = localStorage.getItem("token");

                const res = await fetch(process.env.REACT_APP_API_BASE_URL + "/files/upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                const result = await res.json();

                const uploaded = result?.data?.[0];
                if (!uploaded) {
                    throw new Error("Upload failed");
                }

                setItems((prev) => {
                    const updated = prev.map((x) =>
                        x.tempId === tempItem.tempId
                            ? {
                                ...x,
                                id: uploaded.id,
                                serverUrl: process.env.REACT_APP_BASE_HTTPS_URL + '/' + uploaded.url,
                                uploading: false,
                                error: null,
                            }
                            : x
                    );

                    onChange?.(
                        updated.filter((x) => x.id && !x.uploading && !x.error)
                    );

                    return updated;
                });
            } catch (err) {
                setItems((prev) =>
                    prev.map((x) =>
                        x.tempId === tempItem.tempId
                            ? {
                                ...x,
                                uploading: false,
                                error: err?.message || "آپلود ناموفق بود",
                            }
                            : x
                    )
                );
            }
        }
    };


    const handleInputChange = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    // in state:
    // { uniqueKey: '...', id: 123, previewUrl: '...', serverUrl: '...', file: null }
    // or
    // { uniqueKey: '...', id: null, previewUrl: 'blob:...', serverUrl: '', file: File }

    const handleDelete = async (uniqueKey) => {
        const target = items.find((x) => x.uniqueKey === uniqueKey);

        if (!target) {
            return;
        }

        if (target.id) {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/files/${target.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Server delete failed");
                }
            } catch (error) {
                alert("خطا در حذف فایل از سرور");
                return;
            }
        }

        setItems((prevItems) => {
            const nextItems = prevItems.filter((x) => x.uniqueKey !== uniqueKey);

            if (target.previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(target.previewUrl);
            }

            onChange?.(nextItems);

            return nextItems;
        });
    };



    const handleOpenPreview = (index) => {
        setPreviewIndex(index);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    useEffect(() => {
        return () => {
            items.forEach((x) => {
                if (x.previewUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(x.previewUrl);
                }
            });
        };
    }, [items]);

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

                {/* <Typography variant="body2" color="text.secondary">
                    {totalCount}/{maxFiles} عکس
                </Typography> */}
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
                                key={x.uniqueKey}
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
                                    src={x.serverUrl || x.previewUrl}
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
                                    onClick={() => handleDelete(x.uniqueKey)}
                                    // onClick={(e) => {
                                    //     e.stopPropagation();
                                    //     handleDelete(x.id);
                                    // }}
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
                            src={items[previewIndex]?.serverUrl || items[previewIndex]?.previewUrl}
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
