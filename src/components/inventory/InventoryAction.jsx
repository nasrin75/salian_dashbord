import React, { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import DialogActionModal from "../common/DialogActionModal";

export default function InventoryAction() {
  const [openModal, setOpenModal] = useState(null);
  const [modalName, setModalName] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
  });

  const handleClose = () => {
    setModalName(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {/* Select 1 */}
      <TextField select label="انتخاب عملیات" sx={{ minWidth: 150 }}>
        <MenuItem onClick={() => setModalName("cartridge")} value="">
          شارژ کارتریج
        </MenuItem>
        <MenuItem onClick={() => setModalName("replace")} value="">
          جابجایی
        </MenuItem>
        <MenuItem onClick={() => setModalName("repair")} value="repair">
          تعمیر
        </MenuItem>
        <MenuItem onClick={() => setModalName("depo")} value="">
          تحویل به انبار مرکزی
        </MenuItem>
      </TextField>

      {/* cartridge Modal */}

      <DialogActionModal
        modalType={modalName}
        open={modalName == "cartridge"}
        onClose={() => handleClose}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="نام"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="سن"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogActionModal>
    </Box>
  );
}
