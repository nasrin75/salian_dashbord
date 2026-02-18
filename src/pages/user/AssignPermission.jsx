import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { EditValidation } from '../../validation/PermissionValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { assignUserPermission, PermissionDetails, updatePermission } from '../../api/PermissionApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';
import { getUserPermissions } from '../../api/UserApi';
import AssignPermissionForm from '../../components/user/AssignPermissionForm';

function PermissionEditForm({ initialValues, onSubmit,userID }) {
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

    // const handleFormFieldChange = useCallback(
    //     (name, value) => {

    //         console.log("handleFormFieldChange :: ",name,value)
    //         let finalValue = value;

    //         // const newFormValues={
    //         //     userId : userID,
    //         //     permissionIds :value
    //         // }
    //         const newFormValues = {
    //             ...formValues,
    //             [name] : value,
    //         };
            

    //         setFormValues(newFormValues);

    //     },
    //     [formValues],
    // );
const handleFormFieldChange = useCallback(
  (name, value, type = "text") => {
console.log("handleFormFieldChange :: ",name,value)
    let finalValue = value;

    const newFormValues = {
      ...formValues,
      [name]: finalValue,
    };

    setFormValues(newFormValues);

  },
  [formValues,setFormValues, formErrors],
);

    const handleFormSubmit = useCallback(async () => {
        try {
            await onSubmit(formValues);
            toast.success("ویرایش با موفقیت انجام شد.")

            navigate(APP_ROUTES.USER_LIST_PATH);
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
    const { userID } = useParams();
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        getUserPermissions(userID)
            .then(data => {
                setUserPermissions(data.data['result'])
                setIsLoading(false);
            })

        setIsLoading(false);
    }, [userID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            console.log("handleSubmit",formValues)
            const request={
                userId:userID,
                permissionIds:formValues.permissionIds,
            }
            assignUserPermission(request)
                .then(data => {
                    setUserPermissions('handlesubmit', data.data['result'])
                    setIsLoading(false);
                    navigate(APP_ROUTES.USER_LIST_PATH);
                })
        },
        [userID],
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

        return userPermissions ? (
            <PermissionEditForm initialValues={userPermissions} onSubmit={handleSubmit} userID={userID}/>
        ) : null;
    }, [isLoading, error, userPermissions, handleSubmit]);


    return (
        <PageContainer
            title={"افزودن دسترسی"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
