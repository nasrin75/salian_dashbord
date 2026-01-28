import * as React from 'react';
import { useNavigate } from 'react-router';
import CreateForm from '../../components/user/CreateForm';
import PageContainer from '../../components/PageContainer';
import { toast } from 'react-toastify';
import Divider from '@mui/material/Divider';
import { userValidate } from '../../validation/UserValidation';
import { createUser } from '../../api/UserApi';

const INITIAL_FORM_VALUES = {
  Username:'',
  Email:'',
  Password:'',
  Mobile:'',
  RoleId:'',
  Status:'',
  IsCheckIp:false,
  LoginTypes:[],
};

export default function UserCreate() {
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
  console.log(name, value,type);

    let finalValue = value;

    if (type === "number") {
      finalValue = value === "" ? null : Number(value);
    }

    if (type === "checkbox") {
      finalValue = Boolean(value);
    }

    if (type === "radio") {
      finalValue = Number(value);
    }

    const newFormValues = {
      ...formValues,
      [name]: finalValue,
    };

    setFormValues(newFormValues);

    const { issues } = userValidate(newFormValues);

    setFormErrors({
      ...formErrors,
      [name]: issues?.find(i => i.path?.[0] === name)?.message,
    });

  },
  [formValues, formErrors],
);
  const handleFormSubmit = React.useCallback(async () => {
    console.log('handleFormSubmit',formValues)
    const { issues } = userValidate(formValues);
    console.log('ISSUEhandleFormSubmit',issues)
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

        createUser(JSON.stringify(formValues))
        .then(() => {
          console.log("create",formValues)

          toast.success("کاربر با موفقیت ایجاد شد.")

          navigate('/users');
        })
  
  }, [formValues, navigate, setFormErrors]);

  return (
    <PageContainer
      title="ایجاد کاربر"
    >
      <Divider sx={{marginBottom:"4%"}} />
      <CreateForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        submitButtonLabel="ذخیره"
      />
    </PageContainer>
  );
}
