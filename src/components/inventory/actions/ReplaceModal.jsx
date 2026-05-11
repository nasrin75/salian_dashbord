import { toast } from "react-toastify";

const ReplaceModal =({ onClose, setFormData, selectedRows = [] })=>{
      const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];
        if (!selectedIds || selectedIds.length === 0) {
    
            toast.error("انتخاب حداقل یه قطعه الزامی است.")
            onClose(true)
    
        }
    return (
        <p>ReplaceModal</p>
    );
}

export default ReplaceModal;