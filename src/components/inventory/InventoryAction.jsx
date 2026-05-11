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

export default function InventoryAction({ open: parentOpen, onClose: parentOnClose, rows = [] }) {
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

  const renderModalContent = (name) => {
    switch (name) {
      case "cartridge":
        return (
          <>
            <TextField
              label="نام"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="سن"
              name="age"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            {/* سایر فیلدهای مودال شارژ کارتریج */}
          </>
        );
      case "replace":
        return (
          <>
            <p>فرم جابجایی در اینجا قرار می‌گیرد.</p>
            {/* فیلدهای مربوط به جابجایی */}
          </>
        );
      case "repair":
        return (
          <>
            <p>فرم تعمیر در اینجا قرار می‌گیرد.</p>
            {/* فیلدهای مربوط به تعمیر */}
          </>
        );
      case "depo":
        return (
          <>
            <p>فرم تحویل به انبار مرکزی در اینجا قرار می‌گیرد.</p>
            {/* فیلدهای مربوط به تحویل به انبار */}
          </>
        );
      default:
        return null;
    }
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
          <CartridgeModal open={modalName === "cartridge"} onClose={handleCloseModal} formData={formData} setFormData={setFormData} />
        )}
        {modalName === "replace" && (
          <ReplaceModal open={modalName === "replace"} onClose={handleCloseModal} />
        )}
      </DialogActionModal>
    </Box>
  );
}
