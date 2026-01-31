import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/employee/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { updateEmployee, employeeDetails, EmployeeDetails } from '../../api/EmployeeApi';
import { EditValidation } from '../../validation/EmployeeValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeEditForm({ initialValues, onSubmit }) {
    const { employeeID } = useParams();
    const navigate = useNavigate();

    const [formState, setFormState] = useState(() => ({
        values: initialValues,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;
    console.log('EmployeeEditForm', formValues)

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
                    loginTypes: initialValues.loginTypes || []
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
            const validateField = async (values) => {
                const { issues } = EditValidation(values);
                setFormErrors({
                    ...formErrors,
                    [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
                });
            };

            const newFormValues = { ...formValues, [name]: value };
            setFormValues(newFormValues);
            validateField(newFormValues);

        },
        [formValues, formErrors, setFormErrors, setFormValues],
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

            // navigate('/employees');
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

// EmployeeEdit.propTypes = {
//   initialValues: PropTypes.shape({
//     age: PropTypes.number,
//     isFullTime: PropTypes.bool,
//     joinDate: PropTypes.string,
//     name: PropTypes.string,
//     role: PropTypes.oneOf(['Development', 'Finance', 'Market']),
//   }).isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };

export default function EmployeeEdit() {
    const { employeeID } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        console.log('sssss', employeeID)
        EmployeeDetails(employeeID)
            .then(data => {
                console.log('dtaaaa', employeeID, data.data['result'])
                setEmployee(data.data['result'])
                setIsLoading(false);
            })
            .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))

        setIsLoading(false);
    }, [employeeID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleSubmit = useCallback(
        async (formValues) => {
            updateEmployee(formValues)
                .then(data => {
                    console.log('handlesubmit', employeeID)
                    setEmployee('handlesubmit', data.data['result'])
                    setIsLoading(false);
                    navigate('/employees');
                })
                .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))
        },
        [employeeID],
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

        return employee ? (
            <EmployeeEditForm initialValues={employee} onSubmit={handleSubmit} />
        ) : null;
    }, [isLoading, error, employee, handleSubmit]);


    return (
        <PageContainer
            title={"ویرایش پرسنل"}
        >
            <Divider sx={{ marginBottom: "4%" }} />
            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
