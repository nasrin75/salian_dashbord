import React, { useState } from 'react';
import { Box, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CartridgeModal from './actions/CartridgeModal';
import ReplaceModal from './actions/ReplaceModal';
import RepairModal from './actions/RepairModal';
import DepoModal from './actions/DepoModal';

export default function InventoryAction({ open: parentOpen, onClose: parentOnClose, selectedRows = [] }) {
  const [modalName, setModalName] = useState(null);
  const [modalData, setModalData] = useState({});

  const handleOpenModal = (name) => {
    setModalName(name);
    setModalData({})
    // resetForm();
  };

  const handleCloseModal = () => {
    setModalName(null);
    setModalData({})
    // resetForm();
  };

  const handleModalSave = (data) => {
    console.log("داده‌های دریافتی از مودال:", data);
    handleCloseModal();
  };

  // const resetForm = () => {
  //   setFormData({
  //     name: "",
  //     age: "",
  //   });
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

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


      {modalName === "cartridge" && (
        <CartridgeModal open={modalName === "cartridge"} onClose={handleCloseModal} selectedRows={selectedRows} onSave={handleModalSave} />
      )}
      {modalName === "replace" && (
        <ReplaceModal open={modalName === "replace"} onClose={handleCloseModal} selectedRows={selectedRows} onSave={handleModalSave} />
      )}
      {modalName === "repair" && (
        <RepairModal open={modalName === "repair"} onClose={handleCloseModal} selectedRows={selectedRows} onSave={handleModalSave} />
      )}
      {modalName === "depo" && (
        <DepoModal open={modalName === "depo"} onClose={handleCloseModal} selectedRows={selectedRows} onSave={handleModalSave} />
      )}
    </Box>
  );
}
