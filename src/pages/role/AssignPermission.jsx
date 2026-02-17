import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { assignUserPermission } from '../../api/PermissionApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';
import { assignRolePermission, getRolePermissions } from '../../api/RoleApi';
import AssignPermissionForm from '../../components/role/AssignPermissionForm';

function PermissionEditForm({ initialValues, onSubmit }) {
    const navigate = useNavigate();

    const [formState, setFormState] = useState(() => ({
        values: initialValues,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = useCallback((newFormValues) => {
        setFormState((previousState) => ({
            ...previousState,
            values: newFormValues,
        }));
    }, []);

    useEffect(() => {
        if (initialValues) {
            setFormState({
                values: {
                    ...initialValues,
                },
                errors: {}
            })
        }
    }, [initialValues])

    const setFormErrors = useCallback((newFormErrors) => {
        setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
        }));
    }, []);

    const handleFormFieldChange = useCallback(
        (name, value) => {
            console.log("handleFormFieldChange :: ", name, value)

            const newFormValues = {
                ...formValues,
                [name]: value,
            };

            setFormValues(newFormValues);

        },
        [formValues, setFormValues, formErrors],
    );

    const handleFormSubmit = useCallback(async () => {
        try {
            await onSubmit(formValues);
            toast.success("ویرایش با موفقیت انجام شد.")

            navigate(APP_ROUTES.ROLE_LIST_PATH);
        } catch (editError) {
            toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
        }
    }, [formValues, navigate, onSubmit, setFormErrors]);

    return (
        <AssignPermissionForm
            formState={formState}
            onFieldChange={handleFormFieldChange}
            onSubmit={handleFormSubmit}
        />
    );
}

export default function AssignPermission() {
    const { roleID } = useParams();
    const navigate = useNavigate();
    const [RolePermissions, setRolePermissions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        getRolePermissions(roleID)
            .then(data => {
                setRolePermissions(data.data['result'])
                setIsLoading(false);
            })

        setIsLoading(false);
    }, [roleID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            console.log("handleSubmit", formValues)
            const request = {
                roleId: roleID,
                permissionIds: formValues.permissionIds,
            }
            assignRolePermission(request)
                .then(data => {
                    setRolePermissions('handlesubmit', data.data['result'])
                    setIsLoading(false);
                    navigate(APP_ROUTES.ROLE_LIST_PATH);
                })
        },
        [roleID],
    );

    const renderEdit = useMemo(() => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        m: 1,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Alert severity="error">{error.message}</Alert>
                </Box>
            );
        }

        return RolePermissions ? (
            <PermissionEditForm initialValues={RolePermissions} onSubmit={handleSubmit} roleID={roleID} />
        ) : null;
    }, [isLoading, error, RolePermissions, handleSubmit]);


    return (
        <PageContainer
            title={"افزودن دسترسی"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
