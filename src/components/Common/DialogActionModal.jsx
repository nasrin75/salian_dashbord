import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

function DialogActionModal(props) {
    const {
        children,
        modalType,
        openModal,
        closeModal
    } = props;

    return (
        <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
            <DialogTitle>اطلاعات شخصی</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal}>بستن</Button>
                <Button variant="contained" onClick={closeModal}>
                    ذخیره
                </Button>
                {/* <Button onClick={closeModal}>بستن</Button>
                <Button variant="contained" onClick={closeModal}>
                    ذخیره
                </Button> */}
            </DialogActions>
        </Dialog>
    );
}

export default DialogActionModal;