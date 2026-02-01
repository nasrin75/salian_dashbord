import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/equipment/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { EditValidation } from '../../validation/EquipmentValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { EquipmentDetails, updateEquipment } from '../../api/EquipmentApi';

function EquipmentEditForm({ initialValues, onSubmit }) {
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
  [formValues, formErrors],
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

            navigate('/equipments');
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
    const { equipmentID } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        EquipmentDetails(equipmentID)
            .then(data => {
                setEquipment(data.data['result'])
                setIsLoading(false);
            })
            .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))

        setIsLoading(false);
    }, [equipmentID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            updateEquipment(formValues)
                .then(data => {
                    setEquipment('handlesubmit', data.data['result'])
                    setIsLoading(false);
                    navigate('/equipments');
                })
                .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))
        },
        [equipmentID],
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

        return equipment ? (
            <EquipmentEditForm initialValues={equipment} onSubmit={handleSubmit} />
        ) : null;
    }, [isLoading, error, equipment, handleSubmit]);


    return (
        <PageContainer
            title={"ویرایش قطعه"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
