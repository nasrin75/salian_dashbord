import * as React from 'react';
import { useNavigate } from 'react-router';
import CreateForm from '../../components/inventory/CreateForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { CreateValidation } from '../../validation/InventoryValidation';
import { createInventory } from '../../api/InventoryApi';

const INITIAL_FORM_VALUES = {
    ItNumber: null,
    ItParentNumber: null,
    EmployeeId: null,
    LocationId: null,
    EquipmentId: null,
    Status: null,
    PropertyNumber: '',
    SerialNumber: '',
    InvoiceNumber: null,
    InvoiceImage: null,
    Description: null,
    BrandName: '',
    ModelName: '',
    Capacity: null,
    Size: null,
    ExpireWarrantyDate: null,
    DeliveryDate: null,
    Features :[]
};

export default function Create() {
    const navigate = useNavigate();


    const [formState, setFormState] = React.useState(() => ({
        values: INITIAL_FORM_VALUES,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = React.useCallback((newFormValues) => {
        setFormState((previousState) => ({
            ...previousState,
            values: newFormValues,
        }));
    }, []);

    const setFormErrors = React.useCallback((newFormErrors) => {
        setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
        }));
    }, []);


    const handleFormFieldChange = React.useCallback(
        (name, value, type = "text") => {
            let finalValue = value;

            if (type == 'switch') {
                finalValue = value == 'on' ? true : false;
            }
            if (type == 'radio' || type == 'number') {
                finalValue = Number(value);
            }
            const newFormValues = {
                ...formValues,
                [name]: finalValue,
            };

            setFormValues(newFormValues);

            const { issues } = CreateValidation(newFormValues);

            setFormErrors({
                ...formErrors,
                [name]: issues?.find(i => i.path?.[0] === name)?.message,
            });

        },
        [formValues, formErrors],
    );
    const handleFormSubmit = React.useCallback(async (payload) => {
        const { issues } = CreateValidation(payload);
        
        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});

        createInventory(JSON.stringify(payload))
            .then(() => {
                toast.success("عملیات با موفقیت انجام شد.")
                navigate('/inventories');
            })
            .catch(()=> toast.error("مشکلی در افزودن به انبار رخ داده است"))

    }, [navigate, setFormErrors]);

    return (
        <PageContainer
            title="افزودن قطعه به انبار"
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <CreateForm
                formState={formState}
                onFieldChange={handleFormFieldChange}
                onSubmit={handleFormSubmit}
                submitButtonLabel="ذخیره"
            />
        </PageContainer>
    );
}
