import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, gridClasses, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import History from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { deleteInventory, getInventories } from '../../api/InventoryApi';

const INITIAL_PAGE_SIZE = 10;

export default function List() {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const dialogs = useDialogs();

    const [paginationModel, setPaginationModel] = useState({
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
        pageSize: searchParams.get('pageSize')
            ? Number(searchParams.get('pageSize'))
            : INITIAL_PAGE_SIZE,
    });
    const [filterModel, setFilterModel] = useState(
        searchParams.get('filter')
            ? JSON.parse(searchParams.get('filter') ?? '')
            : { items: [] },
    );
    const [sortModel, setSortModel] = useState(
        searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
    );

    const [inventories, setInventories] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const handlePaginationModelChange = useCallback(
        (model) => {
            setPaginationModel(model);

            searchParams.set('page', String(model.page));
            searchParams.set('pageSize', String(model.pageSize));

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );

    const handleFilterModelChange = useCallback(
        (model) => {
            setFilterModel(model);

            if (
                model.items.length > 0 ||
                (model.quickFilterValues && model.quickFilterValues.length > 0)
            ) {
                searchParams.set('filter', JSON.stringify(model));
            } else {
                searchParams.delete('filter');
            }

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );

    const handleSortModelChange = useCallback(
        (model) => {
            setSortModel(model);

            if (model.length > 0) {
                searchParams.set('sort', JSON.stringify(model));
            } else {
                searchParams.delete('sort');
            }

            const newSearchParamsString = searchParams.toString();

            navigate(
                `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
            );
        },
        [navigate, pathname, searchParams],
    );

    const loadData = useCallback(async () => {
        setIsLoading(true);

        getInventories()
            .then(data => {
                setInventories(data.data['result'])

                setIsLoading(false)

            }).catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است"))

        setIsLoading(false);
    }, [paginationModel, sortModel, filterModel, searchParams]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleCreateClick = useCallback(() => {
        navigate('/inventory/create');
    }, [navigate]);

    const handleInventoryEditPage = useCallback(
        (inventoryID) => () => {
            console.log(inventoryID)
            navigate(`/inventory/edit/${inventoryID}`);
        },
        [navigate],
    );

    const handelDeleteInventory = useCallback(
        (inventory) => async () => {

            const confirmed = await dialogs.confirm(
                `آبا از حذف قطعه  ${inventory.name} از انبار مطمئنید?`,
                {
                    title: `حذف قطعه?`,
                    severity: 'خطا',
                    okText: 'حذف',
                    cancelText: 'انصراف',
                },
            );

            if (confirmed) {
                setIsLoading(true);

                deleteInventory(inventory.id)
                    .then(() => {
                        loadData();
                        toast.success("قطعه با موفقیت حذف شد.")
                        setIsLoading(false)

                    }).catch(() =>
                        toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
                    )
                setIsLoading(false);
            }
        },
        [dialogs, loadData],
    );

    const initialState = useMemo(
        () => ({
            pagination: {
                paginationModel: { pageSize: INITIAL_PAGE_SIZE }
            },
            columns: {
                columnVisibilityModel: {
                    // Hide columns, the other columns will remain visible
                    location: false,
                    user: false,
                    expireWarrantyDate: false,
                    deliveryDate: false,
                    size: false,
                    capacity: false,
                    invoiceNumber: false,
                    invoiceImage: false,
                    description: false,
                }
            }
        }),
        [],
    );

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'ID', width: 140, align: 'right', },
            { field: 'employee', headerName: 'مالک', width: 140, align: 'right' },
            { field: 'location', headerName: 'بخش', width: 140, align: 'right' },
            { field: 'propertyNumber', headerName: 'شماره اموال', width: 140, align: 'right' },
            { field: 'brandName', headerName: 'برند', width: 140, align: 'right' },
            { field: 'modelName', headerName: 'مدل', width: 140, align: 'right' },
            { field: 'equipment', headerName: 'قطعه', width: 140, align: 'right' },
            { field: 'status', headerName: 'وضعیت', width: 140, align: 'right' },
            { field: 'user', headerName: 'کاربر', width: 140, align: 'right' },
            { field: 'serialNumber', headerName: 'شماره سریال', width: 140, align: 'right' },
            { field: 'expireWarrantyDate', headerName: 'تاریخ اتمام گارانتی', width: 140, align: 'right' },
            { field: 'deliveryDate', headerName: 'تاریخ تحویل', width: 140, align: 'right' },
            { field: 'size', headerName: 'سایز', width: 140, align: 'right' },
            { field: 'capacity', headerName: 'capacity', width: 140, align: 'right' },
            { field: 'itNumber', headerName: 'شماره IT', width: 140, align: 'right' },
            { field: 'itParentNumber', headerName: 'شماره IT Parent', width: 140, align: 'right' },
            { field: 'invoiceNumber', headerName: 'شماره فاکتور', width: 140, align: 'right' },
            { field: 'invoiceImage', headerName: 'تصویر فاکتور', width: 140, align: 'right' },
            { field: 'updatedAt', headerName: 'آخرین بروزرسانی', width: 140, align: 'right' },
            { field: 'description', headerName: 'توضیحات', width: 140, align: 'right' },
            {
                field: '',
                headerName: 'عملیات',
                type: 'actions',
                // flex: 1,
                align: 'center',
                getActions: ({ row }) => [
                    <GridActionsCellItem
                        key="edit-item"
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleInventoryEditPage(row.id)}
                    />,
                    <GridActionsCellItem
                        key="delete-item"
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handelDeleteInventory(row)}
                    />,
                    <GridActionsCellItem
                        key="log-item"
                        icon={<History />}
                        label="log"
                    // onClick={handleInventoryEditPage(row)}
                    />,
                    <GridActionsCellItem
                        key="log-item"
                        icon={<History />}
                        label="log"
                    // onClick={handelDeleteEmployee(row)}
                    />,
                ],
            },
        ],
        [handleInventoryEditPage, handelDeleteInventory],
    );

    const pageTitle = 'انبار';

    return (
        <PageContainer
            title={pageTitle}
            marginTop='20px'
            actions={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                        variant="contained"
                        onClick={handleCreateClick}
                        startIcon={<AddIcon />}
                    >
                        افزودن به انبار
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ width: '100%', marginTop: '5px', paddingRight: '5px' }}>

                <DataGrid
                    rows={inventories}
                    rowCount={inventories.length}
                    columns={columns}
                    align="center"
                    pagination
                    // sortingMode="server"
                    // filterMode="server"
                    // paginationMode="server"
                    // columnVisibilityModel={{
                    //     // Hide columns status and traderName, the other columns will remain visible
                    //     location: false,
                    //     user: false,
                    //     expireWarrantyDate: false,
                    //     deliveryDate: false,
                    //     size: false,
                    //     capacity: false,
                    //     invoiceNumber: false,
                    //     invoiceImage: false,
                    //     description: false
                    // }}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    disableRowSelectionOnClick
                    loading={isLoading}
                    initialState={initialState}
                    showToolbar
                    pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                    sx={{
                        [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                            outline: 'transparent',
                        },
                        [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                        {
                            outline: 'none',
                        },
                        [`& .${gridClasses.row}:hover`]: {
                            cursor: 'pointer',
                        },
                    }}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'circular-progress',
                            noRowsVariant: 'circular-progress',
                        },
                        baseIconButton: {
                            size: 'small',
                        },
                    }}
                />
            </Box>
        </PageContainer>
    );
}
