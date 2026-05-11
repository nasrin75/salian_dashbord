import React, { useState } from 'react';
import { Box, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CartridgeModal from './actions/CartridgeModal';
import ReplaceModal from './actions/ReplaceModal';

function DialogActionModal({ modalType, open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {modalType === "cartridge" && "شارژ کارتریج"}
        {modalType === "replace" && "جابجایی"}
        {modalType === "repair" && "تعمیر"}
        {modalType === "depo" && "تحویل به انبار مرکزی"}
        {modalType === "other" && "عملیات دیگر"}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>

        <Button onClick={() => alert('ذخیره شد!')} color="primary">ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function InventoryAction({ open: parentOpen, onClose: parentOnClose, selectedRows = [] }) {
  const [modalName, setModalName] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
  });

  const handleOpenModal = (name) => {
    setModalName(name);
    // resetForm();
  };

  const handleCloseModal = () => {
    setModalName(null);
    // resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        label="انتخاب عملیات"
        select
        sx={{ minWidth: 150 }}
        value=""
        SelectProps={{
          displayEmpty: true,
        }}
      >
        <MenuItem onClick={() => handleOpenModal("cartridge")}>شارژ کارتریج</MenuItem>
        <MenuItem onClick={() => handleOpenModal("replace")}>جابجایی</MenuItem>
        <MenuItem onClick={() => handleOpenModal("repair")}>تعمیر</MenuItem>
        <MenuItem onClick={() => handleOpenModal("depo")}>تحویل به انبار مرکزی</MenuItem>
      </TextField>

      <DialogActionModal
        modalType={modalName}
        open={modalName !== null}
        onClose={handleCloseModal}
      >
        {modalName === "cartridge" && (
          <CartridgeModal open={modalName === "cartridge"} onClose={handleCloseModal} formData={formData} setFormData={setFormData} selectedRows={selectedRows} />
        )}
        {modalName === "replace" && (
          <ReplaceModal open={modalName === "replace"} onClose={handleCloseModal} selectedRows={selectedRows}/>
        )}
      </DialogActionModal>
    </Box>
  );
}
