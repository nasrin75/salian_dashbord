import * as React from 'react';
import { useNavigate } from 'react-router';
import CreateForm from '../../components/permission/CreateForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { CreateValidation } from '../../validation/PermissionValidation';
import { createPermission } from '../../api/PermissionApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';

const INITIAL_FORM_VALUES = {
    FaName: '',
    EnName: '',
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
        (name, value) => {
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

        createPermission(JSON.stringify(formValues))
            .then(() => {
                toast.success("دسترسی با موفقیت ایجاد شد.")
                navigate(APP_ROUTES.PERMISSION_LIST_PATH);
            })

    }, [formValues, navigate, setFormErrors]);

    return (
        <PageContainer
            title="ایجاد دسترسی"
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
