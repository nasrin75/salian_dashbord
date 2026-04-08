import { useNavigate } from 'react-router';
import CreateForm from '../../components/user/CreateForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { userValidate } from '../../validation/UserValidation';
import { createUser } from '../../api/UserApi';
import { APP_ROUTES } from '../../utlis/constants/routePath';
import { useCallback, useState } from 'react';

const INITIAL_FORM_VALUES = {
  Username: '',
  Email: '',
  Password: '',
  Mobile: '',
  RoleId: '',
  Status: '',
  IsCheckIp: false,
  LoginTypes: [],
  Scope: '',
  SingleIp: '',
  RangeIp: '',
};

const UserCreate = () => {
  const navigate = useNavigate();


  const [formState, setFormState] = useState(() => ({
    values: INITIAL_FORM_VALUES,
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

  const setFormErrors = useCallback((newFormErrors) => {
    setFormState((previousState) => ({
      ...previousState,
      errors: newFormErrors,
    }));
  }, []);


  const handleFormFieldChange = useCallback(
    (name, value, type = "text") => {

      let finalValue = value;

      if (type === "number") {
        finalValue = value === "" ? null : Number(value);
      }

      if (type === "checkbox") {
        finalValue = Boolean(value);
      }

      // if (name === "Status" && value == '-1') {
      //   finalValue = 0;
      // }

      if (type === "radio") {
       
        finalValue = Number(value);
      }

      const newFormValues = {
        ...formValues,
        [name]: finalValue,
      };

      setFormValues(newFormValues);
      console.log('setFormValues', newFormValues)

      const { issues } = userValidate(newFormValues);

      setFormErrors({
        ...formErrors,
        [name]: issues?.find(i => i.path?.[0] === name)?.message,
      });

    },
    [formValues, formErrors],
  );
  const handleFormSubmit = useCallback(async () => {

    const { issues } = userValidate(formValues);

    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    console.log('handleFormSubmit', formValues)

    createUser(JSON.stringify(formValues))
      .then(() => {
        toast.success("کاربر با موفقیت ایجاد شد.")

        navigate(APP_ROUTES.USER_LIST_PATH);
      })

  }, [formValues, navigate, setFormErrors]);

  return (
    <PageContainer
      title="ایجاد کاربر"
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

export default UserCreate;
