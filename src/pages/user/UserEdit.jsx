import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditForm from '../../components/user/EditForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import { updateUser, userDetails } from '../../api/UserApi';
import { userEditFormValidate } from '../../validation/UserValidation';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES } from '../../utlis/constants/routePath';
import { useCallback, useEffect, useMemo, useState } from 'react';

function UserEditForm({ initialValues, onSubmit }) {
  const { userId } = useParams();
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
  const handleIpUpdate = useCallback((ipValues) => {
    setFormValues({
      ...formValues,
      ips: {
        ...formValues.ips,
        ...ipValues
      }
    });
  }, [formValues, setFormValues]);

  const handleFormFieldChange = useCallback(
    (name, value, type = "text") => {

      let finalValue = value;

      if (type === "number") {
        finalValue = value === "" ? null : Number(value);
      }

      if (type === "checkbox") {
        finalValue = Boolean(value);
      }

      if (name === "Status") {
        finalValue = value =="active" ? 1: -1;
      }

      if (type === "radio") {

        finalValue = Number(value);
      }

      const newFormValues = {
        ...formValues,
        [name]: finalValue,
      };
      if (type === "doubleString") {
        setFormValues({
          ...formValues,
          ips: {
            ...formValues.ips,
            ...value
          }
        });
      }
      setFormValues(newFormValues);

      const { issues } = userEditFormValidate(newFormValues);

      setFormErrors({
        ...formErrors,
        [name]: issues?.find(i => i.path?.[0] === name)?.message,
      });

    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = useCallback(async () => {
    const { issues } = userEditFormValidate(formValues);

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

      navigate(APP_ROUTES.USER_LIST_PATH);
    } catch (editError) {
      //toast.error("مشکلی در گرفتن اطلاعات رخ داده است")
    }
  }, [formValues, navigate, onSubmit, setFormErrors]);

  return (
    <EditForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      onIpChange={handleIpUpdate}
      submitButtonLabel="ذخیره"
    />
  );
}

export default function UserEdit() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    userDetails(userId)
      .then(data => {
        setUser(data.data.data)
        setIsLoading(false);
      }).catch(err => { })

    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleSubmit = useCallback(

    async (formValues) => {
      
      updateUser(JSON.stringify(formValues))
        .then(data => {
          setUser('handlesubmit', data.data.data)
          setIsLoading(false);
        })

      
    },
    [userId],
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
