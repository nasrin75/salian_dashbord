import { useState, useCallback, useMemo, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/profile/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { EditValidation } from '../../validation/ProfileValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetails, updateProfile } from '../../api/ProfileApi';

function SettingEditForm({ initialValues, onSubmit }) {
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

            let finalValue = value;

            const newFormValues = {
                ...formValues,
                [name]: finalValue,
            };

            setFormValues(newFormValues);

            const { issues } = EditValidation(newFormValues);

            setFormErrors({
                ...formErrors,
                [name]: issues?.find(i => i.path?.[0] === name)?.message,
            });

        },
        [formValues, setFormValues, formErrors],
    );

    const handleFormReset = useCallback(() => {
        setFormValues(initialValues);
    }, [initialValues, setFormValues]);

    const handleFormSubmit = useCallback(async () => {
        console.log('before-handleFormSubmit', formValues)
        const { issues } = EditValidation(formValues);
        console.log('issue-handleFormSubmit', issues)
        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});
        console.log('after-handleFormSubmit', formValues)
        try {
            await onSubmit(formValues);
            toast.success("ویرایش با موفقیت انجام شد.")

        } catch (editError) {
            toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
        }
    }, [formValues, navigate, onSubmit, setFormErrors]);

    return (
        <EditForm
            formState={formState}
            onFieldChange={handleFormFieldChange}
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
            submitButtonLabel="Save"
        />
    );
}

export default function Setting() {
    const { userID } = 1;//TODO:after create auth edit it
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        getDetails(1)//TODO:after create auth edit it
            .then(data => {
                setUser(data.data['result'])
                setIsLoading(false);
            })
            .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))

        setIsLoading(false);
    }, [userID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(

        async (formValues) => {
            updateProfile(formValues)
                .then(data => {
                    setUser(data.data['result'])
                    setIsLoading(false);
                    // navigate('/settings/users');
                })
                .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))
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

        return user ? (
            <SettingEditForm initialValues={user} onSubmit={handleSubmit} />
        ) : null;
    }, [isLoading, error, user, handleSubmit]);


    return (
        <PageContainer
            title={"تنظیمات"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
