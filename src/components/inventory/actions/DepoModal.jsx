import { toast } from "react-toastify";

const DepoModal = ({ onClose, setFormData, selectedRows = [] }) => {

    const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];
    if (!selectedIds || selectedIds.length === 0) {

        toast.error("انتخاب حداقل یه قطعه الزامی است.")
        onClose(true)

    }
    console.log('DepoModal selectedIds', selectedIds)
    return (
        <p>DepoModal</p>
    );
}

export default DepoModal;