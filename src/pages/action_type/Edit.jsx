import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/actionType/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { EditValidation } from '../../validation/ActionTypeValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionTypeDetails, updateActionType } from '../../api/ActionTypeApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';

function ActionTypeEditForm({ initialValues, onSubmit }) {
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
  (name, value, type = "text") => {

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
  [formValues,setFormValues, formErrors],
);

    const handleFormReset = useCallback(() => {
        setFormValues(initialValues);
    }, [initialValues, setFormValues]);

    const handleFormSubmit = useCallback(async () => {
        const { issues } = EditValidation(formValues);
        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});

        try {
            await onSubmit(formValues);
            toast.success("ویرایش با موفقیت انجام شد.")

            navigate(APP_ROUTES.ACTION_TYPE_LIST_PATH);
        } catch (editError) {}
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

export default function ActionTypeEdit() {
    const { actionID } = useParams();
    const navigate = useNavigate();
    const [actionType, setActionType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        ActionTypeDetails(actionID)
            .then(data => {
                setActionType(data.data['result'])
                setIsLoading(false);
            })

        setIsLoading(false);
    }, [actionID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            updateActionType(formValues)
                .then(data => {
                    setActionType('handlesubmit', data.data['result'])
                    setIsLoading(false);
                    navigate(APP_ROUTES.ACTION_TYPE_LIST_PATH);
                })
        },
        [actionID],
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

        return actionType ? (
            <ActionTypeEditForm initialValues={actionType} onSubmit={handleSubmit} />
        ) : null;
    }, [isLoading, error, actionType, handleSubmit]);


    return (
        <PageContainer
            title={"ویرایش عملیات"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
