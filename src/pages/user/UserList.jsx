import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import History from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { getUsers , deleteUser } from '../../api/UserApi';

const INITIAL_PAGE_SIZE = 10;

export default function UserList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();

  const [paginationModel, setPaginationModel] = React.useState({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState(
    searchParams.get('filter')
      ? JSON.parse(searchParams.get('filter') ?? '')
      : { items: [] },
  );
  const [sortModel, setSortModel] = React.useState(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  );

  const [users, setUsers] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);

  const handlePaginationModelChange = React.useCallback(
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

  const handleFilterModelChange = React.useCallback(
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

  const handleSortModelChange = React.useCallback(
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

  const loadData = React.useCallback(async () => {
      setIsLoading(true);
  
   getUsers()
      .then(data =>{
        setUsers(data.data['result'])

        setIsLoading(false)

      }).catch(() =>toast.error("مشکلی در گرفتن اطلاعات رخ داده است") )
  
      setIsLoading(false);
    }, [paginationModel, sortModel, filterModel,searchParams]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);


  const handleCreateClick = React.useCallback(() => {
    navigate('/user/create');
  }, [navigate]);

  const handleUserEditPage = React.useCallback(
    (userID) => () => {
      console.log(userID)
      // navigate(`/user/edit/${userID}`);
      navigate(`/user/edit/${userID}`);
    },
    [navigate],
  );

  const handelDeleteUser = React.useCallback(
    (user) => async () => {
      
      const confirmed = await dialogs.confirm(
        `آبا از حذف کاربر  ${user.username} مطمینید?`,
        {
          title: `حذف کاربر?`,
          severity: 'خطا',
          okText: 'حذف',
          cancelText: 'انصراف',
        },
      );

      if (confirmed) {
        setIsLoading(true);
       
          deleteUser(user.id)
                .then(() =>{
                  loadData();
                  toast.success("کاربر با موفقیت حذف شد.")
                  setIsLoading(false)

                }).catch(() => 
                    toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
                 )
        setIsLoading(false);
      }
    },
    [dialogs, loadData],
  );

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo(
    () => [
      { field: 'username', headerName: 'نام کاربری', width: 240 ,align: 'right' },
      { field: 'mobile', headerName: 'موبایل', width: 140,align: 'right' },
      { field: 'email', headerName: 'ایمیل', width: 240 ,align: 'right'},
      { field: 'role', headerName: 'نقش', width: 140 ,align: 'right'},    
      { field: 'status', headerName: 'وضعیت', width: 140, type: 'string' ,align: 'right'},
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
            onClick={handleUserEditPage(row.id)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handelDeleteUser(row)}
          />,
           <GridActionsCellItem
            key="delete-item"
            icon={<VpnKeyOutlined />}
            label="permissions"
            // onClick={handelDeleteUser(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<History />}
            label="permissions"
            // onClick={handelDeleteUser(row)}
          />,
        ],
      },
    ],
    [handleUserEditPage, handelDeleteUser],
  );

  const pageTitle = 'کاربران';

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
             افزودن کاربر 
          </Button>
        </Stack>
      }
    >
      <Box sx={{ width: '100%', marginTop:'5px' ,paddingRight:'5px'}}>

          <DataGrid
            rows={users}
            rowCount={users.length}
            columns={columns}
            align="center"
            pagination
            sortingMode="server"
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
