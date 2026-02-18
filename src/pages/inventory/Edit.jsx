import { useState, useCallback, useMemo, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/inventory/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { updateInventory, InventoryDetails } from '../../api/InventoryApi';
import { EditValidation } from '../../validation/InventoryValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES } from '../../utlis/constants/routePath';

function InventoryEditForm({ initialValues, onSubmit }) {
    const { inventoryID } = useParams();
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
            if(type == 'radio'){
                finalValue = Number(value);
            }
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

            navigate(APP_ROUTES.INVENTORY_LIST_PATH);
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

export default function Edit() {
    const { inventoryID } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        
        InventoryDetails(inventoryID)
            .then(data => {
                
                setInventory(data.data['result'])
                setIsLoading(false);
            })

        setIsLoading(false);
    }, [inventoryID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            updateInventory(formValues)
                .then(data => { 
                    setInventory(data.data['result'])
                    setIsLoading(false);
                    navigate(APP_ROUTES.INVENTORY_LIST_PATH);
                })
        },
        [inventoryID],
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

        return inventory ? (
            <InventoryEditForm initialValues={inventory} onSubmit={handleSubmit} />
        ) : null;
    }, [isLoading, error, inventory, handleSubmit]);


    return (
        <PageContainer
            title={"ویرایش پرسنل"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
