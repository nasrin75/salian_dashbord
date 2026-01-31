import * as React from 'react';
import { useNavigate } from 'react-router';
import CreateForm from '../../components/employee/CreateForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { CreateValidation } from '../../validation/EmployeeValidation';
import { createEmployee } from '../../api/EmployeeApi';

const INITIAL_FORM_VALUES = {
    Name: '',
    Email: '',
    LocationId: '',
};

export default function EmployeeCreate() {
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
    const handleFormSubmit = React.useCallback(async () => {
        const { issues } = CreateValidation(formValues);
        if (issues && issues.length > 0) {
            setFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
        }
        setFormErrors({});

        createEmployee(JSON.stringify(formValues))
            .then(() => {
                toast.success("پرسنل جدید با موفقیت ایجاد شد.")
                navigate('/employees');
            })

    }, [formValues, navigate, setFormErrors]);

    return (
        <PageContainer
            title="ایجاد پرسنل جدید"
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
