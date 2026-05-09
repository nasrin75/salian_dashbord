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

function InventoryEditForm({ initialValues, onSubmit, onValuesChange }) {
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

        if (onValuesChange) {
            onValuesChange(newFormValues);
        }
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
            if (type == 'radio') {
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

            navigate(APP_ROUTES.INVENTORY_LIST_PATH + '?equipment=ALL');
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
            submitButtonLabel="ذخیره"
        />
    );
}

export default function Edit() {
    const { inventoryID } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({});

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);


        InventoryDetails(inventoryID)
            .then(data => {
                const response = data.data.data;
                setInventory(response)
                setIsLoading(false);
                setFormValues(response);
                setIsLoading(false);
            }).catch(err => {
                //console.log(err)
            })

        setIsLoading(false);
    }, [inventoryID]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFormValuesChange = useCallback((newFormValues) => {
        setFormValues(newFormValues);
    }, []);
    // const handleSubmit = useCallback(
    //     async (formValues) => {
    //         updateInventory(formValues)
    //             .then(data => { 
    //                 setInventory(data.data.data)
    //                 setIsLoading(false);
    //                 navigate(APP_ROUTES.INVENTORY_LIST_PATH + '?equipment=ALL');
    //             }).catch(err => { })
    //     },
    //     [inventoryID],
    // );

    const handleSubmit = useCallback(
        async (valuesToSend) => {
            try {
                const response = await updateInventory(valuesToSend);
                setInventory(response.data.data)
                setIsLoading(false);
                toast.success("ویرایش با موفقیت انجام شد.");
                navigate(APP_ROUTES.INVENTORY_LIST_PATH + '?equipment=ALL');
            } catch (err) {
                setIsLoading(false);
                toast.error("مشکلی در گرفتن اطلاعات رخ داده است");
                console.error("Error updating inventory:", err);
            }
        },
        [navigate], // inventoryID دیگر اینجا لازم نیست چون از formValues استفاده میکنیم
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
            <InventoryEditForm initialValues={inventory} onSubmit={handleSubmit} onValuesChange={handleFormValuesChange} />
        ) : null;
    }, [isLoading, error, inventory, handleSubmit, handleFormValuesChange]);


    return (
        <PageContainer
            title={"ویرایش انبار"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
