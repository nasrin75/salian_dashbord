import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import History from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { deleteEmployee, getEmployees } from '../../api/EmployeeApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';

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

    const [employees, setEmployees] = useState([]);

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

        getEmployees()
            .then(data => {
                setEmployees(data.data['result'])

                setIsLoading(false)

            }).catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است"))

        setIsLoading(false);
    }, [paginationModel, sortModel, filterModel, searchParams]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleCreateClick = useCallback(() => {
         navigate(APP_ROUTES.EMPLOYEE_CREATE_PATH);
    }, [navigate]);

    const handleEmployeeEditPage = useCallback(
        (employeeID) => () => {
            console.log(employeeID)
            navigate(`/employee/edit/${employeeID}`);
        },
        [navigate],
    );

    const handelDeleteEmployee = useCallback(
        (employee) => async () => {

            const confirmed = await dialogs.confirm(
                `آبا از حذف پرسنل  ${employee.name} مطمئنید?`,
                {
                    title: `حذف پرسنل?`,
                    severity: 'خطا',
                    okText: 'حذف',
                    cancelText: 'انصراف',
                },
            );

            if (confirmed) {
                setIsLoading(true);

                deleteEmployee(employee.id)
                    .then(() => {
                        loadData();
                        toast.success("پرسنل با موفقیت حذف شد.")
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

    const columns = useMemo(
        () => [
            { field: 'id', headerName: 'کدپرسنلی ', width: 240, align: 'right', },
            { field: 'name', headerName: 'نام', width: 140, align: 'right' },
            { field: 'email', headerName: 'ایمیل', width: 240, align: 'right' },
            { field: 'location', headerName: 'موقعیت', width: 140, align: 'right' },
            {
                field: '',
                headerName: 'عملیات',
                type: 'actions',
                flex: 1,
                align: 'center',
                getActions: ({ row }) => [
                    <GridActionsCellItem
                        key="edit-item"
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEmployeeEditPage(row.id)}
                    />,
                    <GridActionsCellItem
                        key="delete-item"
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handelDeleteEmployee(row)}
                    />,
                    <GridActionsCellItem
                        key="log-item"
                        icon={<History />}
                        label="log"
                    // onClick={handleEmployeeEditPage(row)}
                    />,
                ],
            },
        ],
        [handleEmployeeEditPage, handelDeleteEmployee],
    );

    const pageTitle = 'پرسنل';

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
                        افزودن پرسنل
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ width: '100%', marginTop: '5px', paddingRight: '5px' }}>

                <DataGrid
                    rows={employees}
                    rowCount={employees.length}
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
