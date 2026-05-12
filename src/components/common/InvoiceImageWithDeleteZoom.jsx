import { useMemo, useState } from "react";
import {
    Grid,
    Box,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

export default function InvoiceImageWithDeleteZoom({
    filePath,
    onDeleted,
    imageId,
    deleteUrlBase = "/files/delete",
}) {
    const [open, setOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const imageUrl = useMemo(() => {
        if (!filePath) return "";
        return process.env.REACT_APP_BASE_HTTPS_URL + `/${filePath}`;
    }, [filePath]);

    const handleZoomOpen = () => setOpen(true);
    const handleZoomClose = () => setOpen(false);

    const handleDelete = async () => {
        if (!filePath || loadingDelete) return;

        const ok = window.confirm("آیا مطمئن هستید این فایل حذف شود؟");
        if (!ok) return;

        try {
            setLoadingDelete(true);


              const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/inventory/files/${imageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "حذف ناموفق بود");
            }

            onDeleted?.(filePath);

            setOpen(false);
        } catch (e) {
            console.error(e);
            alert("خطا در حذف فایل از سرور.");
        } finally {
            setLoadingDelete(false);
        }
    };

    if (!filePath) return null;

    return (
        <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
            <Box sx={{ position: "relative", display: "inline-block", m: 1 }}>
                <Box
                    component="img"
                    src={imageUrl}
                    alt="Invoice"
                    onClick={handleZoomOpen}
                    sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "zoom-in",
                        border: "1px solid #ddd",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                    }}
                >
                    <Tooltip title="بزرگ‌نمایی">
                        <IconButton
                            size="small"
                            onClick={handleZoomOpen}
                            sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                        >
                            <ZoomInIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="حذف از سرور">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={handleDelete}
                            disabled={loadingDelete}
                            sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleZoomClose} maxWidth="md" fullWidth>
                <DialogActions sx={{ px: 2, pt: 1 }}>
                    <Button onClick={handleZoomClose}>بستن</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={loadingDelete}
                    >
                        {loadingDelete ? "در حال حذف..." : "حذف از سرور"}
                    </Button>
                </DialogActions>

                <DialogContent sx={{ p: 0, m: 0 }}>
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="Invoice Large"
                        sx={{
                            width: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                            display: "block",
                            bgcolor: "#fff",
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Grid>
    );
}
