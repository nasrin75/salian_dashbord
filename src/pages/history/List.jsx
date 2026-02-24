import { useState, useCallback, useMemo, useEffect, forwardRef } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageHistoryRounded from '@mui/icons-material/ManageHistoryRounded';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { deleteHistory, getHistories } from '../../api/HistoryApi';
import useAuth from '../../hooks/useAuth/useAuth';
import { PERMISSION } from '../../utlis/constants/Permissions';
import dayjs from 'dayjs';
import Slide from '@mui/material/Slide';
import DetailsModal from '../../components/History/DetailsModal';

const INITIAL_PAGE_SIZE = 10;
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function List() {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [openModal, setOpenModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState({})
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

    const [historys, setHistories] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const closeModal = () => {
        setOpenModal(false)
    }
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

    const handleHistoryDetails = (row) => {
        setOpenModal(true)
        
        setSelectedRow(row)
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);

        getHistories()
            .then(data => {
                setHistories(data.data['result'])

                setIsLoading(false)

            }).catch((err) => {
                let message = err.status == 401 ? "لطفا دوباره وارد شوید." : "مشکلی در گرفتن اطلاعات رخ داده است";
                toast.error(message);
            })

        setIsLoading(false);
    }, [paginationModel, sortModel, filterModel, searchParams]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handelDeleteHistory = useCallback(
        (history) => async () => {

            const confirmed = await dialogs.confirm(
                `آبا از حذف تاریخچه  ${history.id} مطمئنید?`,
                {
                    title: `حذف تاریخچه?`,
                    severity: 'خطا',
                    okText: 'حذف',
                    cancelText: 'انصراف',
                },
            );

            if (confirmed) {
                setIsLoading(true);

                deleteHistory(history.id)
                    .then(() => {
                        loadData();
                        toast.success("عملیات با موفقیت حذف شد.")
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
            pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
        }),
        [],
    );

    const isAlow = hasPermission([PERMISSION.HISTORY_DELETE, PERMISSION.HISTORY_DETAILS]);
    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'شناسه', width: 240, align: 'right', },
            {
                field: 'actionType',
                headerName: 'عملیات',
                width: 140,
                align: 'right',
                renderCell: params => {
                    switch (params.row.actionType) {
                        case 'login':
                            return "ورود به پنل";
                        case 'update':
                            return "ویرایش";
                        case 'delete':
                            return "حذف";
                        case 'create':
                            return "افزودن";
                    }
                }
            },
            {
                field: 'entity',
                headerName: 'بخش',
                width: 140,
                align: 'right',
                renderCell: params => {
                    let entityName = params.row.entity.toString().toLowerCase();

                    switch (entityName) {
                        case 'inventories':
                            entityName = "انبار";
                            break;
                        case 'users':
                            entityName = "کاربران";
                            break;
                        case 'employees':
                            entityName = "پرسنل";
                            break;
                        case 'equipments':
                            entityName = "قطعات";
                            break;
                        case 'roles':
                            entityName = "نقش ها";
                            break;
                        case 'permissions':
                            entityName = "دسترسی ها";
                            break;
                        case 'inventoryfeatures':
                            entityName = "ویژگی قطعات";
                            break;
                    }
                    return <a href="${params.row.id}">{entityName}</a>
                }
            },
            { field: 'user', headerName: 'کاربر', width: 140, align: 'right' },
            { field: 'ip', headerName: 'IP', width: 140, align: 'right' },
            {
                field: 'createdAt',
                headerName: 'آخرین بروزرسانی',
                width: 240,
                align: 'right',
                type: 'date',
                valueFormatter: params => dayjs(params).format("YYYY/MM/DD h:m:s"),
            },
            ...(isAlow ? [{
                field: '',
                headerName: 'عملیات',
                type: 'actions',
                flex: 1,
                align: 'center',
                getActions: ({ row }) => {
                    const actions = [];
                    if (hasPermission([PERMISSION.HISTORY_DELETE])) {
                        actions.push(<GridActionsCellItem
                            key="delete-item"
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handelDeleteHistory(row)}
                        />)
                    }

                    if (hasPermission([PERMISSION.HISTORY_DETAILS])) {

                        actions.push(<GridActionsCellItem
                            key="details-item"
                            icon={<ManageHistoryRounded />}
                            label="details"
                            onClick={() => handleHistoryDetails(row)}
                        />)
                    }
                    return actions;
                }
            },] : [])
        ],
        [handelDeleteHistory],
    );

    const pageTitle = 'تاریخچه';

    return (
        <PageContainer
            title={pageTitle}
            marginTop='20px'
        >
            <Box sx={{ width: '100%', marginTop: '5px', paddingRight: '5px' }}>

                <DataGrid
                    rows={historys}
                    rowCount={historys.length}
                    columns={columns}
                    align="center"
                    pagination
                    // sortingMode="server"
                    // filterMode="server"
                    // paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    //onRowClick={handleRowClick}
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
            <DetailsModal open={openModal} close={closeModal} data={selectedRow} />


        </PageContainer>
    );
}
