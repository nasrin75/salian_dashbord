import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import History from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { deleteInventory, getInventories } from '../../api/InventoryApi';
import { useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { APP_ROUTES } from '../../utlis/constants/routePath';
import useAuth from '../../hooks/useAuth/useAuth';
import { PERMISSION } from '../../utlis/constants/Permissions';
import useTranslate from '../../hooks/useTranslate/useTranslate';
import { getFeaturesName } from '../../api/FeatureApi';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {  useGridApiRef } from '@mui/x-data-grid-pro';
import InventortAction from '../../components/inventory/InventoryAction';
import ExportExcelButton from '../../components/common/ExportExcelButton';


const INITIAL_PAGE_SIZE = 10;
// function ExportCsvButton({ rows }) {
//     const handleExport = () => {
//       if (!rows || rows.length === 0) return;

//       const header = Object.keys(rows[0]).join(",");
//       const csvRows = rows.map(r =>
//         Object.values(r)
//           .map(v => `"${String(v).replace(/"/g, '""')}"`)
//           .join(",")
//       );

//       const csv = [header, ...csvRows].join("\n");

//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "export.csv";
//       link.click();

//       URL.revokeObjectURL(url);
//     };

//     return (
//         <Button
//         variant="contained"
//         onClick={handleExport}>
//        Export CSV
//     </Button>
//     );
//   }

export default function List() {
    const apiRef = useGridApiRef();

    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const dialogs = useDialogs();
    const { getMessage } = useTranslate();
    const [allFeatureNames, setAllFeatureNames] = useState([]);
    const [visibilityColumns, setVisibilityColumns] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    //#region  Modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    //#endregion
    const [paginationModel, setPaginationModel] = useState({
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
        pageSize: searchParams.get('pageSize')
            ? Number(searchParams.get('pageSize'))
            : INITIAL_PAGE_SIZE,
    });
    const [filterModel, setFilterModel] = useState(() => {
        const raw = searchParams.get('filter');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                return {
                    items: Array.isArray(parsed.items) ? parsed.items : [],
                    logicOperator: parsed.logicOperator || 'and',
                    quickFilterValues: parsed.quickFilterValues || []
                };
            } catch {
                return { items: [], logicOperator: 'and', quickFilterValues: [] };
            }
        }
        return { items: [], logicOperator: 'and', quickFilterValues: [] };
    });

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

    const handleFilterModelChange = (model) => {
        const safeModel = {
            items: Array.isArray(model.items) ? model.items : [],
            logicOperator: model.logicOperator || 'and',
            quickFilterValues: model.quickFilterValues || []
        };

        setFilterModel(safeModel);

        if (safeModel.items.length > 0 || safeModel.quickFilterValues.length > 0) {
            searchParams.set('filter', JSON.stringify(safeModel));
        } else {
            searchParams.delete('filter');
        }

        navigate(`${pathname}?${searchParams.toString()}`);
    };


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

    // features columns
    useEffect(() => {
        getFeaturesName()
            .then(data => {
                setAllFeatureNames(data.data.data)
            })
            .catch(err => { })
    }, []);

    const featureColumns = useMemo(() => {
        return allFeatureNames.map(featureName => ({
            field: featureName,
            headerName: featureName,
            width: 140,
            renderCell: (params) => {
                const features = params.row.features || [];
                const item = features.find(f => f.name === featureName);
                return item ? <span>{item.value}</span> : <span>-</span>;
            },
        }));
    }, [allFeatureNames])

    // End features columns

    const loadData = useCallback(async () => {
        setIsLoading(true);

        getInventories(searchParams.get("equipment"))
            .then(data => {
                setInventories(data.data.data)

                setIsLoading(false)

            })
            .catch((err) => {
                //toast.error("مشکلی در گرفتن اطلاعات رخ داده است");
            })

        setIsLoading(false);
    }, [paginationModel, sortModel, filterModel, searchParams, allFeatureNames, featureColumns]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        // Hide columns, the other columns will remain visible
        const visibilityColumns = {
            user: false,
            expireWarrantyDate: false,
            deliveryDate: false,
            size: false,
            capacity: false,
            invoiceNumber: false,
            invoiceImage: false,
            description: false,
        }

        allFeatureNames.forEach(featureName => {
            { visibilityColumns[featureName] = false }
        })

        setVisibilityColumns(visibilityColumns);

    }, [allFeatureNames])
    const handleCreateClick = useCallback(() => {
        navigate(APP_ROUTES.INVENTORY_CREATE_PATH);
    }, [navigate]);

    const handleInventoryEditPage = useCallback(
        (inventoryID) => () => {

            navigate(`/inventory/edit/${inventoryID}`);
        },
        [navigate],
    );

    const handleDuplicateInventory = useCallback(
        (inventoryID) => () => {
            navigate(APP_ROUTES.INVENTORY_CREATE_DUPLICATE_PATH.replace(':inventoryID', inventoryID))
        },
        [navigate]
    )
    const handelDeleteInventory = useCallback(
        (inventory) => async () => {

            const confirmed = await dialogs.confirm(
                `آبا از حذف قطعه شماره  ${inventory.id} از انبار مطمئنید?`,
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

                    })
                    .catch((err) => {
                        //toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
                    })
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
        }),
        [],
    );

    const handleInventoryHistoty = useCallback(
        (inventoryID) => () => {
            navigate(APP_ROUTES.HISTORY_LIST_PATH + `?entityId=${inventoryID}&entityName=Inventories`)
        }, [navigate]
    )

    const isAlow = hasPermission([PERMISSION.INVENTORY_EDIT, PERMISSION.INVENTORY_DELETE, PERMISSION.INVENTORY_HISTORY]);
    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'ID', width: 100 },
            { field: 'employee', headerName: 'مالک', width: 140 },
            { field: 'propertyNumber', headerName: 'شماره اموال', width: 140 },
            { field: 'brandName', headerName: 'برند', width: 140 },
            { field: 'modelName', headerName: 'مدل', width: 140 },
            { field: 'equipment', headerName: 'قطعه', width: 140 },
            {
                field: 'status',
                headerName: 'وضعیت',
                width: 140,
                renderCell: params => {
                    //return params.row.status
                    return getMessage(params.row.status)
                },
            },
            { field: 'user', headerName: 'کاربر', width: 140 },
            { field: 'serialNumber', headerName: 'شماره سریال', width: 140 },
            {
                field: 'expireWarrantyDate',
                headerName: 'تاریخ اتمام گارانتی',
                width: 140,
                valueFormatter: params => dayjs(params).format("YYYY/MM/DD")
            },
            {
                field: 'deliveryDate',
                headerName: 'تاریخ تحویل',
                width: 140,
                valueFormatter: params => dayjs(params).format("YYYY/MM/DD")
            },
            { field: 'itNumber', headerName: 'شماره IT', width: 100 },
            { field: 'itParentNumber', headerName: 'شماره IT Parent', width: 140 },
            { field: 'invoiceNumber', headerName: 'شماره فاکتور', width: 140 },
            {
                field: 'invoiceImage', headerName: 'تصویر فاکتور', width: 140,
                renderCell: (params) => {
                    return (params.row?.invoiceImage &&
                        <div>
                            <img src={
                                process.env.REACT_APP_BASE_URL +
                                `/images/inventory/${params.row?.invoiceImage}`
                            } alt="Invoice" width={100} />
                        </div>
                    )
                }
            },
            ...featureColumns,
            {
                field: 'updatedAt',
                headerName: 'آخرین بروزرسانی',
                width: 140,
                type: 'date',
                valueFormatter: params => dayjs(params).format("YYYY/MM/DD h:m"),
            },
            // {
            //     field: 'updatedAt',
            //     headerName: 'آخرین بروزرسانی (میلادی)',
            //     width: 240,
            //     type: 'date',
            //     valueFormatter: params =>parse(params).format("YYYY/MM/DD h:m"),

            // },
            { field: 'description', headerName: 'توضیحات', width: 140 },
            ...(isAlow ? [{
                field: '',
                headerName: 'عملیات',
                type: 'actions',
                width: 240,
                align: 'center',
                getActions: ({ row }) => {
                    const actions = [];
                    if (hasPermission([PERMISSION.INVENTORY_CREATE])) {
                        actions.push(<GridActionsCellItem
                            key="edit-item"
                            icon={<ContentCopyIcon />}
                            label="Edit"
                            onClick={handleDuplicateInventory(row.id)}
                        />)
                    }
                    if (hasPermission([PERMISSION.INVENTORY_EDIT])) {
                        actions.push(<GridActionsCellItem
                            key="edit-item"
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={handleInventoryEditPage(row.id)}
                        />)
                    }

                    if (hasPermission([PERMISSION.INVENTORY_DELETE])) {
                        actions.push(<GridActionsCellItem
                            key="delete-item"
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handelDeleteInventory(row)}
                        />)
                    }
                    if (hasPermission([PERMISSION.INVENTORY_HISTORY])) {
                        actions.push(<GridActionsCellItem
                            key="log-item"
                            icon={<History />}
                            label="log"
                            onClick={handleInventoryHistoty(row.id)}
                        />)
                    }
                    return actions;
                }
            },] : [])
        ],

        [handleInventoryEditPage, handelDeleteInventory, isAlow, hasPermission, PERMISSION, getMessage, dayjs, EditIcon, DeleteIcon, History, process.env.REACT_APP_BASE_URL],
    );


    const pageTitle = 'انبار';

    return (
        <PageContainer
            title={pageTitle}
            marginTop='20px'
            actions={hasPermission([PERMISSION.INVENTORY_CREATE]) &&
                (<Stack direction="row" alignItems="center" spacing={1}>

                    <InventortAction
                        open={openModal}
                        onClose={handleCloseModal}
                        rows={selectedRows}
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreateClick}
                        startIcon={<AddIcon />}
                    >
                        افزودن به انبار
                    </Button>

                   <ExportExcelButton rows={inventories} selectedRows={selectedRows} />

                </Stack>)
            }
        >
            <Box sx={{ width: '100%', marginTop: '5px', paddingRight: '5px' }}>

                <DataGrid
                    rows={inventories}
                    //rowCount={inventories.length}
                    columns={columns}
                    align="center"
                    pagination
                    disableVirtualization
                    columnVisibilityModel={visibilityColumns}
                    onColumnVisibilityModelChange={setVisibilityColumns}
                    getRowId={(row) => row.id}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
                    // sortingMode="server"
                    // filterMode="server"
                    // paginationMode="server"
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
                    localeText={{ noRowsLabel: "موردی یافت نشد" }}
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
                        toolbar: {
                            inventories: inventories,
                            selectedRows: selectedRows,
                            apiRef: apiRef
                        }
                    }}
                />
            </Box>
        </PageContainer>
    );
}
