import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function DialogActionModal({ modalType, open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {modalType === "cartridge" && "شارژ کارتریج"}
        {modalType === "replace" && "جابجایی"}
        {modalType === "repair" && "تعمیر"}
        {modalType === "depo" && "تحویل به انبار مرکزی"}
      </DialogTitle>
      <DialogContent>
        {children} 
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>لغو</Button>
        <Button onClick={() => alert('ذخیره شد!')} color="primary">ذخیره</Button> 
      </DialogActions>
    </Dialog>
  );
}
