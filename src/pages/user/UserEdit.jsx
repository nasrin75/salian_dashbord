import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import EditForm from '../../components/user/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { updateUser, userDetails } from '../../api/UserApi';
import { userValidate } from '../../validation/UserValidation';
import Divider from '@mui/material/Divider';

function UserEditForm({ initialValues, onSubmit }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formState, setFormState] = React.useState(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;
  console.log('UserEditForm', formState)
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
      const validateField = async (values) => {
        const { issues } = userValidate(values);
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

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = userValidate(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      toast.success("کاربر با موفقیت ویرایش شد.")

      // navigate('/user');
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

UserEditForm.propTypes = {
  initialValues: PropTypes.shape({
    age: PropTypes.number,
    isFullTime: PropTypes.bool,
    joinDate: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.oneOf(['Development', 'Finance', 'Market']),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function UserEdit() {
  const { userId } = useParams();

  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    console.log('sssss', Number(userId))
    userDetails(userId)
      .then(data => {
        console.log('dtaaaa', userId, data.data['result'])
        setUser(data.data['result'])
        setIsLoading(false);
      })
      .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))

    setIsLoading(false);
  }, [userId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues) => {
      updateUser(formValues)
        .then(data => {
          console.log('handlesubmit', userId)
          setUser('handlesubmit', data.data['result'])
          setIsLoading(false);
        })
        .catch(() => toast.error("مشکلی در گرفتن اطلاعات رخ داده است."))

      // const updatedData = await updateEmployee(Number(userId), formValues);
      // setUser(updatedData);
    },
    [userId],
  );

  const renderEdit = React.useMemo(() => {
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
      <UserEditForm initialValues={user} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, user, handleSubmit]);

  return (
    <PageContainer
      title={"ویرایش کاربر"}
    >
      <Divider sx={{ marginBottom: "4%" }} />
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
