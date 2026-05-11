import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';

const ExportExcelButton = ({ rows = [], selectedRows = [] }) =>{
    const handleExport = () => {
        const safeRows = Array.isArray(rows) ? rows : [];
        const selectedIds = selectedRows && selectedRows.ids ? Array.from(selectedRows.ids) : [];

        const selectedAsString = selectedIds.map(String);

        const filteredRows =
            selectedAsString.length > 0
                ? safeRows.filter((r) => selectedAsString.includes(String(r.id)))
                : safeRows;

        if (!filteredRows.length) {
            alert("هیچ رکوردی برای خروجی وجود ندارد");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "export.xlsx");
    };

    return (
        <div style={{ display: "flex", gap: "10px", padding: "8px" }}>
            <Button variant="contained" onClick={handleExport}>
                Export Excel
            </Button>
        </div>
    );
}

export default ExportExcelButton;